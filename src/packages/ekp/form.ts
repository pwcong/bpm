import LBPMIFrame from './iframe';
import { checkMessage, getMessage } from './utils';
import globalConfig from './config';

export default class LBPMForm extends LBPMIFrame {
  addressIFrame: HTMLIFrameElement;

  valuesCallback?: Function;

  handleEvents(e: MessageEvent) {
    // 显示地址本
    checkMessage(
      e,
      globalConfig.system,
      'sys-org',
      'showAddressIFrame',
      (message) => {
        const iframe = (this.addressIFrame = document.createElement('iframe'));
        iframe.style.position = 'fixed';
        iframe.style.left = '0px';
        iframe.style.top = '0px';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.zIndex = '1000';
        iframe.style.border = 'none';
        iframe.src = `${
          this.config.modulesUrlPrefix
        }/sys-org/desktop/#/sysOrgIntegrate/address?props=${encodeURIComponent(
          JSON.stringify(
            Object.assign({}, message.payload, {
              _key: message._key,
            })
          )
        )}`;
        document.body.appendChild(iframe);
      }
    );

    // 隐藏地址本
    checkMessage(e, globalConfig.system, 'sys-org', 'hideAddressIFrame', () => {
      this.addressIFrame && document.body.removeChild(this.addressIFrame);
    });

    // 转发地址本数据
    checkMessage(
      e,
      globalConfig.system,
      'sys-org',
      'postAddressValue',
      (message) => {
        this.postMessage(message);
      }
    );

    // 缓存值
    getMessage(e, 'postFormValues', (message) => {
      this.setValues(message.payload);
      if (this.valuesCallback) {
        this.valuesCallback(message.payload);
        this.valuesCallback = undefined;
      }
    });
  }

  getValuesWithCallback = (callback: Function) => {
    this.valuesCallback = callback;
    this.postMessage({
      ...globalConfig,
      method: 'getFormValues',
    });
  };
}
