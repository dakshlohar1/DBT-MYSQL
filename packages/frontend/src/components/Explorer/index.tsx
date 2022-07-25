import { FC } from 'react';
import { ExplorerWrapper } from './Explorer.styles';
import ExplorerHeader from './ExplorerHeader';
import FiltersCard from './FiltersCard/FiltersCard';
import ResultsCard from './ResultsCard/ResultsCard';
import SqlCard from './SqlCard/SqlCard';
import VisualizationCard from './VisualizationCard/VisualizationCard';

const Explorer: FC = () => {
    return (
        <ExplorerWrapper>
            <ExplorerHeader />
            <FiltersCard />
            <VisualizationCard />
            <ResultsCard />
            <SqlCard />
        </ExplorerWrapper>
    );
};

export default Explorer;
