import EditorUI from './components/editorui';

export interface IBaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface IProps extends IBaseProps {
  config?: IConfig;
}

export interface IConfig {
  /** 是否允许编辑 */
  enable?: boolean;
}

export const defaultConfig: IConfig = {
  enable: true
};

export enum ECellType {
  /** 节点 */
  'VERTEX' = 'VERTEX',
  /** 线条 */
  'EDGE' = 'EDGE'
}

export type ICellListenerCallbackEvent = CustomEvent<{
  ref: {
    element: HTMLElement | null;
    render: () => void;
  };
  editorUI: EditorUI;
  cell: ICell;
}>;

export type ICellListenerCallback = (event: ICellListenerCallbackEvent) => void;

export interface ICellListener {
  name: string;
  callback: ICellListenerCallback;
}

export interface ICell {
  key: string;
  title: string;
  type?: ECellType;
  value?: ICellValue;
  geometry?: ICellGeometry;
  style?: string;
  component?: React.ReactNode;
  getComponent?: (
    component: React.ReactElement,
    editorUI: EditorUI,
    cell: ICell
  ) => React.ReactElement;
  listeners?: Array<ICellListener>;
}

export interface ICellValue {
  name: string;
}

export interface ICellGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}
