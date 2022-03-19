import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import * as Actions from '../action';

class Container extends React.Component<any, any> {
  handleClick() {
    const { fetchUserInfo, fetchList } = this.props.actions;
    fetchUserInfo();
    fetchList();
  }

  render() {
    const { userInfo } = this.props;
    return (
      <>
        <Button type="primary" onClick={() => this.handleClick()}>Button</Button>
        {userInfo.name}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return Object.assign({ dispatch }, { actions: bindActionCreators(Actions, dispatch) });
}

export default connect((state) => state, mapDispatchToProps)(Container);