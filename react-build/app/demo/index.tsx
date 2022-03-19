import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'common/helpers';
import rootReducer from './reducer';
import Container from './container';

const store = createStore(rootReducer);

class Demo extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('root'));

if (module?.hot) {
  module.hot.accept();
}