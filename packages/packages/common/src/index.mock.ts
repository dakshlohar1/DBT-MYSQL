import {
    Dimension,
    DimensionType,
    FieldType,
    Metric,
    MetricType,
    TableCalculation,
} from '.';

export const dimension: Dimension = {
    fieldType: FieldType.DIMENSION,
    type: DimensionType.STRING,
    name: 'name',
    label: 'label',
    table: 'table',
    tableLabel: 'tableLabel',
    sql: 'sql',
    hidden: false,
};

export const metric: Metric = {
    ...dimension,
    fieldType: FieldType.METRIC,
    type: MetricType.COUNT,
    isAutoGenerated: false,
};

export const tableCalculation: TableCalculation = {
    name: 'name',
    displayName: 'displayName',
    sql: 'sql',
};
