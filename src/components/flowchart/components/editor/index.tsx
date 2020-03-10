import {
  mxEventSource,
  mxUndoManager,
  mxUtils,
  mxEvent,
  mxClient
} from '@/components/mxgraph';
import Graph from '../graph';

export default class Editor extends mxEventSource {
  static ctrlKey = mxClient.IS_MAC ? 'Cmd' : 'Ctrl';

  container: HTMLElement;

  graph: any;
  editable: boolean;

  undoManager: any;
  undoListener: any;

  constructor(container: HTMLElement, editable?: boolean) {
    super();
    this.container = container;
    this.editable = editable !== undefined ? editable : true;
    this.graph = new Graph(this.container, null, null, null);

    this.init();
  }

  init = () => {
    this.initUndoManager();
  };

  initUndoManager = () => {
    const graph = this.graph;
    const undoMgr = new mxUndoManager();

    this.undoListener = function(sender, evt) {
      undoMgr.undoableEditHappened(evt.getProperty('edit'));
    };

    // Installs the command history
    const listener = mxUtils.bind(this, function(sender, evt) {
      this.undoListener.apply(this, arguments);
    });

    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

    // Keeps the selection in sync with the history
    const undoHandler = function(sender, evt) {
      const cand = graph.getSelectionCellsForChanges(
        evt.getProperty('edit').changes
      );

      // graph.getModel();
      const cells: Array<any> = [];

      for (let i = 0; i < cand.length; i++) {
        if (graph.view.getState(cand[i]) != null) {
          cells.push(cand[i]);
        }
      }

      graph.setSelectionCells(cells);
    };

    undoMgr.addListener(mxEvent.UNDO, undoHandler);
    undoMgr.addListener(mxEvent.REDO, undoHandler);

    this.undoManager = undoMgr;
  };

  destroy = () => {
    this.graph && this.graph.destroy();
  };
}
