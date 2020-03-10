import React from 'react';

import classnames from 'classnames';

import EditorUI from './components/editorui';
import Menubar from './components/menubar';
import Toolbar from './components/toolbar';

import { IProps } from './types';
import './style.scss';

const cls = 'flowchart';

const FlowChart: React.FunctionComponent<IProps> = props => {
  const { className, style } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);
  const [editorUi, setEditorUi] = React.useState<EditorUI | null>(null);

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

  console.log((window['editorUi'] = editorUi));

  return (
    <div className={classnames(cls, className)} style={style}>
      {editorUi && (
        <div className={`${cls}-t`}>
          <div className={`${cls}-t-l`}>
            <Menubar editorUi={editorUi} />
          </div>
          <div className={`${cls}-t-s`}></div>
          <div className={`${cls}-t-r`}>
            <Toolbar editorUi={editorUi} />
          </div>
        </div>
      )}
      <div className={`${cls}-b`} ref={ref}></div>
    </div>
  );
};

export default FlowChart;
