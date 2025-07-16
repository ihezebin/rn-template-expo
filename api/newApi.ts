import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

import { API_DEFAULT_CONFIG } from "./config";

interface Response<T> {
  status?: number;
  code: number | string;
  message: string;
  data?: any;
  response?: AxiosResponse<T>;
}

interface IApi {
  request<T = any, R = Response<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R>;

  // Head 没有请求体。 Head 请求的目的是获取服务器响应的头部信息，而不获取实际的响应体。
  head<T = any, R = Response<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  // Options 请求的主要目的是询问服务器在实际请求中可以使用哪些方法（例如 GET、POST）和头部（例如 Content-Type），以确保跨域请求的安全性。在这个过程中，客户端不需要向服务器发送具体的请求体数据。
  options<T = any, R = Response<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  get<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  delete<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  post<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  put<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  patch<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  postForm<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  putForm<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  patchForm<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}

interface Config extends CreateAxiosDefaults {
  onRequest?: (
    request: InternalAxiosRequestConfig
  ) => Promise<InternalAxiosRequestConfig>;

  onResponse?: (response: Response<any>) => Response<any>;

  /**
   * onError
   * @param 同 onResponse, 但非 2xx 状态码的响应会走该函数。
   */
  onError?: (response: Response<any>) => any;

  /**
   * onAbnormal 异常处理，如果请求未能成功发送或接收（例如网络断开、超时等）触发该函数
   * @param code 错误码
   * @param message 错误信息
   * @param err 错误对象
   */
  onAbnormal?: (err: any, code: string, message: string) => any;

  withToken?: () => string;
}

export class Api implements IApi {
  private kernel: AxiosInstance;

  constructor(public config: Config) {
    const {
      onRequest,
      onResponse,
      onError,
      onAbnormal,
      withToken,
      ...omitConfig
    } = config;

    this.kernel = axios.create({
      ...API_DEFAULT_CONFIG,
      ...omitConfig,
    });

    const onRequestFulfilled = (request: InternalAxiosRequestConfig) => {
      // 填充 token
      const token = withToken && withToken();
      if (token) {
        request.headers.Token = token;
      }
      return onRequest ? onRequest(request) : request;
    };

    const onRequestRejected = (err: any) => {
      return Promise.reject(
        onAbnormal ? onAbnormal(err, err?.code, err?.message) : err
      );
    };

    this.kernel.interceptors.request.use(onRequestFulfilled, onRequestRejected);

    const onResponseFulfilled = async (response: AxiosResponse) => {
      const { status, data } = response;

      const resp = {
        response: response,
        status: status,
        ...data,
      };

      return onResponse ? await onResponse(resp) : resp;
    };

    const onResponseRejected = (err: any) => {
      if (err.response) {
        const { status, data } = err.response;

        const resp = {
          response: err.response,
          status: status,
          ...data,
        };
        return onError ? onError(resp) : resp;
      } else {
        return Promise.reject(
          onAbnormal ? onAbnormal(err, err?.code, err?.message) : err
        );
      }
    };

    this.kernel.interceptors.response.use(
      onResponseFulfilled,
      onResponseRejected
    );
  }

  request<T = any, R = Response<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.kernel.request(config);
  }

  head<T = any, R = Response<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.head(url, config);
  }

  options<T = any, R = Response<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.options(url, config);
  }

  get<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.get(url, {
      params: data,
      ...config,
    });
  }

  delete<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.delete(url, {
      params: data,
      ...config,
    });
  }

  post<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.post(url, data, config);
  }

  put<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.put(url, data, config);
  }

  patch<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.patch(url, data, config);
  }

  postForm<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.postForm(url, data, config);
  }

  putForm<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.putForm(url, data, config);
  }

  patchForm<T = any, R = Response<T>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
  ): Promise<R> {
    return this.kernel.patchForm(url, data, config);
  }
}

export const newApi = (config?: Config | string) => {
  let cfg: Config = {};
  if (typeof config === "string") {
    cfg.baseURL = config;
  } else {
    cfg = config || {};
  }
  const api = new Api({
    ...cfg,
  });

  return api;
};
