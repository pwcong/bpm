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

export interface IToolbarItemProps extends IBaseProps {
  editorUI: EditorUI;
  data: ICell;
}

const cls = `flowchart-toolbar`;
const itemCls = `${cls}-item`;

const Toolbar: React.FunctionComponent<IProps> = props => {
  const { editorUI, className, style } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [editorUI]);

  return (
    <div className={classnames(cls, className)} style={style}>
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

export default Toolbar;
