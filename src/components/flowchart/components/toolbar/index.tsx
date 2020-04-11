import React from 'react';

import classnames from 'classnames';

import { ICell, ICommonProps } from '../../types';
import CellItem from '../common/cell-item';

export * from './config';

import './style.scss';

export interface IProps extends ICommonProps {
  data: Array<ICell>;
}

const cls = 'flowchart-toolbar';
const itemCls = `${cls}-item`;

const Toolbar: React.FunctionComponent<IProps> = (props) => {
  const { editorUI, className, style, data } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [editorUI]);

  return (
    <div className={classnames(cls, className)} style={style}>
      {data
        .filter((item) => !item.disabled)
        .map((item) => (
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
