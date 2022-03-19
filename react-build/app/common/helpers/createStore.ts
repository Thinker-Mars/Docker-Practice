import { createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import * as logger from "redux-logger";
import { isDev } from '../utils';

export default function createStore(rootReducer: any) {
  if (isDev()) {
    return createReduxStore(rootReducer, applyMiddleware(thunk, logger.createLogger({ collapsed: true })));
  }
  return createReduxStore(rootReducer, applyMiddleware(thunk));
}