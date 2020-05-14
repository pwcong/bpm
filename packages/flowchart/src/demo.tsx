import React from 'react';

import {
  FlowChart,
  IWrappedComponentRef,
  exportXml,
  loadXml,
} from '@/flowchart';

import './demo.scss';

const Test: React.FunctionComponent<{
  cells: Array<any>;
}> = (props) => {
  const { cells } = props;

  return (
    <div style={{ padding: '16px 8px' }}>
      {cells.map((c, i) => (
        <div
          key={i}
          style={{
            padding: '4px 0',
            borderBottom: '1px dashed #eee',
            fontSize: '12px',
            color: '#333333',
          }}
        >
          {c.value || 'No Data'}
        </div>
      ))}
    </div>
  );
};

export const FlowChartDemo: React.FunctionComponent = () => {
  const ref = React.useRef<IWrappedComponentRef | null>(null);

  return (
    <div className="flowchart-demo">
      <FlowChart
        config={
          {
            // editable: false
          }
        }
        render={{
          sidebar: (cells) => <Test cells={cells} />,
        }}
        wrappedComponentRef={(_ref) => {
          window['flowchart'] = _ref.current;
          ref.current = _ref.current;
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px',
          textAlign: 'center',
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

              console.log(xml, ref.current.editorUI.graph);

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
