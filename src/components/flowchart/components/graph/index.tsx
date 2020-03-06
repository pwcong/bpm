import {
  mxGraph,
  mxRubberband,
  mxKeyHandler
} from '@/components/mxgraph';

export default class Graph extends mxGraph {
  rubberband: any;
  keyHandler: any;

  model: any
  cellSizeUpdated: any

  constructor(
    container: HTMLElement | null,
    model: any | null,
    renderHint: string | null,
    stylesheet: string | null,
  ) {
    super(container, model, renderHint, stylesheet);
    this.keyHandler = new mxKeyHandler(this);
    this.rubberband = new mxRubberband(this);
  }

  // 重写获取节点名称方法
  convertValueToString = cell => {
    const value = this.model.getValue(cell) || {};
    return value['name'] || '';
  };

  // 重写设置节点名称方法
  cellLabelChanged = (cell, value, autoSize) => {
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
}
