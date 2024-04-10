const URL = {
  release: 'https://pms.geemro.com/vip-php/public/index.php/', // 发布版接口地址
  trial: 'https://trial.geemro.com/vip-php/public/index.php/', // 体验版接口地址
  develop: 'https://dev.geemro.com/vip-php/public/index.php/', // 开发版接口地址
  mock: 'http://192.168.2.99:4523/mock/997517/', // 本地 MOCK 接口地址
}
const accountInfo = wx.getAccountInfoSync() // 可判断是开发环境还是生产环境
let appid = accountInfo.miniProgram.appId
let env = accountInfo.miniProgram.envVersion // 保存环境标记
// if (env == 'develop') env = 'release' //! 保存环境标记, 慎用!
if (!env) {
  wx.showToast({
    title: '微信版本过低，请更新微信以体验小程序完整功能',
    icon: 'none',
    duration: 5e3,
  })
}

/**
 * upload 请求
 * @param {String} api 请求的api接口
 * @param {String} fileList 文件列表 // * 示例: [file, file, ...]
 * @param {Object} [data] 表单参数[可选] // * 示例: { key1, key2, ... }
 */
async function upload(api, fileList, params) {
  params = _requestFit(params) // 请求前的数据适配
  const FormData = require('../service/form-data.js') // 引用 wx-formdata 构建表单
  const formData = new FormData()
  const dataKeys = Object.keys(params) // 表单数据键值
  for (let key of dataKeys) formData.append(key, params[key]) // 推入表单参数
  for (let file of fileList) formData.appendFile('file[]', file.url, file.name) // 推入表单文件
  const data = formData.getData()
  return new Promise((resolve, reject) => {
    wx.request({
      url: (params.mock ? URL.mock : URL[env]) + api, // 带 mock 服务标记会自动重定向
      data: data.buffer,
      method: 'POST',
      header: { 'content-type': data.contentType, cookie: wx.getStorageSync('token') },
      success: (response) => {
        params.file = fileList
        resolve(_onSuccess(api, params, response)) // 请求成功回调
      },
      fail: (error) => {
        reject(_onFail(api, data, error))
      },
    })
  })
}

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
  let url = (params.mock ? URL.mock : URL[env]) + api // 带 mock 服务标记会自动重定向
  params = _requestFit(params) // 驼峰转下划线
  return new Promise((resolve, reject) => {
    const start = +new Date()
    wx.request({
      url: method == 'GET' ? url + _getUrlParams(params) : url, // GET 时构造 URL 参数
      data: method == 'GET' ? null : params, // GET 时不使用 data
      method,
      header: { cookie: wx.getStorageSync('token') },
      success: (response) => resolve(_onSuccess(api, params, response)), // 请求成功回调
      fail: (response) => resolve(_onFail(api, params, response)), // 请求失败回调
      complete: (response) => {
        const costTime = +new Date() - start
        require('./monitor').monitorApi(api, params, response, costTime) // 接口监控上报
      },
    })
  })
}

/**
 * 请求成功或失败回调
 * @param {String} api 请求的api接口
 * @param {Object} params 请求参数
 * @param {Promise} response 请求返回
 * @return {Array} 返回[res, err]其中报错时才有err参数
 */
function _onSuccess(api, params, response) {
  const data = _responseFit(response.data) // 对返回数据适配
  const token = response?.header?.['Set-Cookie'] // 转存服务端 cookie
  if (token) wx.setStorageSync('token', Array.isArray(token) ? token[0] : token) // iOS在调上传接口时 JSON.parse 会把 token 解析成数组
  if (data.ok) {
    showLog(api, params, data.data) // 展示程序运行日志
    return [data.data, null] // 构造 [res, err] 格式的返回
  } else {
    showLog(api, params, data, 'warn') // 展示程序运行日志
    return [data?.data, data.msg || '接口调用失败']
  }
}
function _onFail(api, params, response) {
  showLog(api, params, response, 'error') // 展示程序运行日志
  return [null, response] // 返回异常信息
}

// 将参数对象转换为 URL 形式, 适配 GET 请求
function _getUrlParams(params) {
  let urlParams = '?'
  for (let key in params) {
    if (params[key] instanceof Array) {
      for (let item of params[key]) urlParams += `${key}[]=${encodeURIComponent(item)}&`
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

// 打印或上报日志. 注:日志上报有限额
const log = require('./log')
const whichEnvPrint = ['develop', 'trial', 'release'] // 控制台打印日志的运行环境
const whichEnvUpload = ['release'] // 后台上报日志的运行环境
function showLog(api, params, response, type) {
  if (!['info', 'warn', 'error'].includes(type)) type = 'info'
  // 本地打印
  if (whichEnvPrint.includes(env)) {
    console.group(api, params)
    console[type](response)
    console.groupEnd()
  }
  // 日志上报
  if (whichEnvUpload.includes(env)) {
    params = typeof params == 'string' ? params : JSON.stringify(params)
    response = typeof response == 'string' ? response : JSON.stringify(response)
    let res = api + ':' + params + '\n【收】' + response // 接口名 & 发出去的参数 & 收到的参数
    if (type == 'info') {
      res = res.replace(/"http(.*?)"/g, '…').replace(/"/g, '') // 过滤链接以及引号
      res = res.length < 2000 ? res : res.slice(0, 2000) + '…' // 每条长度不得超过 2KB
    }
    log[type](res)
  }
}

module.exports = {
  env, // 主机地址
  appid, // 小程序 APPID
  host: URL[env], // 主机地址
  upload,
  post, // POST方法
  get, // GET方法
}
