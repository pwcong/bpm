import React from 'react';

import { config } from './index';

const Test: React.FunctionComponent = () => {
  return <div style={{ padding: '8px' }}>{JSON.stringify(config)}</div>;
};

export default Test;
