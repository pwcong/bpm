import React from 'react';

import classnames from 'classnames';

import SVGDelete from './delete';
import SVGUndo from './undo';
import SVGRedo from './redo';

import './style.scss';

export interface IProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SVGMapper = {
  delete: SVGDelete,
  undo: SVGUndo,
  redo: SVGRedo
};

const cls = 'flowchart-svg';

const SVG: React.FunctionComponent<IProps> = props => {
  const { name, className, style } = props;
  const Cmpt = SVGMapper[name];

  return (
    Cmpt && (
      <span className={classnames(cls, className)} style={style}>
        <Cmpt />
      </span>
    )
  );
};

export default SVG;
