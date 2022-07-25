import React, { FC } from 'react';
import LinkButton from '../../common/LinkButton';
import LatestDashboards from '../LatestDashboards';
import LatestSavedCharts from '../LatestSavedCharts';
import {
    Intro,
    LandingHeaderWrapper,
    LandingPanelWrapper,
    Title,
    WelcomeText,
} from './LandingPanel.styles';

interface Props {
    hasSavedChart: boolean;
    userName: string | undefined;
    projectUuid: string;
}

const LandingPanel: FC<Props> = ({ hasSavedChart, userName, projectUuid }) => {
    return (
        <LandingPanelWrapper>
            <LandingHeaderWrapper>
                <WelcomeText>
                    <Title>
                        {`Welcome${
                            userName ? ', ' + userName : ' to Lightdash'
                        }! ⚡`}
                    </Title>
                    <Intro>
                        Run a query to ask a business question or browse your
                        data below:
                    </Intro>
                </WelcomeText>
                <LinkButton
                    style={{ height: 40 }}
                    href={`/projects/${projectUuid}/tables`}
                    intent="primary"
                    icon="series-search"
                >
                    Run a query
                </LinkButton>
            </LandingHeaderWrapper>
            {/* SPACE_TODO <SpaceBrowser projectUuid={projectUuid} />*/}

            {hasSavedChart && <LatestDashboards projectUuid={projectUuid} />}
            <LatestSavedCharts projectUuid={projectUuid} />
        </LandingPanelWrapper>
    );
};

export default LandingPanel;
