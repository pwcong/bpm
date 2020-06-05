import React from 'react';

import classnames from 'classnames';

import CellItem from '../../../common/cell-item';
import { ICells, ICommonProps } from '../../../../types';

import './style.scss';

export interface IProps extends ICommonProps {
  data: ICells;
  position: {
    x: number;
    y: number;
  };
}

const cls = 'bpm-flowchart-arrow-panel';
const listCls = cls + '-list';
const itemCls = cls + '-item';

const ArrowPanel: React.FunctionComponent<IProps> = (props) => {
  const { className, style = {}, data, editorUI, position } = props;

  return (
    <div
      className={classnames(cls, className)}
      style={{
        ...style,
        left: position.x,
        top: position.y,
      }}
    >
      <div className={listCls}>
        {data.map((item) => (
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
    </div>
  );
};

export default ArrowPanel;
