import React from 'react';

import classnames from 'classnames';

import { IBaseProps, ICell } from '../../types';
import CellItem from '../common/cell-item';
import EditorUI from '../editorui';
import { data } from './config';

import './style.scss';

export interface IProps extends IBaseProps {
  editorUI: EditorUI;
}

export interface IMenubarItemProps extends IBaseProps {
  editorUI: EditorUI;
  data: ICell;
}

export const baseCls = `flowchart-menubar`;
export const itemCls = `${baseCls}-item`;

const Menubar: React.FunctionComponent<IProps> = props => {
  const { editorUI, className, style } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [EditorUI]);

  return (
    <div className={classnames(baseCls, className)} style={style}>
      {data.map(item => {
        return (
          <CellItem
            className={itemCls}
            key={item.key}
            editorUI={editorUI}
            data={item}
          />
        );
      })}
    </div>
  );
};

export default Menubar;
