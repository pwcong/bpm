import React from 'react';

import { buildAddress, IValueItem } from '@/components/address';
import {
  buildInputSelect,
  ESelectorType,
  EValueType,
} from '@/components/input-select';

const Address = buildAddress({
  api: {
    search: () => Promise.resolve([]),
  },
});

const InputAddress = buildInputSelect<IValueItem>({
  selector: {
    title: '地址本',
    type: ESelectorType.modal,
    builder: (props) => <Address {...props} />,
  },
  valueType: EValueType.object,
  valueKeyProperty: 'id',
  valueTextProperty: 'name',
});

export default InputAddress;
