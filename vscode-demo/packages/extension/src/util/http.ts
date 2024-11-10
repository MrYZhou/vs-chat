// import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
// import * as vscode from 'vscode';
// // 数据返回的接口
// // 定义请求响应参数，不含data
// interface Result {
//     code: number;
//     msg: string
// }

// // 请求响应参数，包含data
// interface ResultData<T = any> extends Result {
//     data?: T;
// }
// const URL: string = 'http://127.0.0.1:8083'
// enum RequestEnums {
//     TIMEOUT = 20000,
//     OVERDUE = 600, // 登录失效
//     FAIL = 999, // 请求失败
//     SUCCESS = 200, // 请求成功
// }

// class RequestHttp {
//     // 定义成员变量并指定类型
//     static service: AxiosInstance;
//     config = {
//         // 默认地址
//         baseURL: URL as string,
//         // 设置超时时间
//         timeout: RequestEnums.TIMEOUT as number,
//         // 跨域时候允许携带凭证
//         withCredentials: true
//     }
//     static RequestHttp: RequestHttp;

//     public static getInstance(): AxiosInstance {
//         if (!RequestHttp.service) {
//             new RequestHttp();
//         }
//         return RequestHttp.service;
//     }
//     public constructor() {

//         // 实例化axios
//         RequestHttp.service = axios.create(this.config);

//         /**
//          * 请求拦截器
//          * 客户端发送请求 -> [请求拦截器] -> 服务器
//          * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
//          */
//         RequestHttp.service.interceptors.request.use(
//             (config: any) => {
//                 const token = localStorage.getItem('token') || '';
//                 return {
//                     ...config,
//                     headers: {
//                         'x-access-token': token, // 请求头中携带token信息
//                     }
//                 }
//             },
//             (error: AxiosError) => {
//                 // 请求报错
//                 Promise.reject(error)
//             }
//         )

//         /**
//          * 响应拦截器
//          * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
//          */
//         RequestHttp.service.interceptors.response.use(
//             (response: AxiosResponse) => {
//                 const { data, config } = response; // 解构
//                 if (data.code === RequestEnums.OVERDUE) {
//                     // 登录信息失效，应跳转到登录页面，并清空本地的token
//                     localStorage.setItem('token', '');
//                     // router.replace({
//                     //   path: '/login'
//                     // })
//                     return Promise.reject(data);
//                 }
//                 // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
//                 if (data.code && data.code !== RequestEnums.SUCCESS) {
//                     //提示报错信息
//                     vscode.window.showInformationMessage(data.msg);
//                     return Promise.reject(data)
//                 }
//                 return data;
//             },
//             (error: AxiosError) => {
//                 const { response } = error;
//                 if (response) {
//                     this.handleCode(response.status)
//                 }
//             }
//         )
//     }
//     handleCode(code: number): void {
//         switch (code) {
//             case 401:
//                 break;
//             default:
//                 break;
//         }
//     }

//     // 常用方法封装
//     get<T>(url: string, params?: object): Promise<ResultData<T>> {
//         return RequestHttp.service.get(url, { params });
//     }
//     post<T>(url: string, params?: object): Promise<ResultData<T>> {
//         return RequestHttp.service.post(url, params);
//     }
//     put<T>(url: string, params?: object): Promise<ResultData<T>> {
//         return RequestHttp.service.put(url, params);
//     }
//     delete<T>(url: string, params?: object): Promise<ResultData<T>> {
//         return RequestHttp.service.delete(url, { params });
//     }
// }
// ;
// // 导出一个实例对象
// export default RequestHttp
