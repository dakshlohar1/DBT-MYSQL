import { Card, Colors } from '@blueprintjs/core';
import styled from 'styled-components';

export const PageContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: stretch;
    align-items: flex-start;
`;

export const SideBar = styled.div`
    display: flex;
    flex-direction: row;
    position: sticky;
    top: 50px;
`;

export const SideBarCard = styled(Card)`
    height: calc(100vh - 50px);
    overflow: hidden;
`;

export const Main = styled.div`
    padding: 10px 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    min-width: 0;
`;

export const Resizer = styled.div<{ $isResizing: boolean }>`
    flex: 1;
    width: 5px;
    cursor: col-resize;
    resize: horizontal;
    background: ${({ $isResizing }) =>
        $isResizing
            ? `linear-gradient(90deg, ${Colors.BLUE5} 0%, rgba(0,0,0,0) 100%);`
            : 'none'};
`;
