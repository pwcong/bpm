import EditorUI from '../editorui';
import Editor from '../editor';

export const map = {
  undo: {
    key: 'undo',
    funct: function(editorUI: EditorUI) {
      editorUI.undo();
    },
    enabled: true,
    shortcut: Editor.ctrlKey + '+Z',
    tooltip: true
  },
  redo: {
    key: 'redo',
    funct: function(editorUI: EditorUI) {
      editorUI.redo();
    },
    enabled: true,
    shortcut: Editor.ctrlKey + '+Shift+Z',
    tooltip: true
  },
  delete: {
    key: 'delete',
    funct: function(editorUI: EditorUI) {
      editorUI.delete();
    },
    enabled: true,
    shortcut: 'Delete',
    tooltip: true
  },
  rubberband: {
    key: 'rubberband',
    funct: function(editorUI: EditorUI) {
      editorUI.rubberband();
    },
    enabled: true,
    shortcut: Editor.ctrlKey + '+Left',
    tooltip: true
  },
  alignTop: {
    key: 'alignTop',
    funct: function(editorUI: EditorUI) {
      editorUI.align('top');
    },
    enabled: true,
    shortcut: null,
    tooltip: false
  },
  alignTBCenter: {
    key: 'alignTBCenter',
    funct: function(editorUI: EditorUI) {
      editorUI.align('tbCenter');
    },
    enabled: true,
    shortcut: null,
    tooltip: false
  },
  alignBottom: {
    key: 'alignBottom',
    funct: function(editorUI: EditorUI) {
      editorUI.align('bottom');
    },
    enabled: true,
    shortcut: null,
    tooltip: false
  },
  alignLeft: {
    key: 'alignLeft',
    funct: function(editorUI: EditorUI) {
      editorUI.align('left');
    },
    enabled: true,
    shortcut: null,
    tooltip: false
  },
  alignLRCenter: {
    key: 'alignLRCenter',
    funct: function(editorUI: EditorUI) {
      editorUI.align('lrCenter');
    },
    enabled: true,
    shortcut: null,
    tooltip: false
  },
  alignRight: {
    key: 'alignRight',
    funct: function(editorUI: EditorUI) {
      editorUI.align('right');
    },
    enabled: true,
    shortcut: null,
    tooltip: false
  }
};

export const data = [
  map.undo,
  map.redo,
  map.delete,
  map.rubberband,
  map.alignTop,
  map.alignTBCenter,
  map.alignBottom,
  map.alignLeft,
  map.alignLRCenter,
  map.alignRight
];
