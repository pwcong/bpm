import { mxEventSource } from '@/components/mxgraph';
import { postEvent } from '@/utils/event';

import { EEventName } from '../../config';
import Editor from '../editor';
import Actions from '../actions';

export default class EditorUI extends mxEventSource {
  editor: Editor;
  container: HTMLElement;

  actions: Actions;

  constructor(container: HTMLElement) {
    super();

    this.container = container;

    this.editor = new Editor(container, true);
    this.actions = new Actions(this);
  }

  canUndo = () => this.editor.undoManager.indexOfNextAdd > 0;
  undo = () => {
    try {
      const graph = this.editor.graph;

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
      const graph = this.editor.graph;

      if (graph.isEditing()) {
        document.execCommand('redo', false);
      } else {
        this.editor.undoManager.redo();
      }
    } catch (e) {
      // ignore all errors
    } finally {
      postEvent(EEventName.redo);
    }
  };

  destroy = () => {
    if (this.editor != null) {
      this.editor.destroy();
    }
  };
}
