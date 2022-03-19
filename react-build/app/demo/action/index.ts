import ActionType from '../constants';
import * as Api from '../api';

export const fetchUserInfo = () => (dispatch: any) => {
  dispatch({
    type: ActionType.FetchUserInfo,
    payload: {
      name: 'Cone'
    }
  });
}

export const fetchList = () => async (dispatch: any) => {
  const res = await Api.fetchListApi();
  dispatch({
    type: ActionType.FetchList,
    payload: res
  });
}