import React from 'react';

import { ICell, ICellListenerCallbackEvent } from '../../types';
import EditorUI from '../../components/editorui';

export const getCommonComponent = (
  component: React.ReactElement,
  editorUI: EditorUI,
  cell: ICell
) => {
  const action = editorUI.actions.get(cell.key);
  return React.cloneElement(
    component,
    Object.assign({}, component.props, {
      title: `${cell.title}${
        action && action.shortcut ? `(${action.shortcut})` : ''
      }`,
      onClick: () => action && action.funct && action.funct()
    })
  );
};

export const reRender = (e: ICellListenerCallbackEvent) => {
  const { ref } = e.detail || {};
  ref && ref.render && ref.render();
};
