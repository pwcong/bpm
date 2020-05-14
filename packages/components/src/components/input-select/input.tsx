import React from 'react';

import { Dropdown, Modal } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

import { classnames } from '@bpm/utils';

import {
  IOptions,
  IValue,
  IBaseProps,
  ESelectorType,
  EValueType,
  EHTMLType,
  ISelectorRef,
} from './types';
import { getValue } from './utils';

import './style.scss';

const baseCls = 'bpm-components-inputselect';
const valueCls = `${baseCls}-value`;
const valueItemCls = `${valueCls}-item`;
const valueItemTitleCls = `${valueItemCls}-title`;
const valueItemBtnCls = `${valueItemCls}-btn`;

export interface IProps<T> extends IBaseProps<IValue<T>> {
  title?: React.ReactNode;
  htmlType?: EHTMLType;
}

export function buildInputSelect<T = any, P = {}>(options: IOptions<T, P>) {
  const {
    selector,
    valueType,
    valueKeyProperty = 'value',
    valueTextProperty = 'text',
    valueRenderer,
  } = options;

  const { type, builder, title } = selector;

  const InputSelect: React.FunctionComponent<
    IProps<T> & P & { forwardedRef: any }
  > = (props) => {
    const {
      className,
      style,
      defaultValue,
      onChange,
      onRenderItem,
      onRenderValue,
      multi,
      htmlType,
      placeholder = '请选择',
      locale = {},
    } = props;

    const { ok: okText = '确定', cancel: cancelText = '取消' } = locale;

    const selectorRef = React.useRef<ISelectorRef<Array<T>>>();
    const [stateValue, setStateValue] = React.useState<Array<T>>(
      getValue<T>(defaultValue) || []
    );
    const [visible, setVisible] = React.useState<boolean>(false);

    const value =
      getValue<T>(props.value !== undefined ? props.value : stateValue) || [];

    const handleChange = React.useCallback(
      (v: Array<T>, isOk?: boolean) => {
        if (!multi) {
          v.length > 0 && (v = [v[v.length - 1]]);
        }

        setStateValue(v);
        isOk && setVisible(false);

        if (multi) {
          onChange && onChange(v);
        } else {
          onChange && onChange(v[0] || null);
        }
      },
      [multi, onChange]
    );

    const handleOk = React.useCallback(
      (v: Array<T>) => {
        handleChange(v, true);
      },
      [handleChange]
    );

    const handleCancel = React.useCallback(() => {
      setVisible(false);
    }, []);

    const handleTrigger = React.useCallback(() => {
      setVisible(true);
    }, []);

    const renderValue = React.useCallback(
      (v: Array<T>) => {
        if (v.length <= 0) {
          return <div className={`${valueCls}-placeholder`}>{placeholder}</div>;
        }

        if (onRenderValue !== undefined) {
          return onRenderValue(v);
        }

        if (valueType === EValueType.object) {
          return v.map((_v, i) => (
            <span key={_v[valueKeyProperty] || i} className={valueItemCls}>
              <span className={valueItemTitleCls}>
                {onRenderItem ? onRenderItem(_v, i, v) : _v[valueTextProperty]}
              </span>
              <span className={valueItemBtnCls}>
                <CloseOutlined
                  onClick={() => {
                    v.splice(i, 1);
                    handleChange([...v]);
                  }}
                />
              </span>
            </span>
          ));
        } else {
          return v.map((_v, i) => (
            <span key={i} className={valueItemCls}>
              <span className={valueItemTitleCls}>
                {onRenderItem ? onRenderItem(_v, i, v) : _v}
              </span>
              <span className={valueItemBtnCls}>
                <CloseOutlined
                  onClick={() => {
                    v.splice(i, 1);
                    handleChange([...v]);
                  }}
                />
              </span>
            </span>
          ));
        }
      },
      [placeholder, onRenderValue, onRenderItem, valueType]
    );

    const selector = React.createElement(
      builder({
        ...props,
        onOk: handleOk,
        onCancel: handleCancel,
        defaultValue: value,
        value,
        wrappedComponentRef: (ref: React.RefObject<ISelectorRef<Array<T>>>) =>
          (selectorRef.current = ref.current),
      })
    );

    const main = (
      <div
        className={classnames(baseCls, className, {
          [`${baseCls}--${type}`]: !!type,
          [`${baseCls}--${htmlType}`]: !!htmlType,
        })}
        style={style}
      >
        {valueRenderer ? (
          React.createElement(
            valueRenderer({
              ...props,
              onChange: handleChange,
              defaultValue: value,
              value: value,
              onTrigger: handleTrigger,
            })
          )
        ) : (
          <div className={`${baseCls}-wrapper`}>
            <div className={`${baseCls}-value`}>{renderValue(value)}</div>
            <div className={`${baseCls}-trigger`} onClick={handleTrigger}>
              <PlusOutlined />
            </div>
          </div>
        )}
      </div>
    );

    return type === ESelectorType.dropdown ? (
      <Dropdown
        visible={visible}
        trigger={['click']}
        onVisibleChange={(v) => !v && setVisible(v)}
        overlay={<div className={`${baseCls}-dropdown`}>{selector}</div>}
      >
        {main}
      </Dropdown>
    ) : (
      <React.Fragment>
        {main}
        <Modal
          title={title}
          visible={visible}
          okText={okText}
          cancelText={cancelText}
          onCancel={handleCancel}
          onOk={() => {
            console.log(selectorRef.current);
            selectorRef.current
              ?.handleOk?.()
              .then((v) => handleChange(v, true));
          }}
        >
          {selector}
        </Modal>
      </React.Fragment>
    );
  };

  const WrappedInputSelect = React.forwardRef<any, IProps<T> & P>(
    (props, ref) => <InputSelect {...props} forwardedRef={ref} />
  );

  return WrappedInputSelect;
}
