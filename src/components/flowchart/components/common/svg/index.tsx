import React from 'react';

import classnames from 'classnames';

import SVGDelete from './delete';
import SVGUndo from './undo';
import SVGRedo from './redo';
import SVGRubberBand from './rubberband';
import SVGAlignment from './alignment';
import SVGAlignTop from './aligntop';
import SVGAlignTBCenter from './aligntbcenter';
import SVGAlignBottom from './alignbottom';
import SVGAlignLeft from './alignleft';
import SVGAlignLRCenter from './alignlrcenter';
import SVGAlignRight from './alignright';

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
  rubberband: SVGRubberBand,
  alignment: SVGAlignment,
  alignTop: SVGAlignTop,
  alignTBCenter: SVGAlignTBCenter,
  alignBottom: SVGAlignBottom,
  alignLeft: SVGAlignLeft,
  alignLRCenter: SVGAlignLRCenter,
  alignRight: SVGAlignRight
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
  tooltip?: React.ReactNode;
}

export const TitleSVG: React.FunctionComponent<ITitleSVGProps> = props => {
  const { title, style, ...restProps } = props;

  return (
    <div className={`${cls}-title`}>
      <SVG style={style} {...restProps} />
      <span style={style}>{title}</span>
    </div>
  );
};

export default SVG;
