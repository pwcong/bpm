import React from 'react';

import classnames from 'classnames';

import { IBaseProps } from '../../types';
import EditorUi from '../editorui';

export interface IProps extends IBaseProps {
  editorUi: EditorUi;
}

const cls = `flowchart-sidebar`;

const Sidebar: React.FunctionComponent<IProps> = props => {
  const { editorUi, className, style } = props;

  React.useEffect(() => {
    // TODO
  }, [editorUi]);

  return <div className={classnames(cls, className)} style={style}></div>;
};

export default Sidebar;
