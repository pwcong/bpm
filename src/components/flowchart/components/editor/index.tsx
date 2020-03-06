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

  graph: any;
  editable: boolean;

  undoManager: any;
  undoListener: any;

  constructor(
    model: any | null,
    editable: boolean | null
  ) {
    super();
    this.graph = this.createGraph(model);
    this.editable = editable !== null ? editable : true;
    this.undoManager = this.createUndoManager();

    this.init();
  }

  createGraph = (model) => {
    const graph = new Graph(null, model, null, null);
    return graph;
  };

  createUndoManager = () => {
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

    return undoMgr;
  };

  init = () => {
    // DO NOTHING
  };

  destroy = () => {
    if (this.graph !== null) {
      this.graph.destroy();
    }
  };
}
