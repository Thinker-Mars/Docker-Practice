import React from 'react';
import ReactDOM from 'react-dom';

class Account extends React.Component {
  render() {
    return <span>Account Module</span>
  }
}

ReactDOM.render(<Account />, document.getElementById('account-root'));