import React from 'react';

import classnames from 'classnames';

import { useClosuer } from '@/utils/hook';

import { IBaseProps, ICell, ICellListenerCallback } from '../../types';
import EditorUI from '../editorui';
import { data } from './config';

import './style.scss';

export interface IProps extends IBaseProps {
  editorUI: EditorUI;
}

export interface IMenubarItemProps extends IBaseProps {
  editorUI: EditorUI;
  data: ICell;
}

export const baseCls = `flowchart-menubar`;
export const itemCls = `${baseCls}-item`;

export const MenubarItem: React.FunctionComponent<IMenubarItemProps> = props => {
  const { className, style, editorUI, data } = props;

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [key, setKey] = React.useState<number>(0);

  const { listeners = [] } = data;

  const listenersCallback = {};
  listeners.forEach(
    l =>
      (listenersCallback[l.name] = useClosuer<ICellListenerCallback>(() => {
        l.callback(
          new CustomEvent(l.name, {
            detail: {
              ref: {
                element: ref.current,
                render: () => setKey(key + 1)
              },
              editorUI,
              cell: data
            }
          })
        );
      }))
  );

  React.useEffect(() => {
    listeners.forEach(l =>
      window.addEventListener(l.name, listenersCallback[l.name])
    );
    return () =>
      listeners.forEach(l =>
        window.removeEventListener(l.name, listenersCallback[l.name])
      );
  }, [editorUI, data]);

  const itemProps = {
    style,
    className: classnames(itemCls, className)
  };

  let cmpt = <div {...itemProps}>{data.component}</div>;

  if (data.getComponent) {
    cmpt = data.getComponent(cmpt, editorUI, data);
  }

  console.log('render');

  return React.cloneElement(cmpt, {
    ref,
    key
  });
};

const Menubar: React.FunctionComponent<IProps> = props => {
  const { editorUI, className, style } = props;

  React.useEffect(() => {
    // DO NOTHING
  }, [EditorUI]);

  return (
    <div className={classnames(baseCls, className)} style={style}>
      {data.map(item => {
        return <MenubarItem key={item.key} editorUI={editorUI} data={item} />;
      })}
    </div>
  );
};

export default Menubar;
