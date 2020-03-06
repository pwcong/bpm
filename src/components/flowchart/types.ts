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

export interface ICell {
  key: string;
  title: string;
  value?: ICellValue;
  geometry?: ICellGeometry;
  style?: string;
  component?: React.ReactNode;
  isVertex?: boolean;
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
