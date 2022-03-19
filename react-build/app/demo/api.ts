import { request } from 'common/helpers';
/**
 * 请求api的方法统一定义在这里
*/

export const fetchListApi = () => {
  const list = [
    {
      order: 1,
      type: 1,
      name: '测试1'
    },
    {
      order: 2,
      type: 2,
      name: '测试2'
    }
  ];
  return Promise.resolve(list);
}
