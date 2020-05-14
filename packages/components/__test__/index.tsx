import React from 'react';
import ReactDOM from 'react-dom';

import { InputSelect } from '../index';

const SelectorMain = (props: InputSelect.ISelectorProps<string>) => {
  const { onOk, wrappedComponentRef } = props;

  React.useEffect(() => {
    wrappedComponentRef({
      current: {
        handleOk: () => Promise.resolve(['Hello World!']),
      },
    });
  }, [wrappedComponentRef]);

  return (
    <div
      onClick={() => {
        onOk(['Hello World!']);
      }}
    >
      Hello World!
    </div>
  );
};

const Selector = InputSelect.buildInputSelect<string>({
  selector: {
    title: '测试一下',
    type: InputSelect.ESelectorType.dropdown,
    builder: (props) => () => <SelectorMain {...props} />,
  },
  valueType: InputSelect.EValueType.string,
});

const Test: React.FunctionComponent = () => {
  React.useEffect(() => {}, []);

  return (
    <div style={{ padding: '8px' }}>
      <Selector
        // defaultValue={['1', '2', '3', '4']}
        multi={true}
        htmlType={InputSelect.EHTMLType.textarea}
        onChange={(v) => {
          console.log(v);
        }}
      />
    </div>
  );
};

ReactDOM.render(<Test />, document.getElementById('app'));
