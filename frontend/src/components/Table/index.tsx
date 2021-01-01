import * as React from "react";
import { Set } from "immutable"; 
import classnames from "classnames";

import { Radio } from "../Radio";
import { Checkbox } from "../Checkbox";

import * as styles from "./index.css";

interface SelectionState {
    type: SelectionType,
    selection: Set<string | number>
}

interface SelectionContext {
    state: SelectionState,
    setState: React.Dispatch<React.SetStateAction<SelectionState>>,

    mode: SelectionMode,
    onSelectionChanged?: (oldSelection: TableSelection, newSelection: TableSelection) => void,
    onActivate?: (key: string | number) => void
}

const SelectionContext = React.createContext<SelectionContext>(null);

function updateSelection(context: SelectionContext, newType, newSelection) {
    if (context.state.type === newType && context.state.selection === newSelection) {
        return;
    }

    context.setState(s => ({
        ...s,
        type: newType,
        selection: newSelection
    }));

    if (context.onSelectionChanged) {
        context.onSelectionChanged({
            type: context.state.type,
            selection: context.state.selection
        }, {
            type: newType,
            selection: newSelection
        })
    }
}

export enum SelectionMode {
    None,
    Single,
    Multiple
}

export enum SelectionType {
    Including,
    Excluding
}

export interface TableSelection {
    type: SelectionType,
    selection: Set<string | number>
}

export function getSelectionCount(selection: TableSelection) {
    switch (selection.type) {
        case SelectionType.Including: return selection.selection.size;
        case SelectionType.Excluding: return Number.POSITIVE_INFINITY;
    }
}

export function isSelected(selection: TableSelection, key: string | number) {
    switch (selection.type) {
        case SelectionType.Including: return selection.selection.has(key);
        case SelectionType.Excluding: return !selection.selection.has(key);
    }
}

export interface TableProps {
    selectionMode?: SelectionMode,
    onSelectionChanged?: (oldSelection: TableSelection, newSelection: TableSelection) => void,
    onActivate?: (key: string | number) => void,

    head: React.ReactNode,
    body: React.ReactNode,
    footer?: React.ReactNode
}

export function Table(props: TableProps) {
    const [selectionState, setSelectionState] = React.useState<SelectionState>(() => ({
        type: SelectionType.Including,
        selection: Set()
    }));

    const selectionContext: SelectionContext = React.useMemo(() => ({
        mode: props.selectionMode,
        onSelectionChanged: props.onSelectionChanged,
        onActivate: props.onActivate,
        state: selectionState,
        setState: setSelectionState
    }), [props.selectionMode, props.onSelectionChanged, selectionState]);

    const onChecked = React.useCallback(function(evt: React.SyntheticEvent<HTMLInputElement>) {
        const newSelection = Set();
        
        let newType;
        if (evt.currentTarget.checked) {
            newType = SelectionType.Excluding;
        }
        else {
            newType = SelectionType.Including;
        }

        updateSelection(selectionContext, newType, newSelection);
    }, [selectionContext]);

    let selectionHeader;
    switch (props.selectionMode) {
        case SelectionMode.None: selectionHeader = null; break;
        case SelectionMode.Single: selectionHeader = <th className={classnames(styles.header, styles.selectionCell)}></th>; break;
        case SelectionMode.Multiple: 
            let intermediate = selectionState.selection.size > 0;
            let checked = selectionState.type === SelectionType.Excluding || intermediate;

            selectionHeader = <th className={classnames(styles.header, styles.selectionCell)}>
                <Checkbox checked={checked} intermediate={intermediate} onChange={onChecked} />
            </th>; 
            break;
    }

    return <SelectionContext.Provider value={selectionContext}>
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {selectionHeader}
                        {props.head}
                    </tr>
                </thead>
                <tbody>
                    {props.body}
                </tbody>
                {props.footer !== undefined 
                    ? <tfoot>{props.footer}</tfoot>
                    : null
                }
            </table>
        </div>
    </SelectionContext.Provider>;
}

export interface HeaderProps {
    children: React.ReactNode
}

export function Header(props: HeaderProps) {
    return <th className={styles.header}>{props.children}</th>
}

export interface RowProps {
    selectionKey?: string | number,
    children: React.ReactNode
}

function doNotSelectOnDoubleClick(evt: React.MouseEvent) {
    if(evt.detail > 1) {
        evt.preventDefault();
    }
}

export function Row(props: RowProps) {
    const selectionContext = React.useContext(SelectionContext);
    
    let selectionCell = null;
    let selectedClass = null;

    const onChecked = React.useCallback(function(evt: React.SyntheticEvent<HTMLInputElement>) {
        let newSelection;

        switch (selectionContext.mode) {
            case SelectionMode.Single:
                newSelection = Set([props.selectionKey]);
                break;

            case SelectionMode.Multiple:
                if ((selectionContext.state.type === SelectionType.Including) === evt.currentTarget.checked) {
                    newSelection = selectionContext.state.selection.add(props.selectionKey);
                }
                else {
                    newSelection = selectionContext.state.selection.remove(props.selectionKey);
                }
                break;
        }

        selectionContext.setState({
            ...selectionContext.state,
            selection: newSelection
        });

        if (selectionContext.onSelectionChanged) {
            selectionContext.onSelectionChanged({
                type: selectionContext.state.type,
                selection: selectionContext.state.selection
            }, {
                type: selectionContext.state.type,
                selection: newSelection
            })
        }
    }, [selectionContext, props.selectionKey]);

    const onClick = React.useCallback(function(evt: React.MouseEvent) {
        switch (selectionContext.state.type) {
            case SelectionType.Including:
                if (selectionContext.state.selection.has(props.selectionKey)) {
                    if (evt.ctrlKey) {
                        const newSelection = selectionContext.state.selection.remove(props.selectionKey);
                        updateSelection(selectionContext, selectionContext.state.type, newSelection);
                    }
                }
                else {
                    const newSelection = selectionContext.state.selection.add(props.selectionKey);
                    updateSelection(selectionContext, selectionContext.state.type, newSelection);
                }
                break;

            case SelectionType.Excluding:
                if (selectionContext.state.selection.has(props.selectionKey)) {
                    const newSelection = selectionContext.state.selection.remove(props.selectionKey);
                    updateSelection(selectionContext, selectionContext.state.type, newSelection);
                }
                else {
                    if (evt.ctrlKey) {
                        const newSelection = selectionContext.state.selection.add(props.selectionKey);
                        updateSelection(selectionContext, selectionContext.state.type, newSelection);
                    }
                }
                break;
        }

        evt.preventDefault();
    }, [selectionContext, props.selectionKey]);

    const onDoubleClick = React.useCallback(function(evt: React.MouseEvent) {
        if (!evt.shiftKey && !evt.ctrlKey && selectionContext.onActivate) {
            selectionContext.onActivate(props.selectionKey);
        }

        evt.preventDefault();
    }, [selectionContext.onActivate, props.selectionKey]);

    let canBeSelected = false;
    if (selectionContext.mode !== SelectionMode.None) {
        let selectionCellContent = null;

        if (props.selectionKey !== undefined) {
            canBeSelected = true;

            let isSelected;
            switch (selectionContext.state.type) {
                case SelectionType.Including: isSelected = selectionContext.state.selection.has(props.selectionKey); break;
                case SelectionType.Excluding: isSelected = !selectionContext.state.selection.has(props.selectionKey); break;
            }

            selectedClass = isSelected ? styles.selected : null;

            switch (selectionContext.mode) {
                case SelectionMode.Single: selectionCellContent = <Radio checked={isSelected} onChange={onChecked} />; break;
                case SelectionMode.Multiple: selectionCellContent = <Checkbox checked={isSelected} onChange={onChecked} />; break;
            }
        }
        
        selectionCell = <td className={classnames(styles.cell, styles.selectionCell)}>{selectionCellContent}</td>;
    }

    return <tr onClick={canBeSelected ? onClick : null} onDoubleClick={canBeSelected ? onDoubleClick : null} onMouseDown={doNotSelectOnDoubleClick} className={classnames(styles.row, selectedClass)}>
        {selectionCell}
        {props.children}
    </tr>;
}

export interface CellProps
    extends React.HTMLAttributes<HTMLTableCellElement> {
        
    children: React.ReactNode
}

export function Cell(props: CellProps) {
    const { children, ...otherProps } = props;

    return <td className={styles.cell} {...otherProps}>{children}</td>;
}

export function Empty() {
    return <tr>
        <td className={styles.empty} colSpan={999}>
            <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fillRule="evenodd"><ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse><g stroke="#d9d9d9" fillRule="nonzero"><path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path><path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path></g></g></svg>
            <div>Leeg</div>
        </td>
    </tr>;
}