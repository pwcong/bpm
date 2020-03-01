import React from 'react';

import FlowChart from '@/components/flowchart';

import './style/app.scss';

const App: React.FunctionComponent = () => {
  return (
    <div className="container">
      <FlowChart />
    </div>
  );
};

export default App;
