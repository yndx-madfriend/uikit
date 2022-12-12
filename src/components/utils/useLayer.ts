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
    category,
}: LayerProps): boolean {
    const layerConfigRef = React.useRef<LayerConfig>({
        disableEscapeKeyDown,
        disableOutsideClick,
        onEscapeKeyDown,
        onEnterKeyDown,
        onOutsideClick,
        onClose,
        contentRefs,
        category,
    });

    const [allowedOpen, setAllowedOpen] = React.useState(false);

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
    ]);

    React.useEffect(() => {
        if (open && enabled) {
            const layerConfig = layerConfigRef.current;
            const tryAdd = async () => {
                await layerManager.add(layerConfig);
                setAllowedOpen(true);
            };

            tryAdd();

            return () => {
                layerManager.remove(layerConfig);
            };
        }

        return undefined;
    }, [open, enabled]);

    return allowedOpen;
}
