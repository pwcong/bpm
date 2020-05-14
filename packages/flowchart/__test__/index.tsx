import React from 'react';
import ReactDOM from 'react-dom';

import { renderFlowChartDemo } from '@/index';

import './style.scss';

const App: React.FunctionComponent = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    ref.current && renderFlowChartDemo(ref.current);
  }, [ref]);

  return <div className="container" ref={ref}></div>;
};

ReactDOM.render(<App />, document.getElementById('app'));
