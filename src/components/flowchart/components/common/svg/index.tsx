import React from 'react';

import classnames from 'classnames';

import SVGDelete from './delete';
import SVGUndo from './undo';
import SVGRedo from './redo';
import SVGRubberBand from './rubberband';

import './style.scss';

export interface IProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SVGMapper = {
  delete: SVGDelete,
  undo: SVGUndo,
  redo: SVGRedo,
  rubberband: SVGRubberBand
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

export interface ITitleSVGProps extends IProps {
  title: React.ReactNode;
}

export const TitleSVG: React.FunctionComponent<ITitleSVGProps> = props => {
  const { title, ...restProps } = props;
  return (
    <React.Fragment>
      <SVG {...restProps} />
      {title}
    </React.Fragment>
  );
};

export default SVG;
