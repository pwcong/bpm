export interface ICommonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
  locale?: { [key: string]: string };
}
