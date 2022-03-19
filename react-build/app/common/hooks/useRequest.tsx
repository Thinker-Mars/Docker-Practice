import { useState, useEffect } from 'react';

/**
 * 接口请求hook方式
 * @param api 请求的方法
 * @returns 
 */
export default function useRequest<T, U>(api: (T: any) => Promise<U>) {
  const [queryParam, setQueryParam] = useState<T | any>(null);
  const [data, setData] = useState<any>(null);

  const handleRequest = async (unmounted: boolean) => {
    // 初始参数为null 不请求
    if (queryParam === null) {
      return;
    }
    const res: any = await api(queryParam);
    if (!unmounted) {
      const { Data } = res;
      setData(Data);
    }
  };

  // 请求参数改变就发送请求
  useEffect(() => {
    let unmounted = false;
    handleRequest(unmounted);
    return () => {
      unmounted = true;
    };
  }, [queryParam]);

  const doRequest = (param?: T) => {
    setQueryParam(param);
  };

  return {
    doRequest,
    data
  };
}