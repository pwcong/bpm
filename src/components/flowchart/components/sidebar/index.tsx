import React from 'react';

import classnames from 'classnames';

import { IBaseProps } from '../../types';
import EditorUI from '../editorui';

export interface IProps extends IBaseProps {
  editorUI: EditorUI;
}

const cls = `flowchart-sidebar`;

const Sidebar: React.FunctionComponent<IProps> = props => {
  const { editorUI, className, style } = props;

  React.useEffect(() => {
    // TODO
  }, [editorUI]);

  return <div className={classnames(cls, className)} style={style}></div>;
};

export default Sidebar;
