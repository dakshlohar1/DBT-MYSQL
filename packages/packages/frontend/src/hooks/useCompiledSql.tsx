import {
    ApiCompiledQueryResults,
    ApiError,
    MetricQuery,
} from '@lightdash/common';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { lightdashApi } from '../api';
import { useExplorer } from '../providers/ExplorerProvider';
import useQueryError from './useQueryError';

const getCompiledQuery = async (
    projectUuid: string,
    tableId: string,
    query: MetricQuery,
) =>
    lightdashApi<ApiCompiledQueryResults>({
        url: `/projects/${projectUuid}/explores/${tableId}/compileQuery`,
        method: 'POST',
        body: JSON.stringify(query),
    });

export const useCompliedSql = () => {
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const {
        state: {
            unsavedChartVersion: {
                tableName: tableId,
                metricQuery: {
                    dimensions,
                    metrics,
                    sorts,
                    filters,
                    limit,
                    tableCalculations,
                    additionalMetrics,
                },
            },
        },
    } = useExplorer();
    const setErrorResponse = useQueryError();
    const metricQuery: MetricQuery = {
        dimensions: Array.from(dimensions),
        metrics: Array.from(metrics),
        sorts,
        filters,
        limit: limit || 500,
        tableCalculations,
        additionalMetrics,
    };
    const queryKey = ['compiledQuery', tableId, metricQuery, projectUuid];
    return useQuery<ApiCompiledQueryResults, ApiError>({
        enabled: tableId !== undefined,
        queryKey,
        queryFn: () =>
            getCompiledQuery(projectUuid, tableId || '', metricQuery),
        onError: (result) => setErrorResponse(result),
    });
};
