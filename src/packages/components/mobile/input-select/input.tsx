import React from 'react';

import classnames from 'classnames';
import { RightOutlined } from '@ant-design/icons';

import Popup, { EPlacement } from '@/packages/components/mobile/popup';
import {
  IOptions,
  IBaseProps,
  IValue,
  EValueType,
  ISelectorRef,
} from '@/packages/components/desktop/input-select';

import { ESelectorType } from './types';
import { getValue } from './utils';

import './style.scss';

const baseCls = 'm-bpm-cmpt-inputselect';
const valueCls = `${baseCls}-value`;
const valueItemCls = `${valueCls}-item`;

export interface IProps<T> extends IBaseProps<IValue<T>> {
  beforeChange?: (value: Array<T>) => Promise<Array<T>>;
  title?: React.ReactNode;
}

export function buildInputSelect<T = any, P = {}>(options: IOptions<T, P>) {
  const {
    selector,
    valueType,
    valueKeyProperty = 'value',
    valueTextProperty = 'text',
    valueRenderer,
  } = options;

  const { title: selectorTitle, type, builder } = selector;

  const InputSelect: React.FunctionComponent<
    IProps<T> & P & { forwardedRef: any }
  > = (props) => {
    const {
      className,
      style,
      value: propsValue,
      defaultValue,
      onChange,
      beforeChange,
      onRenderItem,
      onRenderValue,
      isMulti,
      placeholder = '请选择',
      title,
    } = props;

    const selectorRef = React.useRef<ISelectorRef<Array<T>>>();

    const [value, setValue] = React.useState<Array<T>>(
      getValue<T>(defaultValue) || []
    );
    const [tempValue, setTempValue] = React.useState<IValue<T> | undefined>();
    const [popupVisible, setPopupVisible] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (tempValue !== propsValue) {
        setTempValue(propsValue);
        setValue(getValue<T>(propsValue) || []);
      }
    }, [propsValue]);

    const renderValue = (v: Array<T>) => {
      if (v.length <= 0) {
        return (
          <span className={`${valueItemCls} ${valueItemCls}-placeholder`}>
            {placeholder}
          </span>
        );
      }

      if (onRenderValue !== undefined) {
        return onRenderValue(v);
      }

      if (valueType === EValueType.object) {
        return v.map((_v, i) => (
          <span key={_v[valueKeyProperty] || i} className={valueItemCls}>
            {onRenderItem ? onRenderItem(_v, i, v) : _v[valueTextProperty]}
          </span>
        ));
      } else {
        return v.map((_v, i) => (
          <span key={i} className={valueItemCls}>
            {onRenderItem ? onRenderItem(_v, i, v) : _v}
          </span>
        ));
      }
    };

    const handleChange = (v: Array<T>, isOk?: boolean) => {
      if (!isMulti) {
        v.length > 0 && (v = [v[v.length - 1]]);
      }

      const cb = (_v: Array<T>) => {
        setValue(_v);

        if (isMulti) {
          onChange && onChange(_v);
        } else {
          onChange && onChange(_v[0] || null);
        }
      };

      if (beforeChange) {
        beforeChange(v)
          .then(cb)
          .catch(() => {
            // DO NOTHING
          });
      } else {
        cb(v);
      }
    };

    const handleOk = (v: Array<T>) => {
      handleChange(v, true);
    };

    const handleCancel = React.useCallback(() => {
      handleChange([...value], true);
    }, [value]);

    const handleTrigger = React.useCallback(() => {
      setPopupVisible(true);
    }, []);

    const selector = React.cloneElement(
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

    return (
      <React.Fragment>
        <div
          className={classnames(baseCls, className, {
            [`${baseCls}--${type}`]: !!type,
          })}
          style={style}
        >
          {valueRenderer ? (
            React.cloneElement(
              valueRenderer({
                ...props,
                onChange: handleChange,
                defaultValue: value,
                value: value,
                onTrigger: handleTrigger,
              })
            )
          ) : (
            <div className={`${baseCls}-wrapper`} onClick={handleTrigger}>
              <div className={`${baseCls}-value`}>{renderValue(value)}</div>
              <div className={`${baseCls}-trigger`}>
                <RightOutlined />
              </div>
            </div>
          )}
        </div>
        <Popup
          placement={
            type === ESelectorType.drawer ? EPlacement.right : undefined
          }
          visible={popupVisible}
          onClose={handleCancel}
          title={title || selectorTitle}
        >
          {selector}
        </Popup>
      </React.Fragment>
    );
  };

  const WrappedInputSelect = React.forwardRef<any, IProps<T> & P>(
    (props, ref) => <InputSelect {...props} forwardedRef={ref} />
  );

  return WrappedInputSelect;
}
