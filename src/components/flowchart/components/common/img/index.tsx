import React from 'react';

export interface IProps {
  className?: string;
  style?: React.CSSProperties;
  src: string;
}

const IMG: React.FunctionComponent<IProps> = props => {
  return <img {...props} />;
};

export interface ITitleSVGProps extends IProps {
  title: React.ReactNode;
}

export const TitleIMG: React.FunctionComponent<ITitleSVGProps> = props => {
  const { title, ...restProps } = props;

  return (
    <React.Fragment>
      <IMG {...restProps} />
      {title}
    </React.Fragment>
  );
};

export default IMG;
