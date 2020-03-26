import React from 'react';

import classnames from 'classnames';

import { ICommonProps, ICell } from '../../types';
import CellItem from '../common/cell-item';
import EditorUI from '../editorui';

export * from './config';

import './style.scss';

export interface IProps extends ICommonProps {
  data: Array<ICell>;
  isSub?: boolean;
}

export const baseCls = 'flowchart-menubar';
export const itemCls = `${baseCls}-item`;

const Menubar: React.FunctionComponent<IProps> = props => {
  const { editorUI, className, style, data, isSub } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [EditorUI]);

  return (
    <div
      className={classnames(baseCls, className, {
        [`${baseCls}-sub`]: !!isSub
      })}
      style={style}
    >
      {data.map(item => (
        <CellItem
          className={itemCls}
          key={item.key}
          data={item}
          editorUI={editorUI}
        >
          {item.component}
        </CellItem>
      ))}
    </div>
  );
};

export default Menubar;
