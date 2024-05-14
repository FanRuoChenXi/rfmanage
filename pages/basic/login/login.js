//Page Object
Page({
  data: {
    account: '', // 账号
    password: '', // 密码
    buttonLoading: false, // 按钮加载
    buttonText: '登录',
  },

  async onload() {},

  // 登录
  async onSubmitPassword() {
    const { account, password, buttonLoading, buttonText } = this.data
    // const user = {
    //   name: account,
    // }
    if (account == 'admin' && password == 'password') {
      this.setData({
        buttonLoading: true,
        buttonText: '登录中',
      })
      const user = await getUserDetail()
      wx.setStorageSync('user', user)
      wx.$replace('/pages/basic/dashboard')
    } else {
      wx.$msg('用户名或密码错误')
    }
  },
})

// 获取个人信息
async function getUserDetail() {
  const [res, err] = await wx.$get('users/1')
  if (err) return wx.$msg(err)
  return res
}
