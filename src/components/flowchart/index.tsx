import React from 'react';

import classnames from 'classnames';

import EditorUI from './components/editorui';
import Menubar, {
  data as menubarData,
  map as menubarMap,
} from './components/menubar';
import Toolbar, {
  data as toolbarData,
  map as toolbarMap,
} from './components/toolbar';
import Sidebar from './components/sidebar';

import svgArrowT0 from '@/mxgraph/images/arrow-t-0.svg';
import svgArrowT1 from '@/mxgraph/images/arrow-t-1.svg';
import svgArrowR0 from '@/mxgraph/images/arrow-r-0.svg';
import svgArrowR1 from '@/mxgraph/images/arrow-r-1.svg';

import {
  IBaseProps,
  IConfig,
  IWrappedComponentRef,
  IWrappedComponentRefObject,
} from './types';

export * from './utils';
export * from './types';

import './style.scss';
import { EEventName } from './types';
import { debounce } from './utils';

export interface IProps extends IBaseProps {
  config?: IConfig;
  onSelectCells?: (cells: Array<any>, event) => void;
  wrappedComponentRef?: (ref: IWrappedComponentRefObject) => void;
}

const cls = 'flowchart';

export const Chart: React.FunctionComponent<IProps> = (props) => {
  const {
    className,
    style,
    onSelectCells,
    wrappedComponentRef,
    config = {},
  } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [editorUI, setEditorUi] = React.useState<EditorUI | null>(null);

  const componentRef = React.useRef<IWrappedComponentRef>({
    editorUI: null,
  });

  React.useEffect(() => {
    let _editorUi: EditorUI;
    if (ref.current) {
      const container = ref.current;

      _editorUi = new EditorUI(container, {
        toolbar: {
          data: toolbarData,
          map: toolbarMap,
        },
        menubar: {
          data: menubarData,
          map: menubarMap,
        },
        ...config,
      });
      setEditorUi(_editorUi);
    }

    return () => {
      // 元素被销毁后报错问题
      try {
        ref.current && _editorUi && _editorUi.destroy();
      } catch (e) {
        // DO NOTHING
      }
    };
  }, []);

  window['editorUI'] = editorUI;

  React.useEffect(() => {
    const cb = (e: CustomEvent) => {
      const { sender = {}, event } = e.detail || ({} as any);
      const { cells = [] } = sender;

      onSelectCells && onSelectCells([...cells], event);
    };
    window.addEventListener(EEventName.select, cb);
    return () => {
      window.removeEventListener(EEventName.select, cb);
    };
  }, [onSelectCells]);

  React.useEffect(() => {
    componentRef.current.editorUI = editorUI;
    wrappedComponentRef && wrappedComponentRef(componentRef);
  }, [editorUI]);

  const _cls = `${cls}-chart`;

  return (
    <div
      ref={ref}
      className={classnames(_cls, className, {
        [`${_cls}-readonly`]: config.editable === false,
      })}
      style={style}
    ></div>
  );
};

const FlowChart: React.FunctionComponent<
  IProps & {
    onToggleScreen?: (active: boolean) => void;
    render?: {
      sidebar?: (cells: Array<any>) => React.ReactNode;
    };
  }
> = (props) => {
  const {
    className,
    style,
    onToggleScreen,
    wrappedComponentRef,
    config = {},
    render = {},
  } = props;

  const [editorUI, setEditorUi] = React.useState<EditorUI | null>(null);
  const [selectedCells, setSelectedCells] = React.useState<Array<any>>([]);
  const [topHidden, setTopHidden] = React.useState<boolean>(false);
  const [rightHidden, setRightHidden] = React.useState<boolean>(false);

  const redraw = React.useCallback(() => editorUI && editorUI.redraw(300), [
    editorUI,
  ]);
  const onSelectCells = React.useCallback((cells: Array<any>) => {
    setTimeout(() => {
      setSelectedCells(cells);
    });
  }, []);

  React.useEffect(() => {
    const resize = debounce(() => redraw(), 100);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [editorUI]);

  React.useEffect(() => {
    onToggleScreen && onToggleScreen(topHidden);
  }, [topHidden]);

  return (
    <div
      className={classnames(cls, className, {
        [`${cls}-hide-top`]: topHidden,
        [`${cls}-hide-right`]: rightHidden,
        [`${cls}-readonly`]: config.editable === false,
      })}
      style={style}
    >
      {editorUI && (
        <div className={`${cls}-t`}>
          <div className={`${cls}-t-t`}>
            <div className={`${cls}-t-t-l`}>
              <Menubar
                data={config.menubar ? config.menubar.data : menubarData}
                editorUI={editorUI}
              />
            </div>
            <div className={`${cls}-t-t-s`}></div>
            <div className={`${cls}-t-t-r`}>
              <Toolbar
                data={config.toolbar ? config.toolbar.data : toolbarData}
                editorUI={editorUI}
              />
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
                backgroundImage: `url(${topHidden ? svgArrowT0 : svgArrowT1})`,
              }}
            ></div>
          </div>
        </div>
      )}
      <div className={`${cls}-b`}>
        <div className={`${cls}-b-l`}>
          <Chart
            config={config}
            onSelectCells={onSelectCells}
            wrappedComponentRef={(ref) => {
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
                backgroundImage: `url(${
                  rightHidden ? svgArrowR0 : svgArrowR1
                })`,
              }}
            ></div>
            {editorUI && (
              <Sidebar
                editorUI={editorUI}
                fullscreen={topHidden && rightHidden}
                onToggleScreen={(active) => {
                  setTopHidden(active);
                  setRightHidden(active);
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
