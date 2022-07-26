import {
    CreateProject,
    DbtProjectType,
    Project,
    ProjectType,
} from '@lightdash/common';
import path from 'path';
import { getDbtContext } from '../dbt/context';
import {
    loadDbtTarget,
    warehouseCredentialsFromDbtTarget,
} from '../dbt/profile';
import { lightdashApi } from './dbt/apiClient';

type CreateProjectHandlerOptions = {
    name: string;
    projectDir: string;
    profilesDir: string;
    target: string | undefined;
    profile: string | undefined;
};
export const createProject = async (
    options: CreateProjectHandlerOptions,
): Promise<Project> => {
    const absoluteProjectPath = path.resolve(options.projectDir);
    const absoluteProfilesPath = path.resolve(options.profilesDir);
    const context = await getDbtContext({ projectDir: absoluteProjectPath });
    const profileName = options.profile || context.profileName;
    const { target, name: targetName } = await loadDbtTarget({
        profilesDir: absoluteProfilesPath,
        profileName,
        targetName: options.target,
    });
    const credentials = await warehouseCredentialsFromDbtTarget(target);
    const project: CreateProject = {
        name: options.name,
        type: ProjectType.PREVIEW,
        warehouseConnection: credentials,
        dbtConnection: {
            type: DbtProjectType.DBT,
            target: targetName,
        },
    };
    const createdProject = await lightdashApi<Project>({
        method: 'POST',
        url: `/api/v1/org/projects`,
        body: JSON.stringify(project),
    });
    return createdProject;
};
