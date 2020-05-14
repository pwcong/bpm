import React from 'react';

import { classnames } from '@bpm/utils';

import { Popover } from 'antd';

import { MX } from '@/components/mx';

import svgZoomIn from '@/../static/images/sidebar/zoom-in.svg';
import svgZoomOut from '@/../static/images/sidebar/zoom-out.svg';
import svgScreen0 from '@/../static/images/sidebar/screen-0.svg';
import svgScreen1 from '@/../static/images/sidebar/screen-1.svg';
import svgOutline from '@/../static/images/sidebar/outline.svg';
import svgDelete from '@/../static/images/sidebar/delete.svg';

import { EEventName } from '@/types';

import { ICommonProps } from '../../types';
import { getZoomData } from './utils';

import './style.scss';

export interface IProps extends ICommonProps {
  fullscreen?: boolean;
  onToggleScreen?: (active: boolean) => void;
}

const { mxOutline } = MX;

const cls = 'flowchart-sidebar';
const itemCls = cls + '-item';

const Zoomer: React.FunctionComponent<ICommonProps> = (props) => {
  const { editorUI } = props;

  const [zoom, setZoom] = React.useState<number>(
    (editorUI.graph.view.scale || 1) * 100
  );
  const _cls = `${cls}-zoomer`;

  const zoomTo = (value: number) => {
    setZoom(value);
    editorUI.graph.zoomTo(parseFloat((value / 100).toFixed(1)), true);
  };

  React.useEffect(() => {
    const zoomHandler = (sender, me) => {
      const { zoom } = me.properties;
      setZoom(parseInt(zoom));
    };
    editorUI.graph.addListener(EEventName.zoom, zoomHandler);
    return () => {
      editorUI.graph.removeListener(zoomHandler);
    };
  }, []);

  return (
    <div className={_cls}>
      <div
        className={classnames(`${_cls}-btn`, {
          [`${_cls}-btn-disabled`]: zoom <= editorUI.minZoom,
        })}
        style={{
          backgroundImage: `url(${svgZoomOut})`,
        }}
        onClick={() => zoom > editorUI.minZoom && zoomTo(zoom - 10)}
      ></div>
      <Popover
        overlayStyle={{}}
        overlayClassName={`${_cls}-popover`}
        content={
          <div className={`${_cls}-zooms`}>
            {getZoomData(editorUI.minZoom, editorUI.maxZoom).map((v) => (
              <div
                onClick={() => zoomTo(v)}
                key={v}
                className={classnames(`${_cls}-zoom`, {
                  [`${_cls}-zoom-active`]: zoom === v,
                })}
              >
                {`${v}%`}
              </div>
            ))}
          </div>
        }
      >
        <div className={`${_cls}-text`}>
          {zoom + '%'}
          <div className={`${_cls}-arrow`}></div>
        </div>
      </Popover>
      <div
        className={classnames(`${_cls}-btn`, {
          [`${_cls}-btn-disabled`]: zoom >= editorUI.maxZoom,
        })}
        style={{
          backgroundImage: `url(${svgZoomIn})`,
        }}
        onClick={() => zoom < editorUI.maxZoom && zoomTo(zoom + 10)}
      ></div>
    </div>
  );
};

export interface IScreenerProps extends ICommonProps {
  active?: boolean;
  onToggle?: (active: boolean) => void;
}

const Screener: React.FunctionComponent<IScreenerProps> = (props) => {
  const { active, onToggle } = props;
  return (
    <div
      className={`${cls}-screener`}
      style={{
        backgroundImage: `url(${!active ? svgScreen1 : svgScreen0})`,
      }}
      onClick={() => onToggle && onToggle(!active)}
    ></div>
  );
};

const MiniMap: React.FunctionComponent<ICommonProps> = (props) => {
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
      // 销毁报错问题
      try {
        outline && outline.destroy();
      } catch (e) {
        // DO NOTHING
      }
    };
  }, [editorUI, active]);

  const _cls = `${cls}-minimap`;

  return (
    <React.Fragment>
      <div
        className={_cls}
        style={{
          backgroundImage: `url(${svgOutline})`,
        }}
        onClick={() => setActive(!active)}
      ></div>
      <div
        className={`${_cls}-modal`}
        style={{
          display: active ? undefined : 'none',
        }}
      >
        <div className={`${_cls}-header`}>
          <span className={`${_cls}-title`}>导航器</span>
          <span className={`${_cls}-close`} onClick={() => setActive(false)}>
            <img src={svgDelete} />
          </span>
        </div>
        <div className={`${_cls}-content`} ref={ref}></div>
      </div>
    </React.Fragment>
  );
};

const Sidebar: React.FunctionComponent<IProps> = (props) => {
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
          active={props.fullscreen}
        />
      </div>
    </div>
  );
};

export default Sidebar;
