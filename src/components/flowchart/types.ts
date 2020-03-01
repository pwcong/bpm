export interface IProps {
  className?: string;
  style?: React.CSSProperties;
  defaultValue?: string;
  config?: IConfig;
}

export interface IConfig {
  disableContextMenu?: boolean;
  useMxRubberband?: boolean;
}

export const defaultConfig: IConfig = {
  disableContextMenu: true,
  useMxRubberband: true
};
