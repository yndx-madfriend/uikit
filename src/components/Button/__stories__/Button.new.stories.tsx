import React from 'react';

import {Gear} from '@gravity-ui/icons';
import type {Meta, StoryFn} from '@storybook/react';

import {Icon} from '../../Icon';
import {Button} from '../Button';

export default {
    title: 'Components/Basic/Button',
    id: 'components/Button',
    args: {
        view: 'normal',
        size: 'm',
        state: 'normal',
        content: 'Button',
        icon: 'none',
    },
    argTypes: {
        view: {
            options: [
                'normal',
                'action',
                'outlined',
                'outlined-info',
                'outlined-success',
                'outlined-warning',
                'outlined-danger',
                'outlined-action',
                'raised',
                'flat',
                'flat-secondary',
                'flat-info',
                'flat-success',
                'flat-warning',
                'flat-danger',
                'flat-action',
                'normal-contrast',
                'outlined-contrast',
                'flat-contrast',
            ],
            control: {type: 'select'},
        },
        size: {
            options: ['xs', 's', 'm', 'l', 'xl'],
            control: {type: 'radio'},
        },
        state: {
            options: ['normal', 'disabled', 'loading', 'selected'],
            control: {type: 'radio'},
        },
        width: {
            options: [undefined, 'auto', 'max'],
            control: {type: 'radio'},
        },
        content: {
            control: {type: 'text'},
        },
        icon: {
            options: ['none', 'left', 'right', 'only'],
            control: {type: 'radio'},
        },
    },
    parameters: {
        order: -100,
    },
} as Meta;

const iconSizeMap: Record<string, number> = {
    s: 16,
    m: 18,
    l: 22,
    xl: 26,
};

export const Playground: StoryFn = (args) => {
    const content = [args.content];
    const icon = <Icon data={Gear} size={iconSizeMap[args.size]} />;

    if (args.icon === 'left') {
        content.unshift(icon);
    } else if (args.icon === 'right') {
        content.push(icon);
    } else if (args.icon === 'only') {
        content.splice(0, 1, icon);
    }

    return (
        <Button
            view={args.state === 'selected' ? 'normal' : args.view}
            size={args.size}
            disabled={args.state === 'disabled'}
            loading={args.state === 'loading'}
            selected={args.state === 'selected'}
            width={args.width}
        >
            {content}
        </Button>
    );
};
Playground.storyName = 'Button';
