import { IConfig } from './types';

export default class LBPMIFrame {
  iframe: HTMLIFrameElement;
  values: any;

  config: IConfig;

  constructor(iframe: HTMLIFrameElement, config: IConfig) {
    this.iframe = iframe;
    this.values = {};

    this.config = Object.assign(
      {
        modulesUrlPrefix: '',
        apiUrlPrefix: '',
      },
      config
    );

    this.init = this.init.bind(this);
    this.initEvents = this.initEvents.bind(this);
    this.handleEvents = this.handleEvents.bind(this);
    this.setValues = this.setValues.bind(this);
    this.getValues = this.getValues.bind(this);
    this.destroy = this.destroy.bind(this);
    this.postMessage = this.postMessage.bind(this);

    this.init();
  }

  init() {
    this.initEvents();
  }

  initEvents() {
    window.addEventListener('message', this.handleEvents);
  }

  handleEvents(e: MessageEvent) {}

  postMessage(message, targetOrigin?: string) {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(message, targetOrigin || '*');
    }
  }

  setValues(values) {
    this.values = values;
  }
  getValues() {
    return this.values;
  }

  destroy() {
    window.removeEventListener('message', this.handleEvents);
  }
}
