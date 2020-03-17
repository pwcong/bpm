import { mxEventSource } from '@/components/mxgraph';
import { postEvent } from '@/utils/event';

import { EEventName } from '../../config';
import Editor from '../editor';
import Actions from '../actions';

export default class EditorUI extends mxEventSource {
  container: HTMLElement;

  editor: Editor;
  graph: any;

  actions: Actions;

  constructor(container: HTMLElement, editable?: boolean) {
    super();

    this.container = container;

    this.editor = new Editor(container, editable);
    this.graph = this.editor.graph;

    this.actions = new Actions(this);
  }

  canUndo = () => this.editor.undoManager.indexOfNextAdd > 0;
  undo = () => {
    try {
      const graph = this.graph;

      if (graph.isEditing()) {
        // Stops editing and executes undo on graph if native undo
        // does not affect current editing value
        const value = graph.cellEditor.textarea.innerHTML;
        document.execCommand('undo', false);

        if (value == graph.cellEditor.textarea.innerHTML) {
          graph.stopEditing(true);
          this.editor.undoManager.undo();
        }
      } else {
        this.editor.undoManager.undo();
      }
    } catch (e) {
      // ignore all errors
    } finally {
      postEvent(EEventName.undo);
    }
  };

  canRedo = () =>
    this.editor.undoManager.indexOfNextAdd <
    this.editor.undoManager.history.length;
  redo = () => {
    try {
      const graph = this.graph;

      if (graph.isEditing()) {
        document.execCommand('redo', false);
      } else {
        this.editor.undoManager.redo();
      }
    } catch (e) {
      // DO NOTHING
    } finally {
      postEvent(EEventName.redo);
    }
  };

  canRubberBand = () => this.graph.rubberband.enabled;
  rubberband = () => {
    try {
      this.graph.rubberband.setEnabled(!this.graph.rubberband.enabled);
    } catch (e) {
      // DO NOTHING
    } finally {
      postEvent(EEventName.rubberband);
    }
  };

  canDelete = () =>
    this.graph.isEnabled() && this.graph.getSelectionCells().length > 0;
  delete = () => {
    try {
      this.graph.removeCells();
    } catch (e) {
      // DO NOTHING
    }
  };

  destroy = () => {
    if (this.editor != null) {
      this.editor.destroy();
    }
  };
}
