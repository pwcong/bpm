import React from 'react';

import { Tooltip, Dropdown } from 'antd';

import { ICell, ICellListenerCallbackRef } from '../../types';
import EditorUI from '../../components/editorui';

import Menubar from './index';

export function getCommonComponent(
  component: React.ReactElement,
  children: React.ReactNode,
  editorUI: EditorUI,
  cell: ICell
) {
  const action = editorUI.actions.get(cell.key);

  const { name, relations = [] } = cell;

  component = React.cloneElement(
    component,
    Object.assign({}, component.props, {
      onClick: () => action && action.funct && action.funct(),
      children,
    })
  );

  if (relations.length > 0) {
    return (
      <Dropdown
        overlay={<Menubar editorUI={editorUI} data={relations} isSub={true} />}
        // visible={true}
      >
        {component}
      </Dropdown>
    );
  }

  if (name && action && action.tooltip) {
    return (
      <Tooltip
        title={
          <div style={{ textAlign: 'center' }}>
            <div>{name}</div>
            {action && action.shortcut && <div>{action.shortcut}</div>}
          </div>
        }
      >
        {component}
      </Tooltip>
    );
  }

  return component;
}

export function reRender(
  ref: ICellListenerCallbackRef,
  editorUI: EditorUI,
  cell: ICell
) {
  ref && ref.render && ref.render();
}
