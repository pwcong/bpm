import React, { FunctionComponent } from 'react';

import { useClosuer } from '@bpm/utils';

export interface IListener {
  name: string;
  callback: (event) => boolean;
}

export interface IProps {
  listeners?: Array<IListener>;
}

export function withReRender<P = {}>(Component) {
  const WrappedComponent: FunctionComponent<P & IProps> = (props) => {
    const { listeners = [], ...restProps } = props;

    const [key, setKey] = React.useState<number>(0);

    const listenersCallback = {};
    listeners.forEach(
      (l) =>
        (listenersCallback[l.name] = useClosuer((event) => {
          if (l.callback(event)) {
            setKey(key + 1);
          }
        }))
    );

    React.useEffect(() => {
      listeners.forEach((l) =>
        window.addEventListener(l.name, listenersCallback[l.name])
      );
      return () =>
        listeners.forEach((l) =>
          window.removeEventListener(l.name, listenersCallback[l.name])
        );
    }, [listeners]);

    return <Component key={key} {...restProps} />;
  };

  return WrappedComponent;
}
