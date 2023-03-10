import React from 'react';

import {layerManager, LayerCloseReason, LayerExtendableProps, LayerConfig} from './LayerManager';

export type {LayerCloseReason, LayerExtendableProps};

export interface LayerProps extends LayerConfig {
    open?: boolean;
    enabled?: boolean;
}

export function useLayer({
    open,
    disableEscapeKeyDown,
    disableOutsideClick,
    onEscapeKeyDown,
    onEnterKeyDown,
    onOutsideClick,
    onClose,
    contentRefs,
    enabled = true,
    idle,
    idlePriority,
    idleTimeout,
}: LayerProps): boolean {
    const [frozenIdle] = React.useState(idle);

    const layerConfigRef = React.useRef<LayerConfig>({
        disableEscapeKeyDown,
        disableOutsideClick,
        onEscapeKeyDown,
        onEnterKeyDown,
        onOutsideClick,
        onClose,
        contentRefs,
        idle: frozenIdle,
        idlePriority,
        idleTimeout,
    });

    const [allowedOpen, setAllowedOpen] = React.useState(idle !== true);

    React.useEffect(() => {
        Object.assign(layerConfigRef.current, {
            disableEscapeKeyDown,
            disableOutsideClick,
            onEscapeKeyDown,
            onEnterKeyDown,
            onOutsideClick,
            onClose,
            contentRefs,
            enabled,
            onRemove: setAllowedOpen.bind(null, false),
        });
    }, [
        disableEscapeKeyDown,
        disableOutsideClick,
        onEscapeKeyDown,
        onEnterKeyDown,
        onOutsideClick,
        onClose,
        contentRefs,
        enabled,
        setAllowedOpen,
    ]);

    React.useEffect(() => {
        if (open && enabled) {
            const layerConfig = layerConfigRef.current;
            layerManager
                .add(layerConfig)
                .then(() => {
                    setAllowedOpen(true);
                })
                .catch(() => {
                    setAllowedOpen(false);
                });

            return () => {
                layerManager.remove(layerConfig);
            };
        }

        return undefined;
    }, [open, enabled]);

    return allowedOpen;
}
