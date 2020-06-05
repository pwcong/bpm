import React from 'react';

export interface ICommonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
  locale?: { [key: string]: string };
}

export interface ICommonPropertyProps<T> extends ICommonProps {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  isMulti?: boolean;
}
