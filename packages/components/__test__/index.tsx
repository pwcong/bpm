import React from 'react';
import ReactDOM from 'react-dom';

import { InputAddress } from '../index';

const Test: React.FunctionComponent = () => {
  React.useEffect(() => {}, []);

  return (
    <div style={{ padding: '8px' }}>
      <InputAddress />
    </div>
  );
};

ReactDOM.render(<Test />, document.getElementById('app'));
