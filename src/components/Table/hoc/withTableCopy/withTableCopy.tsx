import React from 'react';
import _memoize from 'lodash/memoize';
import {block} from '../../../utils/cn';
import {ClipboardButton} from '../../../ClipboardButton';
import {Table, TableDataItem, TableProps, TableColumnConfig} from '../../Table';

import './withTableCopy.scss';

export interface WithTableCopyProps {}

const b = block('table');

export function withTableCopy<I extends TableDataItem, E extends {} = {}>(
    TableComponent: React.ComponentType<TableProps<I> & E>,
): React.ComponentType<TableProps<I> & E & WithTableCopyProps> {
    const componentName = TableComponent.displayName || TableComponent.name || 'Component';
    const displayName = `withTableCopy(${componentName})`;

    return class extends React.Component<TableProps<I> & E & WithTableCopyProps> {
        static displayName = displayName;

        render() {
            const {columns, onRowClick, ...restTableProps} = this.props;

            return (
                <TableComponent
                    {...(restTableProps as Omit<TableProps<I>, 'columns'> & E)}
                    columns={this.enhanceColumns(columns)}
                    onRowClick={this.enhanceOnRowClick(onRowClick)}
                />
            );
        }

        // eslint-disable-next-line @typescript-eslint/member-ordering
        private enhanceColumns = _memoize((columns: TableColumnConfig<I>[]) => {
            return columns.map((column) => {
                const meta = column.meta;

                if (!meta || !meta.copy) {
                    return column;
                }

                return {
                    ...column,
                    template: (item, index) => {
                        const originContent = Table.getBodyCellContent(
                            {
                                ...column,
                                placeholder: '',
                            },
                            item,
                            index,
                        );

                        if (!originContent) {
                            return originContent;
                        }

                        let copyText;

                        if (typeof meta.copy === 'function') {
                            copyText = String(meta.copy(item, index));
                        } else if (
                            typeof originContent === 'string' ||
                            typeof originContent === 'number'
                        ) {
                            copyText = String(originContent);
                        }

                        if (!copyText) {
                            return originContent;
                        }

                        return (
                            <div className={b('copy')}>
                                <div className={b('copy-content')}>{originContent}</div>
                                <div className={b('copy-button')}>
                                    <ClipboardButton text={copyText} size={14} />
                                </div>
                            </div>
                        );
                    },
                } as TableColumnConfig<I>;
            });
        });

        // eslint-disable-next-line @typescript-eslint/member-ordering
        private enhanceOnRowClick = _memoize(
            (
                onRowClick?: (
                    item: I,
                    index: number,
                    event: React.MouseEvent<HTMLTableRowElement>,
                ) => void,
            ) => {
                if (!onRowClick) {
                    return onRowClick;
                }

                return (item: I, index: number, event: React.MouseEvent<HTMLTableRowElement>) => {
                    const buttonClassName = b('copy-button');
                    if (
                        // @ts-ignore
                        event.nativeEvent.target.matches(
                            `.${buttonClassName}, .${buttonClassName} *`,
                        )
                    ) {
                        return;
                    }

                    return onRowClick(item, index, event);
                };
            },
        );
    };
}
