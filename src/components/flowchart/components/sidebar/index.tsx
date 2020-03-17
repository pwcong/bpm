import React from 'react';

import classnames from 'classnames';

import svgZoomIn from '@/mxgraph/images/zoom-in.svg';
import svgZoomOut from '@/mxgraph/images/zoom-out.svg';
import svgScreen0 from '@/mxgraph/images/screen-0.svg';
import svgScreen1 from '@/mxgraph/images/screen-1.svg';

import { ICommonProps } from '../../types';

import './style.scss';

export interface IProps extends ICommonProps {
  screenerActive?: boolean;
  onToggleScreen?: (active: boolean) => void;
}

const cls = `flowchart-sidebar`;
const itemCls = cls + '-item';

export interface IZoomerProps extends ICommonProps {}

const Zoomer: React.FunctionComponent<IZoomerProps> = props => {
  const { editorUI } = props;

  const [zoom, setZoom] = React.useState<number>(
    (editorUI.graph.view.scale || 1) * 100
  );

  const _cls = `${cls}-zoomer`;

  const zoomTo = (value: number) => {
    setZoom(value);
    editorUI.graph.zoomTo(parseFloat((value / 100).toFixed(1)));
  };

  return (
    <div className={_cls}>
      <div
        className={classnames(`${_cls}-btn`, {
          [`${_cls}-btn-disabled`]: zoom <= 50
        })}
        style={{
          backgroundImage: `url(${svgZoomOut})`
        }}
        onClick={() => zoom > 50 && zoomTo(zoom - 10)}
      ></div>
      <div className={`${_cls}-text`}>{zoom + '%'}</div>
      <div
        className={classnames(`${_cls}-btn`, {
          [`${_cls}-btn-disabled`]: zoom >= 200
        })}
        style={{
          backgroundImage: `url(${svgZoomIn})`
        }}
        onClick={() => zoom < 200 && zoomTo(zoom + 10)}
      ></div>
    </div>
  );
};

export interface IScreenerProps extends ICommonProps {
  active?: boolean;
  onToggle?: (active: boolean) => void;
}

const Screener: React.FunctionComponent<IScreenerProps> = props => {
  const { active, onToggle } = props;
  return (
    <div
      className={`${cls}-screener`}
      style={{
        backgroundImage: `url(${!!active ? svgScreen1 : svgScreen0})`
      }}
      onClick={() => onToggle && onToggle(!active)}
    ></div>
  );
};

const Sidebar: React.FunctionComponent<IProps> = props => {
  const { editorUI, className, style } = props;

  React.useEffect(() => {
    // TODO
  }, [editorUI]);

  return (
    <div className={classnames(cls, className)} style={style}>
      <div className={itemCls}>
        <Zoomer editorUI={editorUI} />
      </div>
      <div className={itemCls}>
        <Screener
          editorUI={editorUI}
          onToggle={props.onToggleScreen}
          active={props.screenerActive}
        />
      </div>
    </div>
  );
};

export default Sidebar;
