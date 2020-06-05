import LBPMIFrame from './iframe';
import { getMessage } from './utils';

import globalConfig from './config';

export default class LBPMDesigner extends LBPMIFrame {
  valuesCallback?: Function;
  readyCallback?: Function;

  handleEvents(e: MessageEvent) {
    getMessage(e, 'postDesignerValues', (message) => {
      this.setValues(message.payload);
      if (this.valuesCallback) {
        this.valuesCallback(message.payload);
        this.valuesCallback = undefined;
      }
    });

    getMessage(e, 'postDesignerReady', (message) => {
      if (this.readyCallback) {
        this.readyCallback(message.payload);
        this.readyCallback = undefined;
      }
    });
  }

  checkReadyWithCallback = (callback: Function) => {
    this.readyCallback = callback;
    this.postMessage({
      ...globalConfig,
      method: 'checkDesignerReady',
    });
  };

  getValuesWithCallback = (callback: Function) => {
    this.valuesCallback = callback;
    this.postMessage({
      ...globalConfig,
      method: 'getDesignerValues',
    });
  };
}
