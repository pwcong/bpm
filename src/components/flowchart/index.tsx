import React from 'react';

import classnames from 'classnames';

import EditorUI from './components/editorui';
import Menubar from './components/menubar';
import Toolbar from './components/toolbar';
import Sidebar from './components/sidebar';

import svgArrow0 from '@/mxgraph/images/arrow-0.svg';
import svgArrow1 from '@/mxgraph/images/arrow-1.svg';

import {
  IBaseProps,
  IConfig,
  IWrappedComponentRef,
  IWrappedComponentRefObject,
  defaultConfig
} from './types';

export * from './utils';
export * from './types';

import './style.scss';
import { EEventName } from './config';

export interface IProps extends IBaseProps {
  config?: IConfig;
  onSelectCells?: (cells: Array<any>) => void;
  wrappedComponentRef?: (ref: IWrappedComponentRefObject) => void;
}

const cls = 'flowchart';

export const Canvas: React.FunctionComponent<IProps> = props => {
  const {
    className,
    style,
    onSelectCells,
    wrappedComponentRef,
    config = defaultConfig
  } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [editorUI, setEditorUi] = React.useState<EditorUI | null>(null);

  const componentRef = React.useRef<IWrappedComponentRef>({
    editorUI: null
  });

  React.useEffect(() => {
    let _editorUi: EditorUI;
    if (ref.current) {
      const container = ref.current;

      _editorUi = new EditorUI(container, config.editable);
      setEditorUi(_editorUi);
    }

    return () => {
      _editorUi.destroy();
    };
  }, []);

  React.useEffect(() => {
    const cb = (e: CustomEvent) => {
      const { cells = [] } = e.detail || {};
      onSelectCells && onSelectCells(cells);
    };
    window.addEventListener(EEventName.select, cb);
    return () => {
      window.removeEventListener(EEventName.select, cb);
    };
  }, [onSelectCells]);

  React.useEffect(() => {
    componentRef.current.editorUI = editorUI;
    wrappedComponentRef && wrappedComponentRef(componentRef);
  });

  const _cls = `${cls}-canvas`;

  return (
    <div
      ref={ref}
      className={classnames(_cls, className, {
        [`${_cls}-readonly`]: config.editable === false
      })}
      style={style}
    ></div>
  );
};

const FlowChart: React.FunctionComponent<IProps & {
  render?: {
    sidebar?: (cells: Array<any>) => React.ReactNode;
  };
}> = props => {
  const {
    className,
    style,
    wrappedComponentRef,
    config = defaultConfig,
    render = {}
  } = props;

  const [editorUI, setEditorUi] = React.useState<EditorUI | null>(null);
  const [selectedCells, setSelectedCells] = React.useState<Array<any>>([]);
  const [topHidden, setTopHidden] = React.useState<boolean>(false);
  const [rightHidden, setRightHidden] = React.useState<boolean>(false);

  const redraw = React.useCallback(() => editorUI && editorUI.redraw(300), [
    editorUI
  ]);
  const onSelectCells = React.useCallback((cells: Array<any>) => {
    setSelectedCells([...cells]);
  }, []);

  window['editorUI'] = editorUI;

  return (
    <div
      className={classnames(cls, className, {
        [`${cls}-hide-top`]: topHidden,
        [`${cls}-hide-right`]: rightHidden
      })}
      style={style}
    >
      {editorUI && (
        <div className={`${cls}-t`}>
          <div className={`${cls}-t-t`}>
            <div className={`${cls}-t-t-l`}>
              <Menubar editorUI={editorUI} />
            </div>
            <div className={`${cls}-t-t-s`}></div>
            <div className={`${cls}-t-t-r`}>
              <Toolbar editorUI={editorUI} />
            </div>
          </div>
          <div className={`${cls}-t-b`}>
            <div
              className={`${cls}-toggler`}
              onClick={() => {
                setTopHidden(!topHidden);
                redraw();
              }}
              style={{
                backgroundImage: `url(${topHidden ? svgArrow1 : svgArrow0})`
              }}
            ></div>
          </div>
        </div>
      )}
      <div className={`${cls}-b`}>
        <div className={`${cls}-b-l`}>
          <Canvas
            config={config}
            onSelectCells={onSelectCells}
            wrappedComponentRef={ref => {
              ref &&
                ref.current &&
                ref.current.editorUI &&
                setEditorUi(ref.current.editorUI);
              wrappedComponentRef && wrappedComponentRef(ref);
            }}
          />
        </div>
        <div className={`${cls}-b-r`}>
          <div className={`${cls}-b-r-l`}>
            <div
              className={`${cls}-toggler`}
              onClick={() => {
                setRightHidden(!rightHidden);
                redraw();
              }}
              style={{
                backgroundImage: `url(${rightHidden ? svgArrow1 : svgArrow0})`
              }}
            ></div>
            {editorUI && (
              <Sidebar
                editorUI={editorUI}
                screenerActive={!topHidden || !rightHidden}
                onToggleScreen={active => {
                  setTopHidden(!active);
                  setRightHidden(!active);
                  redraw();
                }}
              />
            )}
          </div>
          <div className={`${cls}-b-r-r`}>
            {render.sidebar && render.sidebar(selectedCells)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowChart;
