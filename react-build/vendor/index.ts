import React from 'react';
import ReactDOM from 'react-dom';
import * as redux from 'redux';
import * as reactRedux from 'react-redux';
import * as reactRouterDom from 'react-router-dom';
import * as reduxThunk from 'redux-thunk';
import * as reduxActions from 'redux-actions';
import 'antd/dist/antd.css';

const vendor = {
  react: React,
  reactDom: ReactDOM,
  redux,
  reactRedux,
  reactRouterDom,
  reduxThunk,
  reduxActions
};

window.vendor = vendor;

export default vendor;