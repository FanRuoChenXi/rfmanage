/**
 * 全局变量
 */
const appData = {}

/**
 * 消息弹框
 * @param {string} message 消息内容
 * @param {string} [type] 图标。可选: success/fail/none
 */
function msg(message, type = 'none', mask = false) {
  wx.showToast({ title: message, icon: type, mask, duration: 1500 })
  return message
}

/**
 * @param {string} params 消息内容
 */
function modal(params) {
  if (!params) return false
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: params.title || '提示',
      content: params.content || '',
      showCancel: params.showCancel,
      cancelText: params.cancel || '取消',
      cancelColor: '#6e6f70',
      confirmText: params.confirm || '确定',
      // confirmColor: '#ee0a24',
      confirmColor: '#075785',
      success: (result) => {
        if (result.confirm) {
          resolve()
        } else {
          reject()
        }
      },
    })
  })
}

/**
 * 加载中弹框
 * @param {string} title 弹框内容
 * @param {string} [mask] 遮罩层
 */
function loading(title, mask = true) {
  if (!title) return wx.hideLoading()
  wx.showLoading({ title, mask })
  return title
}

/**
 * 路由推入/置换/重置跳转
 * @param {string} url 路由地址。注意：只需写到底层目录名，默认文件名与目录名一致
 * @param {object} [params] 路由传参。
 */
function push(url, params = {}) {
  console.log(appendUrl(url, params))
  if (url === 'back') wx.navigateBack({ delta: params.delta || 1 })
  else wx.navigateTo({ url: appendUrl(url, params) })
}
function replace(url, params = {}) {
  wx.redirectTo({ url: appendUrl(url, params) })
}
function relaunch(url, params = {}) {
  wx.reLaunch({ url: appendUrl(url, params) })
}

// 枚举params参数，添加在url后。若为参数内是对象，则会被转码。
function appendUrl(url, params) {
  const index = url.lastIndexOf('/') + 1 // 我们默认页面文件名与目录名一致,
  if (index !== -1) url += '/' + url.substring(index) // 因此将文件名加在url最后
  if (typeof params != 'object' || JSON.stringify(params) == '{}') return url
  url += '?'
  for (let i in params) {
    const param =
      typeof params[i] == 'object' // 判断这个参数是不是对象
        ? encodeURIComponent(JSON.stringify(params[i])) // 如果是对象则需转码
        : params[i] // 如果不是对象，则直接存进去
    url += `${i}=${param}&`
  }
  return url
}

function update() {
  if (wx.canIUse('getUpdateManager')) {
    const update = wx.getUpdateManager()
    update.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        update.onUpdateReady(() => {
          update.applyUpdate()
        })
        update.onUpdateFailed(() => {
          msg('新版本小程序下载失败，暂时无法启用新版本。')
        })
      }
    })
  }
}

import requestInstall from './request'
const install = () => {
  update() // 检查更新
  requestInstall() // 注入 request.js
  wx.$appData = appData
  wx.$msg = msg
  wx.$modal = modal
  wx.$loading = loading
  wx.$push = push
  wx.$replace = replace
  wx.$relaunch = relaunch
}

module.exports = {
  install,
}
