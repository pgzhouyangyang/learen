// 引入axios
import axios from "axios"
// axios.defaults.withCredentials = true;
// let baseUrl = "http://101.26.83.6:8186";
let baseUrl = "https://www.imqw.com.cn/imdlr";
import store from '../store'
// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.session_key) {  // 判断是否存在session_key，如果存在的话，则每个http header都加上session_key
			// config.headers['Cookie'] = "JSESSIONID=" + store.state.session_key;

        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
const request = (url = "", data = {}, type = "GET") => {
	type = type.toUpperCase();
	url = baseUrl + url ;
    data = Object.assign(data,{token:store.state.token})
	if(type == "GET") {
		if (Object.keys(data).length) {
			let dataStr = ''; //数据拼接字符串
			Object.keys(data).forEach(key => {
				dataStr += key + '=' + data[key] + '&';
			})

			if (dataStr !== '') {
				dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
				url = url + '?' + dataStr;
			}
		};
	}

	let requestConfig = {

    };
    if (type == 'POST') {
		let params = new FormData();
		Object.keys(data).forEach(key => {
			params.append(key,data[key])
		});
    	Object.assign(requestConfig,{data:params})
    }

    return new Promise((resolve, reject) => {
        axios(Object.assign({url:url,method:type},requestConfig)).
        then((res)=> {
            resolve(res)
        }).
        catch((err)=> {
            reject(err)
        })

    })
}
// 获取所有试题编号及题型
export const getQuestionType = (data)=> request("/wechat/question/getQuestionType",data,"POST");

// 获取首次加载试题
export const getTopQuestion = (data)=> request("/wechat/question/getTopQuestion",data,"POST");

// 获取翻页试题
export const getQuestion = (data)=> request("/wechat/question/getQuestion",data,"POST");

// 随机练习
export const getRandom = (data)=> request("/wechat/question/getRandom",data,"POST");
// 收藏试题
export const favorite = (data)=> request("/wechat/question/favorite",data,"POST");
// 取消收藏
export const delFavorite = (data)=> request("/wechat/question/delFavorite",data,"POST");
// 添加错题
export const addErrorTest = (data)=> request("/wechat/question/error",data,"POST");

// 获取收藏试题
export const getTopFavorite = (data)=> request("/wechat/question/getTopFavorite",data,"POST");

export const getFavoriteType = (data)=> request("/wechat/question/getFavoriteType",data,"POST");

export const getFavorite = (data)=> request("/wechat/question/getFavorite",data,"POST");

// 获取错误试题
export const getTopError = (data)=> request("/wechat/question/getTopError",data,"POST");

export const getErrorType = (data)=> request("/wechat/question/getErrorType",data,"POST");

export const getError = (data)=> request("/wechat/question/getError",data,"POST");

// 记录学习位置
export const saveLearnLocation = (data)=> request("/wechat/question/saveLearnHistory",data,"POST");
// 记录答题记录
export const saveAnswerHistory = (data)=> request("/wechat/question/saveAnswerHistory",data,"POST");

// 获取学习记录点
export const getLearnLocation = data => request("/question/getLearnHistory", data, "POST");
