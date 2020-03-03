import React from 'react';

import classnames from 'classnames';

import {
  mxGraph,
  mxCodec,
  mxUtils,
  mxClient,
  mxGraphModel,
  mxCell
  // mxCellState
} from '@/components/mxgraph';

import { IProps, defaultConfig } from './types';
import './style.scss';
import { loadXml, configurate } from './utils';

const cls = 'flowchart';

const FlowChart: React.FunctionComponent<IProps> = props => {
  const { className, style, defaultXml, config = defaultConfig } = props;

  const [root, setRoot] = React.useState<any>(null);
  const [layers, setLayers] = React.useState<Array<any>>([]);
  const [currentLayer, setCurrentLayer] = React.useState<any>(null);
  const [model, setModel] = React.useState<any>(null);
  const [graph, setGraph] = React.useState<any>(null);
  const [key, setKey] = React.useState<number>(0);

  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let graph: any;

    if (ref.current) {
      const container = ref.current;

      // 校验浏览器是否支持
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      } else {
        // 创建绘图对象
        const root = new mxCell();
        setRoot(root);
        const defaultLayer = root.insert(new mxCell());
        setLayers([defaultLayer]);
        setCurrentLayer(defaultLayer);
        const model = new mxGraphModel(root);
        setModel(model);
        graph = new mxGraph(container, model);
        setGraph(graph);

        // 配置绘图对象
        configurate(graph, config);

        // 初始化绘图内容
        if (defaultXml) {
          loadXml(graph, defaultXml);
        } else {
          // 开始绘图事务
          graph.getModel().beginUpdate();

          try {
            // TODO 自定义绘图操作
            const v1 = graph.insertVertex(
              defaultLayer,
              null,
              {
                name: 'Hello,'
              },
              20,
              20,
              80,
              30
            );
            const v2 = graph.insertVertex(
              defaultLayer,
              null,
              {
                name: `World ${key}!`
              },
              200,
              20,
              80,
              30
            );
            graph.insertVertex(
              defaultLayer,
              null,
              {
                name: `Fuck ${key}!`
              },
              200,
              150,
              80,
              30
            );
            graph.insertEdge(
              defaultLayer,
              null,
              {
                name: 'edge'
              },
              v1,
              v2,
              'startArrow=dash'
            );
          } finally {
            graph.getModel().endUpdate();
          }
        }
      }
    }

    return () => {
      // 销毁绘图对象
      graph && graph.destroy();
    };
  }, [key]);

  return (
    <React.Fragment>
      <div className={classnames(cls, className)} style={style} ref={ref}></div>
      <button
        onClick={() => {
          console.log(root, layers, currentLayer, model, graph);

          const enc = new mxCodec(mxUtils.createXmlDocument());
          const node = enc.encode(graph.getModel());
          // const xml = mxUtils.getXml(node);
          const xml = mxUtils.getPrettyXml(node);
          console.log(xml);
        }}
      >
        获取数据
      </button>
      <button onClick={() => setKey(key + 1)}>重新绘制</button>
    </React.Fragment>
  );
};

export default FlowChart;
