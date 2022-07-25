import {
    ApiError,
    CreateSavedChart,
    CreateSavedChartVersion,
    SavedChart,
    UpdateSavedChart,
} from '@lightdash/common';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { lightdashApi } from '../api';
import { useApp } from '../providers/AppProvider';

const createSavedQuery = async (
    projectUuid: string,
    payload: CreateSavedChart,
): Promise<SavedChart> =>
    lightdashApi<SavedChart>({
        url: `/projects/${projectUuid}/saved`,
        method: 'POST',
        body: JSON.stringify(payload),
    });

const duplicateSavedQuery = async (
    projectUuid: string,
    chartUuid: string,
): Promise<SavedChart> =>
    lightdashApi<SavedChart>({
        url: `/projects/${projectUuid}/saved?duplicateFrom=${chartUuid}`,
        method: 'POST',
        body: undefined,
    });

const deleteSavedQuery = async (id: string) =>
    lightdashApi<undefined>({
        url: `/saved/${id}`,
        method: 'DELETE',
        body: undefined,
    });

const updateSavedQuery = async (
    id: string,
    data: UpdateSavedChart,
): Promise<SavedChart> => {
    return lightdashApi<SavedChart>({
        url: `/saved/${id}`,
        method: 'PATCH',
        body: JSON.stringify({
            name: data.name,
            description: data.description,
            spaceUuid: data.spaceUuid,
        }),
    });
};

const getSavedQuery = async (id: string): Promise<SavedChart> =>
    lightdashApi<SavedChart>({
        url: `/saved/${id}`,
        method: 'GET',
        body: undefined,
    });

const addVersionSavedQuery = async ({
    uuid,
    payload,
}: {
    uuid: string;
    payload: CreateSavedChartVersion;
}): Promise<SavedChart> =>
    lightdashApi<SavedChart>({
        url: `/saved/${uuid}/version`,
        method: 'POST',
        body: JSON.stringify(payload),
    });

interface Args {
    id?: string;
}

export const useSavedQuery = ({ id }: Args = {}) =>
    useQuery<SavedChart, ApiError>({
        queryKey: ['saved_query', id],
        queryFn: () => getSavedQuery(id || ''),
        enabled: id !== undefined,
        retry: false,
    });

export const useDeleteMutation = () => {
    const queryClient = useQueryClient();
    const { showToastSuccess, showToastError } = useApp();
    return useMutation<undefined, ApiError, string>(deleteSavedQuery, {
        mutationKey: ['saved_query_create'],
        onSuccess: async () => {
            await queryClient.invalidateQueries('spaces');
            showToastSuccess({
                title: `Success! Chart was deleted.`,
            });
        },
        onError: (error) => {
            showToastError({
                title: `Failed to delete chart`,
                subtitle: error.error.message,
            });
        },
    });
};

export const useUpdateMutation = (savedQueryUuid?: string) => {
    const queryClient = useQueryClient();
    const { showToastSuccess, showToastError } = useApp();
    const { projectUuid } = useParams<{ projectUuid: string }>();

    return useMutation<SavedChart, ApiError, UpdateSavedChart>(
        (data) => {
            if (savedQueryUuid) {
                return updateSavedQuery(savedQueryUuid, data);
            }
            throw new Error('Saved chart ID is undefined');
        },
        {
            mutationKey: ['saved_query_create'],
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(['space', projectUuid]);

                await queryClient.invalidateQueries('spaces');
                queryClient.setQueryData(['saved_query', data.uuid], data);
                showToastSuccess({
                    title: `Success! Chart was saved.`,
                });
            },
            onError: (error) => {
                showToastError({
                    title: `Failed to save chart`,
                    subtitle: error.error.message,
                });
            },
        },
    );
};

export const useCreateMutation = () => {
    const history = useHistory();
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const queryClient = useQueryClient();
    const { showToastSuccess, showToastError } = useApp();
    return useMutation<SavedChart, ApiError, CreateSavedChart>(
        (data) => createSavedQuery(projectUuid, data),
        {
            mutationKey: ['saved_query_create', projectUuid],
            onSuccess: (data) => {
                queryClient.setQueryData(['saved_query', data.uuid], data);
                showToastSuccess({
                    title: `Success! Chart was saved.`,
                });
                history.push({
                    pathname: `/projects/${projectUuid}/saved/${data.uuid}/view`,
                });
            },
            onError: (error) => {
                showToastError({
                    title: `Failed to save chart`,
                    subtitle: error.error.message,
                });
            },
        },
    );
};

export const useDuplicateMutation = (
    chartUuid: string,
    showRedirectButton: boolean = false,
) => {
    const history = useHistory();
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const queryClient = useQueryClient();
    const { showToastSuccess, showToastError } = useApp();
    return useMutation<SavedChart, ApiError, string>(
        () => duplicateSavedQuery(projectUuid, chartUuid),
        {
            mutationKey: ['saved_query_create', projectUuid],
            onSuccess: async (data) => {
                await queryClient.invalidateQueries('spaces');

                if (!showRedirectButton) {
                    history.push({
                        pathname: `/projects/${projectUuid}/saved/${data.uuid}`,
                    });
                }

                showToastSuccess({
                    title: `Chart successfully duplicated!`,
                    action: showRedirectButton
                        ? {
                              text: 'Open chart',
                              icon: 'arrow-right',
                              onClick: () =>
                                  history.push(
                                      `/projects/${projectUuid}/saved/${data.uuid}`,
                                  ),
                          }
                        : undefined,
                });
            },
            onError: (error) => {
                showToastError({
                    title: `Failed to duplicate chart`,
                    subtitle: error.error.message,
                });
            },
        },
    );
};

export const useAddVersionMutation = () => {
    const history = useHistory();
    const queryClient = useQueryClient();
    const { showToastSuccess, showToastError } = useApp();
    return useMutation<
        SavedChart,
        ApiError,
        { uuid: string; payload: CreateSavedChartVersion }
    >(addVersionSavedQuery, {
        mutationKey: ['saved_query_version'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries('spaces');

            queryClient.setQueryData(['saved_query', data.uuid], data);
            showToastSuccess({
                title: `Success! Chart was updated.`,
            });
            history.push({
                pathname: `/projects/${data.projectUuid}/saved/${data.uuid}/view`,
            });
        },
        onError: (error) => {
            showToastError({
                title: `Failed to update chart`,
                subtitle: error.error.message,
            });
        },
    });
};
