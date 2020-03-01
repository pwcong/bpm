import React from 'react';

import classnames from 'classnames';

import {
  mxGraph,
  mxCodec,
  mxUtils,
  mxClient,
  mxEvent,
  mxRubberband,
  mxGraphModel,
  mxCell,
  // mxCellState
} from '@/components/mxgraph';

import { IProps, defaultConfig } from './types';
import './style.scss';

const cls = 'flowchart';

const FlowChart: React.FunctionComponent<IProps> = props => {
  const { className, style, defaultValue, config = defaultConfig } = props;

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
        // 取消画布右键弹窗
        config.disableContextMenu && mxEvent.disableContextMenu(container);

        const root = new mxCell();
        setRoot(root);

        const defaultLayer = root.insert(new mxCell());
        setLayers([defaultLayer]);
        setCurrentLayer(defaultLayer);

        const model = new mxGraphModel(root);
        setModel(model);

        graph = new mxGraph(container, model);
        setGraph(graph);

        // 允许选择
        if (config.useMxRubberband) {
          new mxRubberband(graph);
        }
        // 允许连线
        if (config.connectable) {
          graph.setConnectable(true);
          // graph.connectionHandler.createEdgeState = function(me) {
          //   var edge = graph.createEdge(null, null, null, null, null);

          //   return new mxCellState(
          //     this.graph.view,
          //     edge,
          //     this.graph.getCellStyle(edge)
          //   );
          // };

          // Specifies the default edge style
          // graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] =
          //   'orthogonalEdgeStyle';
        }

        // 重写获取节点名称方法
        graph.convertValueToString = function(cell) {
          const value = this.model.getValue(cell);

          if (value != null) {
            if (mxUtils.isNode(value)) {
              return value.nodeName;
            } else {
              return value['name'];
            }
          }

          return '';
        };

        // 重写设置节点名称方法
        graph.cellLabelChanged = function(cell, value, autoSize) {
          this.model.beginUpdate();
          try {
            const v = this.model.getValue(cell);
            this.model.setValue(
              cell,
              Object.assign({}, v, {
                name: value
              })
            );

            if (autoSize) {
              this.cellSizeUpdated(cell, false);
            }
          } finally {
            this.model.endUpdate();
          }
        };

        //  绘图操作
        if (defaultValue) {
          const xmlDoc = mxUtils.parseXml(defaultValue);
          const dec = new mxCodec(xmlDoc);
          const node = xmlDoc.documentElement;
          dec.decode(node, graph.getModel());
        } else {
          // 开始绘图事务
          graph.getModel().beginUpdate();

          try {
            // TODO 自定义绘图操作
            graph.insertVertex(
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
            graph.insertVertex(
              defaultLayer,
              null,
              {
                name: `World ${key}!`
              },
              200,
              150,
              80,
              30
            );
            // graph.insertEdge(
            //   defaultLayer,
            //   null,
            //   {
            //     name: 'edge'
            //   },
            //   v1,
            //   v2
            // );
          } finally {
            graph.getModel().endUpdate();
          }
        }
      }
    }

    return () => {
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
        转换Xml数据
      </button>
      <button onClick={() => setKey(key + 1)}>重新绘制</button>
    </React.Fragment>
  );
};

export default FlowChart;
