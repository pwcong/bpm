import {
  mxClient,
  mxEvent,
  mxResources,
  mxEventSource
} from '@/components/mxgraph';

import EditorUI from '../editorui';
import Editor from '../editor';

export class Action extends mxEventSource {
  label: string;
  funct: Function | null;
  enabled: boolean | null;
  shortcut: string | null;

  constructor(
    label: string,
    funct: Function | null,
    enabled: boolean | null,
    shortcut: string | null
  ) {
    super();
    this.label = label;
    this.funct = funct;
    this.enabled = enabled !== null ? enabled : true;
    this.shortcut = shortcut;
  }
}

export default class Actions {
  editorUI: EditorUI;
  actions: { [key: string]: Action };

  constructor(editorUI: EditorUI) {
    this.editorUI = editorUI;
    this.actions = {};
    this.init();
  }

  init = () => {
    const ui = this.editorUI;
    const editor = ui.editor;
    const graph = editor.graph;

    this.addAction(
      'undo',
      function() {
        ui.undo();
      },
      null,
      Editor.ctrlKey + '+Z'
    );
    this.addAction(
      'redo',
      function() {
        ui.redo();
      },
      null,
      !mxClient.IS_WIN ? Editor.ctrlKey + '+Shift+Z' : Editor.ctrlKey + '+Y'
    );

    function deleteCells(includeEdges) {
      // Cancels interactive operations
      graph.escape();
      const cells = graph.getDeletableCells(graph.getSelectionCells());

      if (cells != null && cells.length > 0) {
        const parents = graph.selectParentAfterDelete
          ? graph.model.getParents(cells)
          : null;
        graph.removeCells(cells, includeEdges);

        // Selects parents for easier editing of groups
        if (parents != null) {
          const select: Array<any> = [];

          for (let i = 0; i < parents.length; i++) {
            if (
              graph.model.contains(parents[i]) &&
              (graph.model.isVertex(parents[i]) ||
                graph.model.isEdge(parents[i]))
            ) {
              select.push(parents[i]);
            }
          }

          graph.setSelectionCells(select);
        }
      }
    }

    this.addAction(
      'delete',
      function(evt) {
        deleteCells(evt != null && mxEvent.isShiftDown(evt));
      },
      null,
      'Delete'
    );

    this.addAction(
      'deleteAll',
      function() {
        deleteCells(true);
      },
      null,
      Editor.ctrlKey + '+Delete'
    );
  };

  addAction = (
    key: string,
    funct: Function | null,
    enabled: boolean | null,
    shortcut: string | null
  ) => {
    let title;

    if (key.substring(key.length - 3) == '...') {
      key = key.substring(0, key.length - 3);
      title = mxResources.get(key) + '...';
    } else {
      title = mxResources.get(key);
    }

    return this.put(key, new Action(title, funct, enabled, shortcut));
  };

  get = (name: string) => {
    return this.actions[name];
  };

  put = (name: string, action) => {
    this.actions[name] = action;
    return action;
  };
}
