import React from 'react';
import ReactDOM from 'react-dom';

import { FlowChartDemo } from './demo';

export function renderFlowChartDemo(ele: string | HTMLElement) {
  ReactDOM.render(
    <FlowChartDemo />,
    typeof ele === 'string' ? document.getElementById(ele) : ele
  );
}
