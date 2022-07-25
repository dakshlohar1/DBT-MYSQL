import {
    Alert,
    Button,
    Classes,
    Divider,
    Intent,
    Menu,
    MenuItem,
} from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    useDuplicateMutation,
    useUpdateMutation,
} from '../../../hooks/useSavedQuery';
import { useApp } from '../../../providers/AppProvider';
import { useExplorer } from '../../../providers/ExplorerProvider';
import { TrackSection } from '../../../providers/TrackingProvider';
import { SectionName } from '../../../types/Events';
import { UpdatedInfo } from '../../common/ActionCard';
import DeleteActionModal from '../../common/modal/DeleteActionModal';
import MoveToSpaceModal from '../../common/modal/MoveToSpaceModal';
import AddTilesToDashboardModal from '../../SavedDashboards/AddTilesToDashboardModal';
import CreateSavedQueryModal from '../../SavedQueries/CreateSavedQueryModal';
import RenameSavedChartModal from '../../SavedQueries/RenameSavedChartModal';
import ShareLinkButton from '../../ShareLinkButton';
import SaveChartButton from '../SaveChartButton';
import {
    ButtonWithMarginLeft,
    ChartName,
    TitleWrapper,
    Wrapper,
} from './SavedChartsHeader.styles';

const SavedChartsHeader: FC = () => {
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const history = useHistory();
    const {
        state: {
            isEditMode,
            unsavedChartVersion,
            hasUnsavedChanges,
            savedChart,
        },
        actions: { reset },
    } = useExplorer();
    const [blockedNavigationLocation, setBlockedNavigationLocation] =
        useState<string>();
    const [isSaveWarningModalOpen, setIsSaveWarningModalOpen] =
        useState<boolean>(false);
    const [isRenamingChart, setIsRenamingChart] = useState(false);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState<boolean>(false);
    const [isAddToDashboardModalOpen, setIsAddToDashboardModalOpen] =
        useState<boolean>(false);
    const [isMoveToSpaceModalOpen, setIsMoveToSpaceModalOpen] =
        useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
        useState<boolean>(false);
    const { user } = useApp();

    const updateSavedChart = useUpdateMutation(savedChart?.uuid);

    const { mutate: duplicateChart } = useDuplicateMutation(
        savedChart?.uuid || '',
    );
    const chartId = savedChart?.uuid || '';

    useEffect(() => {
        const checkReload = (event: BeforeUnloadEvent) => {
            if (hasUnsavedChanges && isEditMode) {
                const message =
                    'You have unsaved changes to your dashboard! Are you sure you want to leave without saving?';
                event.returnValue = message;
                return message;
            }
        };
        window.addEventListener('beforeunload', checkReload);
        return () => window.removeEventListener('beforeunload', checkReload);
    }, [hasUnsavedChanges, isEditMode]);
    useEffect(() => {
        history.block((prompt) => {
            if (
                hasUnsavedChanges &&
                isEditMode &&
                !prompt.pathname.includes(
                    `/projects/${projectUuid}/saved/${savedChart?.uuid}`,
                )
            ) {
                setBlockedNavigationLocation(prompt.pathname);
                setIsSaveWarningModalOpen(true);
                return false; //blocks history
            }
            return undefined; // allow history
        });

        return () => {
            history.block(() => {});
        };
    }, [
        history,
        projectUuid,
        savedChart,
        hasUnsavedChanges,
        setIsSaveWarningModalOpen,
        isEditMode,
    ]);

    return (
        <TrackSection name={SectionName.EXPLORER_TOP_BUTTONS}>
            <Alert
                isOpen={isSaveWarningModalOpen}
                cancelButtonText="Stay"
                confirmButtonText="Leave page"
                intent={Intent.DANGER}
                icon="warning-sign"
                onCancel={() => setIsSaveWarningModalOpen(false)}
                onConfirm={() => {
                    history.block(() => {});
                    if (blockedNavigationLocation)
                        history.push(blockedNavigationLocation);
                }}
            >
                <p>
                    You have unsaved changes to your chart! Are you sure you
                    want to leave without saving?{' '}
                </p>
            </Alert>
            <Wrapper>
                <TitleWrapper>
                    {savedChart && (
                        <>
                            <ChartName
                                className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                            >
                                {savedChart.name}
                                {savedChart.description && (
                                    <Tooltip2
                                        content={savedChart.description}
                                        position="bottom"
                                    >
                                        <Button icon="info-sign" minimal />
                                    </Tooltip2>
                                )}
                                {user.data?.ability?.can(
                                    'manage',
                                    'SavedChart',
                                ) && (
                                    <Button
                                        icon="edit"
                                        disabled={updateSavedChart.isLoading}
                                        onClick={() => setIsRenamingChart(true)}
                                        minimal
                                    />
                                )}
                                <RenameSavedChartModal
                                    savedChartUuid={savedChart.uuid}
                                    isOpen={isRenamingChart}
                                    onClose={() => setIsRenamingChart(false)}
                                />
                            </ChartName>

                            <UpdatedInfo
                                updatedAt={savedChart.updatedAt}
                                user={savedChart.updatedByUser}
                            />
                        </>
                    )}
                </TitleWrapper>
                {user.data?.ability?.can('manage', 'SavedChart') && (
                    <div>
                        {!isEditMode ? (
                            <>
                                <Button
                                    icon="edit"
                                    onClick={() =>
                                        history.push({
                                            pathname: `/projects/${savedChart?.projectUuid}/saved/${savedChart?.uuid}/edit`,
                                        })
                                    }
                                >
                                    Edit chart
                                </Button>
                            </>
                        ) : (
                            <>
                                <SaveChartButton />
                                <ButtonWithMarginLeft
                                    onClick={() => {
                                        reset();
                                        history.push({
                                            pathname: `/projects/${savedChart?.projectUuid}/saved/${savedChart?.uuid}/view`,
                                        });
                                    }}
                                >
                                    Cancel
                                </ButtonWithMarginLeft>
                            </>
                        )}

                        <ShareLinkButton
                            url={`${window.location.origin}/projects/${savedChart?.projectUuid}/saved/${savedChart?.uuid}/view`}
                        />
                        <Popover2
                            placement="bottom"
                            disabled={!unsavedChartVersion.tableName}
                            content={
                                <Menu>
                                    <MenuItem
                                        icon={
                                            hasUnsavedChanges
                                                ? 'add'
                                                : 'duplicate'
                                        }
                                        text={
                                            hasUnsavedChanges
                                                ? 'Save chart as'
                                                : 'Duplicate'
                                        }
                                        onClick={() => {
                                            if (
                                                savedChart?.uuid &&
                                                hasUnsavedChanges
                                            ) {
                                                setIsQueryModalOpen(true);
                                            } else {
                                                duplicateChart(chartId);
                                            }
                                        }}
                                    />
                                    <MenuItem
                                        icon="control"
                                        text="Add to dashboard"
                                        onClick={() =>
                                            setIsAddToDashboardModalOpen(true)
                                        }
                                    />

                                    <Divider />
                                    <MenuItem
                                        icon="trash"
                                        text="Delete"
                                        intent="danger"
                                        onClick={() =>
                                            setIsDeleteDialogOpen(true)
                                        }
                                    />
                                </Menu>
                            }
                        >
                            <ButtonWithMarginLeft
                                icon="more"
                                disabled={!unsavedChartVersion.tableName}
                            />
                        </Popover2>
                    </div>
                )}
            </Wrapper>
            {unsavedChartVersion && (
                <CreateSavedQueryModal
                    isOpen={isQueryModalOpen}
                    savedData={unsavedChartVersion}
                    onClose={() => setIsQueryModalOpen(false)}
                />
            )}
            {savedChart && (
                <AddTilesToDashboardModal
                    isOpen={isAddToDashboardModalOpen}
                    savedChart={savedChart}
                    onClose={() => setIsAddToDashboardModalOpen(false)}
                />
            )}
            {isDeleteDialogOpen && savedChart?.uuid && (
                <DeleteActionModal
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    uuid={savedChart.uuid}
                    name={savedChart.name}
                    isChart
                    isExplorer
                />
            )}
            {isMoveToSpaceModalOpen && savedChart?.uuid && (
                <MoveToSpaceModal
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsMoveToSpaceModalOpen(false)}
                    uuid={savedChart.uuid}
                    isChart
                />
            )}
        </TrackSection>
    );
};

export default SavedChartsHeader;
