import React from 'react';
import ReactDOM from 'react-dom';

class User extends React.Component {
  render() {
    return <span>User Module</span>
  }
}

ReactDOM.render(<User />, document.getElementById('user-root'));