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

export interface IForwardedProps extends IProps {
  forwardedRef: any;
}

export const baseCls = 'bpm-flowchart-menubar';
export const itemCls = `${baseCls}-item`;

const Menubar: React.FunctionComponent<IForwardedProps> = (props) => {
  const { editorUI, className, style, data, isSub, forwardedRef } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [EditorUI]);

  return (
    <div
      ref={forwardedRef}
      className={classnames(baseCls, className, {
        [`${baseCls}-sub`]: !!isSub,
      })}
      style={style}
    >
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
  );
};

const ForwardedMenubar = React.forwardRef<any, IProps>((props, ref) => (
  <Menubar {...props} forwardedRef={ref} />
));

export default ForwardedMenubar;
