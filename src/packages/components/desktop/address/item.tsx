import React from 'react';

import { Avatar } from 'antd';
import classnames from 'classnames';

import { ICommonProps } from '@/packages/components/types';

import { IValueItem } from './types';

import './item.scss';

export interface IProps extends ICommonProps {
  data: IValueItem;
  direction?: 'vertical' | 'horizontal';
}

const baseCls = 'bpm-cmpt-address-item';

const AddressItem: React.FunctionComponent<IProps> = (props) => {
  const { data, direction = 'vertical' } = props;

  const { avatar, name, department } = data;

  return (
    <div
      className={classnames(baseCls, {
        [`${baseCls}--${direction}`]: !!direction,
      })}
    >
      <div className={`${baseCls}-avatar`}>
        <Avatar src={avatar}>{name}</Avatar>
      </div>
      <div className={`${baseCls}-info`}>
        <div className={`${baseCls}-name`}>{name}</div>
      </div>
    </div>
  );
};

export default AddressItem;
