import { mxResources, mxEventSource } from '@/components/mxgraph';

import EditorUI from '../editorui';

import { data } from './config';

export class Action extends mxEventSource {
  key: string;
  funct: Function | null;
  enabled: boolean | null;
  shortcut: string | null;
  tooltip: boolean | null;

  constructor(
    key: string,
    funct: Function | null,
    enabled: boolean | null,
    shortcut: string | null,
    tooltip: boolean | null
  ) {
    super();
    this.key = key;
    this.funct = funct;
    this.enabled = enabled !== null ? enabled : true;
    this.shortcut = shortcut;
    this.tooltip = tooltip !== null ? tooltip : true;
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
    data.forEach((d) =>
      this.addAction(d.key, () => d.funct(ui), d.enabled, d.shortcut, d.tooltip)
    );
  };

  addAction = (
    key: string,
    funct: Function | null,
    enabled: boolean | null,
    shortcut: string | null,
    tooltip: boolean | null
  ) => {
    let title;

    if (key.substring(key.length - 3) === '...') {
      key = key.substring(0, key.length - 3);
      title = mxResources.get(key) + '...';
    } else {
      title = mxResources.get(key);
    }

    return this.put(key, new Action(title, funct, enabled, shortcut, tooltip));
  };

  get = (name: string) => {
    return this.actions[name];
  };

  put = (name: string, action) => {
    this.actions[name] = action;
    return action;
  };
}
