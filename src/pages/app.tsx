import React from 'react';

import FlowChart, {
  IWrappedComponentRefObject,
  exportXml,
  loadXml
} from '@/components/flowchart';

import './style/app.scss';

const App: React.FunctionComponent = () => {
  const [ref, setRef] = React.useState<IWrappedComponentRefObject | null>(null);

  return (
    <div className="container">
      <FlowChart
        wrappedComponentRef={ref => {
          window['flowchart'] = ref;
          setRef(ref);
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px',
          textAlign: 'center'
        }}
      >
        <button
          onClick={() => {
            if (ref && ref.current && ref.current.editorUI) {
              console.log(exportXml(ref.current.editorUI.graph, true));
            }
          }}
        >
          导出数据
        </button>
        <button
          onClick={() => {
            if (ref && ref.current && ref.current.editorUI) {
              const xml = window.prompt('请输入数据');
              !!xml && loadXml(ref.current.editorUI.graph, xml);
            }
          }}
        >
          加载数据
        </button>
      </div>
    </div>
  );
};

export default App;
