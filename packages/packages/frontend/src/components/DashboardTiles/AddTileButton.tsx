import {
    Button,
    Menu,
    MenuDivider,
    MenuItem,
    PopoverPosition,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Dashboard, DashboardTileTypes } from '@lightdash/common';
import React, { FC, useCallback, useState } from 'react';
import AddChartTilesModal from './TileForms/AddChartTilesModal';
import { AddTileModal } from './TileForms/TileModal';

type Props = {
    onAddTiles: (tiles: Dashboard['tiles'][number][]) => void;
};

const AddTileButton: FC<Props> = ({ onAddTiles }) => {
    const [addTileType, setAddTileType] = useState<DashboardTileTypes>();
    const [isAddChartTilesModalOpen, setIsAddChartTilesModalOpen] =
        useState<boolean>(false);
    const onAddTile = useCallback(
        (tile: Dashboard['tiles'][number]) => {
            onAddTiles([tile]);
        },
        [onAddTiles],
    );
    return (
        <>
            <Popover2
                className="non-draggable"
                content={
                    <Menu>
                        <MenuItem
                            icon="chart"
                            text="Saved chart"
                            onClick={() => setIsAddChartTilesModalOpen(true)}
                        />
                        <MenuDivider />
                        <MenuItem
                            icon="new-text-box"
                            text="Markdown"
                            onClick={() =>
                                setAddTileType(DashboardTileTypes.MARKDOWN)
                            }
                        />
                        <MenuDivider />
                        <MenuItem
                            icon="mobile-video"
                            text="Loom video"
                            onClick={() =>
                                setAddTileType(DashboardTileTypes.LOOM)
                            }
                        />
                    </Menu>
                }
                position={PopoverPosition.BOTTOM_RIGHT}
                lazy
            >
                <Button
                    icon="plus"
                    style={{ marginLeft: '10px' }}
                    text="Add tile"
                />
            </Popover2>
            {isAddChartTilesModalOpen && (
                <AddChartTilesModal
                    onClose={() => setIsAddChartTilesModalOpen(false)}
                    onAddTiles={onAddTiles}
                />
            )}
            {addTileType && (
                <AddTileModal
                    onClose={() => setAddTileType(undefined)}
                    type={addTileType}
                    onAddTile={onAddTile}
                />
            )}
        </>
    );
};

export default AddTileButton;
