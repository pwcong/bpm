import React from 'react';

import { Input, Checkbox, Radio, Empty } from 'antd';

import { CloseCircleTwoTone } from '@ant-design/icons';

import { classnames } from '@bpm/utils';

import { ICommonPropertyProps } from '../types';
import { ISelectorRefObject } from '../input-select';

import AddressItem from './item';
import { IOptions, IValue, IValueItem } from './types';

import './style.scss';

const baseCls = 'bpm-components-address';

export interface IProps extends ICommonPropertyProps<IValue> {
  searchPlaceholder?: string;
  wrappedComponentRef?: (ref: ISelectorRefObject<IValue>) => void;
}

export function buildAddress(options: IOptions) {
  const { api } = options;

  const Address: React.FunctionComponent<IProps> = (props) => {
    const {
      className,
      defaultValue = [],
      value: propsValue,
      onChange,
      isMulti,
      wrappedComponentRef,
      locale = {},
      searchPlaceholder = '搜地址本',
    } = props;

    const { empty: emptyText = '暂无数据' } = locale;

    const [value, setValue] = React.useState<IValue>(
      propsValue !== undefined ? propsValue : defaultValue
    );

    const [options, setOptions] = React.useState<IValue>([]);

    const valueMap = value.reduce(
      (p, c) => p.set(c.id, c),
      new Map<string, IValueItem>()
    );

    const handleChange = React.useCallback(
      (v: IValue) => {
        setValue(v);
        onChange && onChange(v);
      },
      [onChange]
    );

    const handleSearch = React.useCallback((keyword: string) => {
      api.search(keyword).then((options) => {
        setOptions(options);
      });
    }, []);

    React.useEffect(() => {
      handleSearch('');
    }, []);

    React.useEffect(() => {
      propsValue && setValue(propsValue);
    }, [propsValue]);

    React.useEffect(() => {
      wrappedComponentRef &&
        wrappedComponentRef({
          current: {
            handleOk: () => Promise.resolve(value),
          },
        });
    });

    return (
      <div className={classnames(baseCls, className)}>
        <div className={`${baseCls}-wrapper`}>
          <div className={`${baseCls}-t`}>
            <Input.Search
              placeholder={searchPlaceholder}
              onSearch={(search) => {
                handleSearch(search);
              }}
            />
          </div>
          <div className={`${baseCls}-m`}>
            {options.length > 0 ? (
              <div className={`${baseCls}-list`}>
                {options.map((o, i) =>
                  isMulti ? (
                    <Checkbox
                      key={o.id || i}
                      checked={valueMap.has(o.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        handleChange(
                          value
                            .filter((v) => v.id !== o.id)
                            .concat(checked ? [o] : [])
                        );
                      }}
                    >
                      <AddressItem direction="horizontal" data={o} />
                    </Checkbox>
                  ) : (
                    <Radio
                      key={o.id || i}
                      checked={valueMap.has(o.id)}
                      onChange={(e) => {
                        handleChange([o]);
                      }}
                    >
                      <AddressItem direction="horizontal" data={o} />
                    </Radio>
                  )
                )}
              </div>
            ) : (
              <Empty className={`${baseCls}-empty`} description={emptyText} />
            )}
          </div>
          <div className={`${baseCls}-b`}>
            <div className={`${baseCls}-value`}>
              {value.map((v, i) => (
                <div className={`${baseCls}-value-item`} key={v.id || i}>
                  <AddressItem data={v} />
                  <CloseCircleTwoTone
                    className={`${baseCls}-value-item-btn`}
                    onClick={() => {
                      const newValue = [...value];
                      newValue.splice(i, 1);
                      handleChange(newValue);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return Address;
}
