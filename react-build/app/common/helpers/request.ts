import axios from "axios";
import { message } from 'antd';

message.config({
  maxCount: 1
});

type RequestProps = {
  /**
   * 调用接口
   */
  api: string,
  /**
   * 请求方式  默认get
   */
  method?: 'post' | 'get',
  /**
   * 与请求一起发送的 URL 参数
   * 必须是一个无格式对象(plain object)或 URLSearchParams 对象
   */
  params?: any,
  /**
   * 作为请求主体被发送的数据
   */
  data?: any,
  /**
   * 请求特性配置
   */
  options?: {
    /**
     * 请求前是否显示loading 默认true
     */
    showLoading?: boolean,
    /**
     * 请求出错后，是否显示错误信息 默认true
     */
    showError?: boolean
  }
};

type ResponseType = {
  /**
   * 请求状态码
   */
  Code: number;
  /**
   * 请求数据
   */
  Data: any,
  /**
   * 提示信息
   */
  Msg: string
}

/**
 * 请求超时时间
 */
const Timeout = 15 * 1000;

/**
 * 统一请求方法
 */
export default function request(props: RequestProps) {
  return new Promise<ResponseType>((resolve, reject) => {
    const { api, method, params, data, options: originOptions = {} } = props;
    let options = {
      showLoading: true,
      showError: true,
      ...originOptions,
    } as any;
    if (options.showLoading) {
      message.loading('加载中', 0.5);
    }
    const axiosConfig = {
      baseURL: '/api',
      method: method ? method : 'get',
      url: api,
      timeout: Timeout,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }, // 自定义请求头
      params,
      data,
      transformRequest: [
        function(data: any) {
          if (method === 'post') {
            return toFormData(data);
          }
          return data;
        }
      ],
      withCredentials: true, // 跨域请求时需要使用凭证
    };
    axios(axiosConfig).then(
      (res: any) => {
        resolve(res.data);
      },
      (error: any) => {
        if (options.showError) {
          message.error('内容无法加载，请稍后重试', 0.5);
        }
        reject(error);
      }
    ).catch((err: Error) => {
      if (options.showError) {
        message.error('内容无法加载，请稍后重试', 0.5);
      }
      reject(err);
    })
  });
}

const toFormData = (postData: any) => {
  const formData = [] as any[];
  Object.keys(postData).forEach((key) => {
    formData.push(`${key}=${postData[key]}`);
  });
  return formData.join('&');
}