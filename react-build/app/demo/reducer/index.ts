import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import ActionType from '../constants';

const UserInfoInitState = {};

const ListInitState = [] as any[];

export default combineReducers({
  /**
   * 用户信息
   */
  userInfo: handleActions(
    {
      [ActionType.FetchUserInfo]: (state: any, action: any) => {
        return action.payload;
      }
    },
    UserInfoInitState
  ),

  list: handleActions(
    {
      [ActionType.FetchList]: (state: any, action: any) => {
        return action.payload;
      }
    },
    ListInitState
  )
});
