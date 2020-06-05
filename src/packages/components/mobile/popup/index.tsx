import React from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';

import { CloseOutlined } from '@ant-design/icons';

import { ICommonProps } from '@/packages/components/types';

import './style.scss';

export type IHideFunc = () => void;

export enum EPlacement {
  'bottom' = 'bottom',
  'right' = 'right',
}

export interface IProps extends ICommonProps {
  placement?: EPlacement;
  visible: boolean;
  title?: React.ReactNode;
  onClose?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  operation?: {
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
}

const baseCls = 'm-bpm-cmpt-popup';
const headerCls = `${baseCls}-header`;
const contentCls = `${baseCls}-content`;

const Popup: React.FunctionComponent<IProps> = (props) => {
  const {
    placement = EPlacement.bottom,
    title,
    visible,
    className,
    style,
    onClose,
    operation = {},
    children,
  } = props;

  const { left, right } = operation;

  const [container, setContainer] = React.useState<HTMLDivElement>();

  React.useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setContainer(el);

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  return container
    ? ReactDOM.createPortal(
        <div
          className={classnames(baseCls, className, {
            hidden: !visible,
            [`${baseCls}--${placement}`]: !!placement,
          })}
          style={style}
        >
          <div className={`${baseCls}-mask`} onClick={onClose}></div>
          <div className={`${baseCls}-wrapper`}>
            <div className={headerCls}>
              <div className={`${headerCls}-title`}>{title}</div>
              <div className={`${headerCls}-operation ${headerCls}-l`}>
                {left}
              </div>
              <div className={`${headerCls}-operation ${headerCls}-r`}>
                {right}
                {onClose && (
                  <div className={`${headerCls}-close`} onClick={onClose}>
                    <CloseOutlined />
                  </div>
                )}
              </div>
            </div>
            <div className={contentCls}>{children}</div>
          </div>
        </div>,
        container
      )
    : null;
};

export default Popup;
