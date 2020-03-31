import React from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';
import { IBaseProps } from '../../../types';

import './style.scss';

const cls = 'flowchart-mask';

export interface IProps extends IBaseProps {
  children: (close: Function) => React.ReactElement;
}

export function useMask(props: IProps) {
  const { className, children } = props;

  const clss = classnames(cls, className);
  const container = document.createElement('div');
  container.className = clss;

  const background = document.createElement('div');
  background.className = `${cls}-background`;
  container.appendChild(background);

  const wrapper = document.createElement('div');
  wrapper.className = `${cls}-wrapper`;
  container.appendChild(wrapper);

  const close = () => {
    ReactDOM.unmountComponentAtNode(wrapper);
    document.body.removeChild(container);
  };
  background.onclick = close;

  document.body.appendChild(container);

  ReactDOM.render(children(close), wrapper, () => {
    container.className = classnames(clss, `${cls}-active`);
  });
}
