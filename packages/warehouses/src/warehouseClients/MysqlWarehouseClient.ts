import {
    CreateMysqlCredentials,
    DimensionType,
    WarehouseConnectionError,
    WarehouseQueryError,
} from '@lightdash/common';
import * as pg from 'pg';
import { PoolConfig } from 'pg';
import { WarehouseClient } from '../types';

export enum MysqlTypes {
    INTEGER = 'integer',
    INT = 'int',
    INT2 = 'int2',
    INT4 = 'int4',
    INT8 = 'int8',
    MONEY = 'money',
    SMALLSERIAL = 'smallserial',
    SERIAL = 'serial',
    SERIAL2 = 'serial2',
    SERIAL4 = 'serial4',
    SERIAL8 = 'serial8',
    BIGSERIAL = 'bigserial',
    BIGINT = 'bigint',
    SMALLINT = 'smallint',
    BOOLEAN = 'boolean',
    BOOL = 'bool',
    DATE = 'date',
    DOUBLE_PRECISION = 'double precision',
    FLOAT = 'float',
    FLOAT4 = 'float4',
    FLOAT8 = 'float8',
    JSON = 'json',
    JSONB = 'jsonb',
    NUMERIC = 'numeric',
    DECIMAL = 'decimal',
    REAL = 'real',
    CHAR = 'char',
    CHARACTER = 'character',
    NCHAR = 'nchar',
    BPCHAR = 'bpchar',
    VARCHAR = 'varchar',
    CHARACTER_VARYING = 'character varying',
    NVARCHAR = 'nvarchar',
    TEXT = 'text',
    TIME = 'time',
    TIME_TZ = 'timetz',
    TIME_WITHOUT_TIME_ZONE = 'time without time zone',
    TIMESTAMP = 'timestamp',
    TIMESTAMP_TZ = 'timestamptz',
    TIMESTAMP_WITHOUT_TIME_ZONE = 'timestamp without time zone',
}

const mapFieldType = (type: string): DimensionType => {
    switch (type) {
        case MysqlTypes.DECIMAL:
        case MysqlTypes.NUMERIC:
        case MysqlTypes.INTEGER:
        case MysqlTypes.MONEY:
        case MysqlTypes.SMALLSERIAL:
        case MysqlTypes.SERIAL:
        case MysqlTypes.SERIAL2:
        case MysqlTypes.SERIAL4:
        case MysqlTypes.SERIAL8:
        case MysqlTypes.BIGSERIAL:
        case MysqlTypes.INT2:
        case MysqlTypes.INT4:
        case MysqlTypes.INT8:
        case MysqlTypes.BIGINT:
        case MysqlTypes.SMALLINT:
        case MysqlTypes.FLOAT:
        case MysqlTypes.FLOAT4:
        case MysqlTypes.FLOAT8:
        case MysqlTypes.DOUBLE_PRECISION:
        case MysqlTypes.REAL:
            return DimensionType.NUMBER;
        case MysqlTypes.DATE:
            return DimensionType.DATE;
        case MysqlTypes.TIME:
        case MysqlTypes.TIME_TZ:
        case MysqlTypes.TIMESTAMP:
        case MysqlTypes.TIMESTAMP_TZ:
        case MysqlTypes.TIME_WITHOUT_TIME_ZONE:
        case MysqlTypes.TIMESTAMP_WITHOUT_TIME_ZONE:
            return DimensionType.TIMESTAMP;
        case MysqlTypes.BOOLEAN:
        case MysqlTypes.BOOL:
            return DimensionType.BOOLEAN;
        default:
            return DimensionType.STRING;
    }
};

const { builtins } = pg.types;
const convertDataTypeIdToDimensionType = (
    dataTypeId: number,
): DimensionType => {
    switch (dataTypeId) {
        case builtins.NUMERIC:
        case builtins.MONEY:
        case builtins.INT2:
        case builtins.INT4:
        case builtins.INT8:
        case builtins.FLOAT4:
        case builtins.FLOAT8:
            return DimensionType.NUMBER;
        case builtins.DATE:
            return DimensionType.DATE;
        case builtins.TIME:
        case builtins.TIMETZ:
        case builtins.TIMESTAMP:
        case builtins.TIMESTAMPTZ:
            return DimensionType.TIMESTAMP;
        case builtins.BOOL:
            return DimensionType.BOOLEAN;
        default:
            return DimensionType.STRING;
    }
};

export class MysqlClient implements WarehouseClient {
    pool: pg.Pool;

    constructor(config: PoolConfig) {
        try {
            const pool = new pg.Pool(config);
            this.pool = pool;
        } catch (e) {
            throw new WarehouseConnectionError(e.message);
        }
    }

    async runQuery(sql: string) {
        try {
            const results = await this.pool.query(sql); // automatically checkouts client and cleans up
            const fields = results.fields.reduce(
                (acc, { name, dataTypeID }) => ({
                    ...acc,
                    [name]: {
                        type: convertDataTypeIdToDimensionType(dataTypeID),
                    },
                }),
                {},
            );
            return { fields, rows: results.rows };
        } catch (e) {
            throw new WarehouseQueryError(e.message);
        }
    }

    async test(): Promise<void> {
        await this.runQuery('SELECT 1');
    }

    async getCatalog(
        requests: {
            database: string;
            schema: string;
            table: string;
        }[],
    ) {
        const { databases, schemas, tables } = requests.reduce<{
            databases: Set<string>;
            schemas: Set<string>;
            tables: Set<string>;
        }>(
            (acc, { database, schema, table }) => ({
                databases: acc.databases.add(`'${database}'`),
                schemas: acc.schemas.add(`'${schema}'`),
                tables: acc.tables.add(`'${table}'`),
            }),
            {
                databases: new Set(),
                schemas: new Set(),
                tables: new Set(),
            },
        );
        if (databases.size <= 0 || schemas.size <= 0 || tables.size <= 0) {
            return {};
        }
        const query = `
            SELECT table_catalog,
                   table_schema,
                   table_name,
                   column_name,
                   data_type
            FROM information_schema.columns
            WHERE table_catalog IN (${Array.from(databases)})
              AND table_schema IN (${Array.from(schemas)})
              AND table_name IN (${Array.from(tables)})
        `;

        const { rows } = await this.runQuery(query);
        const catalog = rows.reduce(
            (
                acc,
                {
                    table_catalog,
                    table_schema,
                    table_name,
                    column_name,
                    data_type,
                },
            ) => {
                const match = requests.find(
                    ({ database, schema, table }) =>
                        database === table_catalog &&
                        schema === table_schema &&
                        table === table_name,
                );
                if (match) {
                    acc[table_catalog] = acc[table_catalog] || {};
                    acc[table_catalog][table_schema] =
                        acc[table_catalog][table_schema] || {};
                    acc[table_catalog][table_schema][table_name] =
                        acc[table_catalog][table_schema][table_name] || {};
                    acc[table_catalog][table_schema][table_name][column_name] =
                        mapFieldType(data_type);
                }

                return acc;
            },
            {},
        );
        return catalog;
    }
}

export class MysqlWarehouseClient
    extends MysqlClient
    implements WarehouseClient
{
    constructor(credentials: CreateMysqlCredentials) {
        super({
            connectionString: `jdbc:mysql//${credentials.user}:${credentials.password}@[${credentials.host}:${
                credentials.port
            }]/${
                credentials.dbname
            }?sslmode=${credentials.sslmode || 'prefer'}`,
        });
    }
}
