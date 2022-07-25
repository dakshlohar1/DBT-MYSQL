import { KeyCombo, useHotkeys } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import React, { useCallback, useMemo } from 'react';
import { useExplorer } from '../providers/ExplorerProvider';
import { useTracking } from '../providers/TrackingProvider';
import { EventName } from '../types/Events';
import { BigButton } from './common/BigButton';

export const RefreshButton = () => {
    const {
        state: { isValidQuery },
        queryResults: { isLoading: isLoadingResults },
        actions: { fetchResults },
    } = useExplorer();
    const { track } = useTracking();
    const isDisabled = !isValidQuery;
    const onClick = useCallback(async () => {
        fetchResults();
        track({
            name: EventName.RUN_QUERY_BUTTON_CLICKED,
        });
    }, [fetchResults, track]);
    const hotkeys = useMemo(() => {
        const runQueryHotkey = {
            combo: 'ctrl+enter',
            group: 'Explorer',
            label: 'Run query',
            allowInInput: true,
            onKeyDown: onClick,
            global: true,
            preventDefault: true,
            stopPropagation: true,
        };
        return [
            runQueryHotkey,
            {
                ...runQueryHotkey,
                combo: 'cmd+enter',
            },
        ];
    }, [onClick]);
    useHotkeys(hotkeys);
    return (
        <Tooltip2
            content={<KeyCombo combo="cmd+enter" />}
            position="bottom"
            disabled={isDisabled || isLoadingResults}
        >
            <BigButton
                icon="play"
                intent="primary"
                style={{ width: 150 }}
                onClick={onClick}
                disabled={isDisabled}
                loading={isLoadingResults}
            >
                Run query
            </BigButton>
        </Tooltip2>
    );
};
