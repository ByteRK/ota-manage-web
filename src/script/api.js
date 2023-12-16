import axios from 'axios';
const baseUrl = 'http://localhost:3007';

const _api = axios.create({ baseURL: baseUrl, timeout: 10000 });

// 配置axios请求拦截器
_api.interceptors.request.use(config => {
    // console.log(window.sessionStorage.getItem('token'))
    console.log(config)
    config.headers.token = window.sessionStorage.getItem('token')
    // console.log(config)
    return config
}, error => {
    //对请求错误做点什么
    console.log(error)
    return { res: 110, res_h: '请求错误' }
})

export default _api