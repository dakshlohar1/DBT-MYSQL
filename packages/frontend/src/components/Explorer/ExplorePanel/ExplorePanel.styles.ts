import { Divider, Menu } from '@blueprintjs/core';
import styled from 'styled-components';
import SimpleButton from '../../common/SimpleButton';

export const LoadingStateWrapper = styled(Menu)`
    flex: 1;
`;

export const ContentWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 18px;
`;

export const TableTitle = styled.p`
    padding: 0.5em 0 0 0;
`;

export const BackButton = styled(SimpleButton)`
    align-self: flex-start;
    padding-left: 0;
`;
export const ExpandableHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    h4 {
        margin: 0;
        padding: 0;
    }
`;

export const ExpandableWrapper = styled.div`
    box-shadow: none;
    padding: 0 5px 0 2px;
    margin-top: 12px;
`;

export const TableDivider = styled(Divider)`
    margin: 18px 3px;
`;

export const TableDescription = styled.p`
    margin: 0;
`;
