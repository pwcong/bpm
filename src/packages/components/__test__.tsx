import React from 'react';

import { Desktop, Mobile } from './index';

const Test: React.FunctionComponent = () => {
  return (
    <div style={{padding: '8px'}}>
      <div>
        <Desktop.InputAddress.default />
      </div>
    </div>
  );
};

export default Test;
