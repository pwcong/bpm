import React from 'react';
import ReactDOM from 'react-dom';

import { MXFactory } from '@/index';

const mxFactory = MXFactory({
  mxBasePath: './static',
  mxImageBasePath: './static/images',
  mxLoadResources: true,
});

const { mxEvent, mxRubberband, mxGraph } = mxFactory;

const Demo: React.FunctionComponent = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }

    // Disables the built-in context menu
    mxEvent.disableContextMenu(container);

    // Creates the graph inside the given container
    const graph = new mxGraph(container);

    // Enables rubberband selection
    new mxRubberband(graph);

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    const parent = graph.getDefaultParent();

    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();

    try {
      graph.insertVertex(
        parent,
        null,
        'Hello,',
        20,
        20,
        80,
        30,
        'verticalLabelPosition=bottom;'
      );
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }

    return () => {
      graph.destroy();
    };
  }, [ref.current]);

  return (
    <div
      style={{
        height: '400px',
      }}
      ref={ref}
    ></div>
  );
};

ReactDOM.render(<Demo />, document.getElementById('app'));
