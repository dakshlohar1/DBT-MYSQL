import { NonIdealState, Spinner } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import Explorer from '../components/Explorer';
import ExplorePanel from '../components/Explorer/ExplorePanel/index';
import SavedChartsHeader from '../components/Explorer/SavedChartsHeader';
import { useSavedQuery } from '../hooks/useSavedQuery';
import useSidebarResize from '../hooks/useSidebarResize';
import {
    ExplorerProvider,
    ExplorerSection,
} from '../providers/ExplorerProvider';
import {
    CardContent,
    Drawer,
    MainContent,
    PageWrapper,
    Resizer,
    StickySidebar,
    WidthHack,
} from './SavedExplorer.styles';

const SavedExplorer = () => {
    const { savedQueryUuid, mode } = useParams<{
        savedQueryUuid: string;
        projectUuid: string;
        mode?: string;
    }>();
    const isEditMode = useMemo(() => mode === 'edit', [mode]);
    const { data, isLoading, error } = useSavedQuery({
        id: savedQueryUuid,
    });
    const { sidebarRef, sidebarWidth, isResizing, startResizing } =
        useSidebarResize({
            defaultWidth: 400,
            minWidth: 300,
            maxWidth: 600,
        });

    if (isLoading) {
        return (
            <div style={{ marginTop: '20px' }}>
                <NonIdealState title="Loading..." icon={<Spinner />} />
            </div>
        );
    }
    if (error) {
        return (
            <div style={{ marginTop: '20px' }}>
                <NonIdealState
                    title="Unexpected error"
                    description={error.error.message}
                />
            </div>
        );
    }

    return (
        <ExplorerProvider
            isEditMode={isEditMode}
            initialState={
                data
                    ? {
                          shouldFetchResults: true,
                          expandedSections: [ExplorerSection.VISUALIZATION],
                          unsavedChartVersion: {
                              tableName: data.tableName,
                              chartConfig: data.chartConfig,
                              metricQuery: data.metricQuery,
                              tableConfig: data.tableConfig,
                              pivotConfig: data.pivotConfig,
                          },
                      }
                    : undefined
            }
            savedChart={data}
        >
            <SavedChartsHeader />
            <PageWrapper>
                <StickySidebar>
                    <Transition in={isEditMode} timeout={500}>
                        {(state) => (
                            <>
                                <Drawer
                                    elevation={1}
                                    $state={state}
                                    style={{
                                        width: sidebarWidth,
                                        left: [
                                            'exiting',
                                            'exited',
                                            'unmounted',
                                        ].includes(state)
                                            ? -sidebarWidth
                                            : 0,
                                    }}
                                >
                                    <CardContent>
                                        <ExplorePanel />
                                    </CardContent>
                                </Drawer>
                                <WidthHack
                                    ref={sidebarRef}
                                    $state={state}
                                    style={{
                                        width: [
                                            'exiting',
                                            'exited',
                                            'unmounted',
                                        ].includes(state)
                                            ? 0
                                            : sidebarWidth + 5,
                                    }}
                                >
                                    {isEditMode && (
                                        <Resizer
                                            onMouseDown={startResizing}
                                            $isResizing={isResizing}
                                        />
                                    )}
                                </WidthHack>
                            </>
                        )}
                    </Transition>
                </StickySidebar>
                <MainContent>
                    <Explorer />
                </MainContent>
            </PageWrapper>
        </ExplorerProvider>
    );
};

export default SavedExplorer;
