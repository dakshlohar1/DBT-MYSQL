import { Colors, HTMLTable } from '@blueprintjs/core';
import styled, { css } from 'styled-components';

export const TableContainer = styled.div`
    flex: 1;
    padding: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;
export const TableScrollableWrapper = styled.div`
    overflow: auto;
    min-height: 30px;
`;

export const Table = styled(HTMLTable)`
    width: 100%;
    border-left: 1px solid #dcdcdd;
    border-right: 1px solid #dcdcdd;

    thead {
        position: sticky;
        top: 0;
        inset-block-start: 0; /* "top" */
        background: ${Colors.GRAY5};

        th:first-child {
            border-top: none !important;
            border-bottom: none !important;
        }

        th {
            border-top: none !important;
            border-bottom: none !important;
        }
    }

    tbody tr:first-child {
        td:first-child {
            box-shadow: none !important;
        }

        td {
            box-shadow: inset 1px 0 0 0 rgb(17 20 24 / 15%) !important;
        }
    }

    tfoot {
        position: sticky;
        bottom: 0;
        inset-block-end: 0; /* "bottom" */

        th:first-child {
            border-top: none !important;
            border-bottom: none !important;
            box-shadow: inset 0 1px 0 #dcdcdd, inset 0 -1px 0 #dcdcdd !important;
        }

        th {
            border-top: none !important;
            border-bottom: none !important;
            box-shadow: inset 0 1px 0 #dcdcdd, inset 0 -1px 0 #dcdcdd,
                inset 1px 0 0 0 rgb(17 20 24 / 15%) !important;
        }
    }
`;

export const TableFooter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
`;

const CellStyles = css<{ $isNaN: boolean }>`
    text-align: ${({ $isNaN }) => ($isNaN ? 'left' : 'right')} !important;
`;

export const BodyCell = styled.td<{ $isNaN: boolean; $rowIndex: number }>`
    ${CellStyles}
    ${({ $rowIndex }) =>
        $rowIndex % 2 &&
        `
        background-color: ${Colors.LIGHT_GRAY5}
  `}
`;

export const FooterCell = styled.th<{ $isNaN: boolean }>`
    ${CellStyles}
    ${() =>
        `
        background-color: ${Colors.WHITE}
  `}
`;

export const PaginationWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;

export const PageCount = styled.span`
    color: ${Colors.GRAY1};
`;
