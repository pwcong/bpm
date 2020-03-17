import React from 'react';

import classnames from 'classnames';

import EditorUI from './components/editorui';
import Menubar from './components/menubar';
import Toolbar from './components/toolbar';
import Sidebar from './components/sidebar';

import svgArrow0 from '@/mxgraph/images/arrow-0.svg';
import svgArrow1 from '@/mxgraph/images/arrow-1.svg';

import { IProps } from './types';
import './style.scss';

const cls = 'flowchart';

const FlowChart: React.FunctionComponent<IProps> = props => {
  const { className, style } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [editorUI, setEditorUi] = React.useState<EditorUI | null>(null);
  const [topHidden, setTopHidden] = React.useState<boolean>(false);
  const [rightHidden, setRightHidden] = React.useState<boolean>(true);

  React.useEffect(() => {
    let _editorUi: EditorUI;
    if (ref.current) {
      const container = ref.current;

      _editorUi = new EditorUI(container);
      setEditorUi(_editorUi);
    }

    return () => {
      _editorUi.destroy();
    };
  }, []);

  editorUI &&
    console.log(
      (window['editorUI'] = editorUI),
      (window['editor'] = editorUI.editor),
      (window['graph'] = editorUI.editor.graph)
    );

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
              onClick={() => setTopHidden(!topHidden)}
              style={{
                backgroundImage: `url(${topHidden ? svgArrow1 : svgArrow0})`
              }}
            ></div>
          </div>
        </div>
      )}
      <div className={`${cls}-b`}>
        <div className={`${cls}-b-l`} ref={ref}></div>
        <div className={`${cls}-b-r`}>
          <div className={`${cls}-b-r-l`}>
            <div
              className={`${cls}-toggler`}
              onClick={() => setRightHidden(!rightHidden)}
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
                }}
              />
            )}
          </div>
          <div className={`${cls}-b-r-r`}></div>
        </div>
      </div>
    </div>
  );
};

export default FlowChart;
