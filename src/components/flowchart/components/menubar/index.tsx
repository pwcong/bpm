import React from 'react';

import classnames from 'classnames';

import { IBaseProps, ICell } from '../../types';
import { menubarData } from '../../config';

import EditorUi from '../editorui';
import { Action } from '../actions';

import './style.scss';

export interface IProps extends IBaseProps {
  editorUi: EditorUi;
}

export interface IMenubarItemProps extends IBaseProps {
  editorUi: EditorUi;
  data: ICell;
}

const cls = `flowchart-menubar`;

export const MenubarItem: React.FunctionComponent<IMenubarItemProps> = props => {
  const { className, style, children, editorUi, data } = props;

  const [disabled, setDisabled] = React.useState(true);
  const [action, setAction] = React.useState<Action | null>(null);

  React.useEffect(() => {
    const t = editorUi.actions.get(data.key);
    if (t) {
      setDisabled(false);
      setAction(t);
    }
  }, [editorUi, data]);

  const itemCls = `${cls}-item`;

  return (
    <div
      title={`${data.title}${
        action && action.shortcut ? `(${action.shortcut})` : ''
      }`}
      className={classnames(itemCls, className, {
        [`${itemCls}-disabled`]: disabled
      })}
      style={style}
      onClick={() => action && action.funct && action.funct()}
    >
      {children}
    </div>
  );
};

const Menubar: React.FunctionComponent<IProps> = props => {
  const { editorUi, className, style } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [editorUi]);

  return (
    <div className={classnames(cls, className)} style={style}>
      {menubarData.map(item => {
        return (
          <MenubarItem key={item.key} data={item} editorUi={editorUi}>
            {item.component}
          </MenubarItem>
        );
      })}
    </div>
  );
};

export default Menubar;
