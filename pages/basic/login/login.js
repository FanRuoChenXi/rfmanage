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
    let { account, password, buttonLoading, buttonText } = this.data
    if (account == 'admin' && password == 'password') {
      this.setData({
        buttonLoading: true,
        buttonText: '登录中',
      })
      wx.$replace('/pages/basic/dashboard')
    } else {
      wx.$msg('用户名或密码错误')
    }
  },
})
