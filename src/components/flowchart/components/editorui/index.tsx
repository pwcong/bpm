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

  // 回退判断与操作
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

  // 重做判断与操作
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

  // 框选判断与操作
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

  // 删除判断与操作
  canDelete = () =>
    this.graph.isEnabled() && this.graph.getSelectionCells().length > 0;
  delete = () => {
    try {
      this.graph.removeCells();
    } catch (e) {
      // DO NOTHING
    }
  };

  // 重绘操作
  redraw = (delay?: number) => {
    setTimeout(() => {
      this.editor.initPageFormat();
      this.graph.view.validate();
      this.graph.sizeDidChange();
    }, delay);
  };

  // 销毁对象
  destroy = () => {
    if (this.editor != null) {
      this.editor.destroy();
    }
  };
}
