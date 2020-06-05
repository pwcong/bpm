import React from 'react';

import { buildAddress } from '@/packages/components/desktop/address';
import { IValueItem } from '@/packages/components/desktop/address/types';
import { buildInputSelect } from '@/packages/components/desktop/input-select';
import {
  ESelectorType,
  EValueType,
} from '@/packages/components/desktop/input-select/types';

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
