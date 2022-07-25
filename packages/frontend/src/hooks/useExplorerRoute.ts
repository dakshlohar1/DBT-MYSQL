import { ChartType, CreateSavedChartVersion } from '@lightdash/common';
import { useEffect, useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';
import {
    ExplorerReduceState,
    ExplorerSection,
    useExplorer,
} from '../providers/ExplorerProvider';

export const getExplorerUrlFromCreateSavedChartVersion = (
    projectUuid: string,
    createSavedChart: CreateSavedChartVersion,
): { pathname: string; search: string } => {
    const newParams = new URLSearchParams();
    newParams.set(
        'create_saved_chart_version',
        JSON.stringify(createSavedChart),
    );
    return {
        pathname: `/projects/${projectUuid}/tables/${createSavedChart.tableName}`,
        search: newParams.toString(),
    };
};

export const parseExplorerSearchParams = (
    search: string,
): CreateSavedChartVersion | undefined => {
    const searchParams = new URLSearchParams(search);
    const chartConfigSearchParam = searchParams.get(
        'create_saved_chart_version',
    );
    return chartConfigSearchParam
        ? JSON.parse(chartConfigSearchParam)
        : undefined;
};

export const useExplorerRoute = () => {
    const history = useHistory();
    const pathParams = useParams<{
        projectUuid: string;
        tableId: string | undefined;
    }>();
    const {
        state: { unsavedChartVersion },
        queryResults: { data: queryResultsData },
        actions: { clear, setTableName },
    } = useExplorer();

    // Update url params based on pristine state
    useEffect(() => {
        if (queryResultsData?.metricQuery) {
            history.replace(
                getExplorerUrlFromCreateSavedChartVersion(
                    pathParams.projectUuid,
                    {
                        ...unsavedChartVersion,
                        metricQuery: queryResultsData.metricQuery,
                    },
                ),
            );
        }
    }, [
        queryResultsData,
        history,
        pathParams.projectUuid,
        unsavedChartVersion,
    ]);

    useEffect(() => {
        if (!pathParams.tableId) {
            clear();
        } else {
            setTableName(pathParams.tableId);
        }
    }, [pathParams.tableId, clear, setTableName]);
};

export const useExplorerUrlState = (): ExplorerReduceState | undefined => {
    const { showToastError } = useApp();
    const { search } = useLocation();
    const pathParams = useParams<{
        projectUuid: string;
        tableId: string | undefined;
    }>();

    return useMemo(() => {
        if (pathParams.tableId) {
            const unsavedChartVersion = parseExplorerSearchParams(search) || {
                tableName: '',
                metricQuery: {
                    dimensions: [],
                    metrics: [],
                    filters: {},
                    sorts: [],
                    limit: 500,
                    tableCalculations: [],
                    additionalMetrics: [],
                },
                pivotConfig: undefined,
                tableConfig: {
                    columnOrder: [],
                },
                chartConfig: {
                    type: ChartType.CARTESIAN,
                    config: { layout: {}, eChartsConfig: {} },
                },
            };
            try {
                return {
                    shouldFetchResults: true,
                    expandedSections: unsavedChartVersion
                        ? [
                              ExplorerSection.VISUALIZATION,
                              ExplorerSection.RESULTS,
                          ]
                        : [ExplorerSection.RESULTS],
                    unsavedChartVersion,
                };
            } catch (e: any) {
                showToastError({ title: 'Error parsing url', subtitle: e });
            }
        }
    }, [pathParams, search, showToastError]);
};
