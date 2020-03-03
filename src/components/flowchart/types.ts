export interface IProps {
  className?: string;
  style?: React.CSSProperties;
  defaultXml?: string;
  config?: IConfig;
}

export interface IConfig {
  /** 获取对象数据 */
  getValue?: () => object;
  /** 对象标题字段 */
  labelProperty?: string;
  /** 是否允许编辑 */
  enable?: boolean;
  /** 是否允许连接对象 */
  connectable?: boolean;
  /** 是否允许框选对象 */
  useRubberband?: boolean;
  /** 是否使用提示 */
  useTooltip?: boolean;
  /** 是否编辑时按回车键完成输入 */
  useEnterStopsCellEditing?: boolean;
  /** 是否使用高亮 */
  useHeighlight?: boolean;
  /** 是否多连接 */
  useMultigraph?: boolean;
  /** 是否使用辅助线 */
  useGuides?: boolean;
}

export const defaultLabelProperty = 'name';

export const defaultConfig: IConfig = {
  enable: true,
  connectable: true,
  getValue: () => ({ name: 'HelloWorld' }),
  labelProperty: defaultLabelProperty,
  useRubberband: true,
  useTooltip: true,
  useEnterStopsCellEditing: true,
  useHeighlight: true,
  useMultigraph: false,
  useGuides: true
};
