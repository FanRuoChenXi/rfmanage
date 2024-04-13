const baseUrl = 'https://develop.snipeitapp.com/api/v1/'

/**
 * request 请求
 * @param {String} api 请求的api接口
 * @param {Object} [params] 请求参数[可选]
 * @param {String} method 请求方法
 * @param {String} header 请求头, 上传文件时会使用
 * @return {Function} 请求成功后继续处理数据
 */
const get = (api, params) => request('GET', api, params)
const post = (api, params) => request('POST', api, params)

async function request(method = 'GET', api, params = {}) {
  let url = baseUrl + api // 拼接接口地址
  params = _requestFit(params) // 驼峰转下划线
  return new Promise((resolve, reject) => {
    const start = +new Date()
    wx.request({
      url: method == 'GET' ? url + _getUrlParams(params) : url, // GET 时构造 URL 参数
      data: method == 'GET' ? null : params, // GET 时不使用 data
      method,
      header: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTU2MDc0MjVmYjM5YTEwYjFjNTZlZTAxMTBmZDk4ZjQ0ZjVjODMzYjcxZWVhYjZlNDk1NGMwOThlY2YzMzU2MDY4Mzg4MmFhMDMzOTAzNzciLCJpYXQiOjE2MzI4NjU5MTgsIm5iZiI6MTYzMjg2NTkxOCwiZXhwIjoyMjY0MDIxNTE4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.LgGVzyH67IRhXvccHd4j2Dn6TDuIuQTBoo30_wD9jPehy8v_h0xBmE1-dOUBRJyeJOI8B4gwPeALsWaudpGj9Lb5qWAtKV7eYtH9IYQKoLF_iHgOGXnAUcNwID6zBU_YyLNSI6gp8zjutLJias33CBLsHy5ZRNpxVibVrZouJ_HjYuIYbtZyLus-KFFeibtZoPiTWOeHhQFD37MR6ifx4dBqT37fN-xDS99mONtrkAplEIou5aSO1oZ4IlJIPCUyA1lixPgpn1YU7PxiBDZp1teeugD0WEmrAqxRS2I0bH4qPsuTsrVXS_lo87Sf5LBGLW7lGHKqyYH6J47OZOM0K-SrxLKtE1ww8jyLBgnnxH0lJHRLCBiwUnL5ZGTUmiOysUA-wSJ6s78o8Pc-ec6bpBvAlelHdiQ-wslE7gzEJDptbejFg-75b_CEwgJYh7J2D18ul6Qu5EFCUEgt033mm04dgVk0isWTDt6EW5ZvTo5Qhr1LY0YnEIXCTqIRN-BSQjL55sZaCrtwR_21bnBGgniyI5MRDYblFawVmFKroeClCpSjBo9vi66akdD5hjpvx67RL3r33BZQhEXmPifUPNH5wP_U-IHGFUD99TJk2c1awF0RASveZRLSunbJb1x6hGAVUaIvQV4r2quWzXqYyKLph9kGTyJYrb6iJtH5smE',
        Accept: 'application/json',
      },
      success: (response) => {
        resolve(_onSuccess(api, params, response)) // 请求成功回调
      },
      fail: (error) => {
        reject(_onFail(api, params, error))
      },
    })
  })
}

/**
 * 请求成功回调
 * @param {String} api 请求的api接口
 * @param {Object} params 请求参数
 * @param {Promise} response 请求返回
 * @return {Array} 返回[res, err]其中报错时才有err参数
 */
function _onSuccess(api, params, response) {
  const data = _responseFit(response.data) // 对返回数据适配
  // const token = response?.header?.['Set-Cookie'] // 转存服务端 cookie
  // if (token) wx.setStorageSync('token', Array.isArray(token) ? token[0] : token) // iOS在调上传接口时 JSON.parse 会把 token 解析成数组
  if (response.statusCode == 200) {
    showLog(api, params, data) // 开发环境下控制台打印数据
    return [data, null] // 构造 [res, err] 格式的返回
  } else {
    showLog(api, params, data, 'warn') // 展示程序运行日志
    return [null, response.errMsg || '接口调用失败']
  }
}

/**
 * 请求失败回调
 * @param {String} api 请求的api接口
 * @param {Object} params 请求参数
 * @param {Promise} error 请求返回
 * @return {Array} 返回[res, err]其中报错时才有err参数
 */
function _onFail(api, params, error) {
  showLog(api, params, error, 'error') // 开发环境下控制台打印数据
  return [null, error] // 返回异常信息
}

// 将参数对象转换为 URL 形式, 适配 GET 请求
function _getUrlParams(params) {
  let urlParams = '?'
  for (let key in params) {
    if (params[key] instanceof Array) {
      for (let item of params[key])
        urlParams += `${key}[]=${encodeURIComponent(item)}&`
    } else {
      urlParams += `${key}=${encodeURIComponent(params[key])}&`
    }
  }
  return urlParams.substring(0, urlParams.length - 1) // 删除最后一位'&'
}

// 数据发送适配: 驼峰转下划线
function _requestFit(data) {
  if (typeof data !== 'object' || !data) return data
  if (Array.isArray(data)) return data.map((e) => _requestFit(e))
  const newData = {}
  for (const key in data) {
    const newKey = key.replace(/([A-Z])/g, (p, m) => `_${m.toLowerCase()}`) // 驼峰转下划线
    newData[newKey] = _requestFit(data[key])
  }
  return newData
}

// 数据返回适配: 下划线转驼峰 & 时间格式替换
function _responseFit(data) {
  if (typeof data !== 'object' || !data) return data
  if (Array.isArray(data)) return data.map((e) => _responseFit(e))
  const newData = {}
  for (const key in data) {
    if (key.includes('time') && typeof data[key] == 'string') {
      data[key] = data[key].replace(/-/g, '/') // 将时间中的'-'替换为'/'以适配iOS
    }
    const newKey = key.replace(/_([a-z])/g, (p, m) => m.toUpperCase())
    newData[newKey] = _responseFit(data[key])
  }
  return newData
}

// 打印日志
function showLog(api, params, response, type = 'info') {
  if (!['info', 'warn', 'error'].includes(type)) type = 'info'
  // 本地打印
  console.group(api, params)
  console[type](response)
  console.groupEnd()
}

const install = () => {
  wx.$get = get // GET方法
  wx.$post = post // POST方法
}

export default install
