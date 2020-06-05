import React from 'react';

import { withRouter, Route, Switch, RouteComponentProps } from 'react-router';
import { HashRouter as Router } from 'react-router-dom';

import classnames from 'classnames';

import packageJSON from '../package.json';

import 'antd/dist/antd.less';
import './docs.scss';

export type IComponent = {
  entry: React.FunctionComponent | React.ComponentClass;
  name: string;
};

export interface IProps extends RouteComponentProps {
  components: Array<IComponent>;
}

const baseCls = 'bpm-docs';

const Home: React.FunctionComponent = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        paddingTop: '192px',
        fontSize: 24,
        color: '#333',
      }}
    >
      {packageJSON.name}
      <p
        style={{
          textAlign: 'center',
          color: '#999999',
          fontSize: 12,
          marginTop: '16px',
        }}
      >
        {packageJSON.description}
      </p>
    </div>
  );
};

const App: React.FunctionComponent<IProps> = (props) => {
  const { components, history } = props;

  const renderAside = () => {
    const cls = `${baseCls}-aside`;
    const topCls = `${cls}-top`;
    const navsCls = `${cls}-navs`;
    const navCls = `${cls}-nav`;

    return (
      <div className={cls}>
        <div
          className={topCls}
          onClick={() => {
            history.push('/');
          }}
        >
          Document
        </div>
        <div className={navsCls}>
          {components.map((component, i) => {
            const { name } = component;
            const pathname = history.location.pathname;
            return (
              <div
                className={classnames(navCls, {
                  [`${navCls}-active`]: pathname.substring(1) === name,
                })}
                key={navCls + '-' + i}
                onClick={() => {
                  history.push(name);
                }}
              >
                <div className={`${navCls}-title`}>{name}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMain = () => {
    const cls = `${baseCls}-main`;

    return (
      <div className={cls}>
        <Router>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            {components.map((component) => (
              <Route
                key={component.name}
                path={'/' + component.name}
                exact={true}
                render={() => (
                  <React.Suspense
                    fallback={
                      <div className={`${baseCls}-loading`}>Loading</div>
                    }
                  >
                    {React.createElement(component.entry)}
                  </React.Suspense>
                )}
              />
            ))}
          </Switch>
        </Router>
      </div>
    );
  };

  return (
    <div className={baseCls}>
      {renderAside()}
      {renderMain()}
    </div>
  );
};

export default withRouter(App);
