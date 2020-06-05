import React from 'react';
import ReactDOM from 'react-dom';

const Test: React.FunctionComponent = () => {
  return <div>Hello World!</div>;
};

ReactDOM.render(<Test />, document.getElementById('app'));
