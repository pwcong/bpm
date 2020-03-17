import React from 'react';

import classnames from 'classnames';

import { mxOutline } from '@/components/mxgraph';

import svgZoomIn from '@/mxgraph/images/sidebar/zoom-in.svg';
import svgZoomOut from '@/mxgraph/images/sidebar/zoom-out.svg';
import svgScreen0 from '@/mxgraph/images/sidebar/screen-0.svg';
import svgScreen1 from '@/mxgraph/images/sidebar/screen-1.svg';
import svgOutline from '@/mxgraph/images/sidebar/outline.svg';

import { ICommonProps } from '../../types';

import './style.scss';

export interface IProps extends ICommonProps {
  screenerActive?: boolean;
  onToggleScreen?: (active: boolean) => void;
}

const cls = `flowchart-sidebar`;
const itemCls = cls + '-item';

const Zoomer: React.FunctionComponent<ICommonProps> = props => {
  const { editorUI } = props;

  const [zoom, setZoom] = React.useState<number>(
    (editorUI.graph.view.scale || 1) * 100
  );

  const _cls = `${cls}-zoomer`;

  const zoomTo = (value: number) => {
    setZoom(value);
    editorUI.graph.zoomTo(parseFloat((value / 100).toFixed(1)), true);
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

const MiniMap: React.FunctionComponent<ICommonProps> = props => {
  const { editorUI } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState<boolean>(false);
  React.useEffect(() => {
    let outline;

    if (ref.current) {
      const container = ref.current;
      outline = new mxOutline(editorUI.graph, container);
      outline.setZoomEnabled(false);
    }

    return () => {
      outline && outline.destroy();
    };
  }, [editorUI, active]);

  const _cls = `${cls}-minimap`;

  return (
    <React.Fragment>
      <div
        className={_cls}
        style={{
          backgroundImage: `url(${svgOutline})`
        }}
        onClick={() => setActive(!active)}
      ></div>
      <div
        className={`${_cls}-modal`}
        style={{
          display: active ? undefined : 'none'
        }}
      >
        <div className={`${_cls}-header`}>
          <span className={`${_cls}-title`}>导航器</span>
          <span className={`${_cls}-close`} onClick={() => setActive(false)}>
            ✖️
          </span>
        </div>
        <div className={`${_cls}-content`} ref={ref}></div>
      </div>
    </React.Fragment>
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
        <MiniMap editorUI={editorUI} />
      </div>
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
