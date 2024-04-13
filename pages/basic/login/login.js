//Page Object
Page({
  data: {
    password: '', // 密码
    buttonLoading: false, // 按钮加载
    buttonText: '登录',
  },

  async onload() {},

  // 登录
  async onSubmitPassword() {
    // let { password, buttonLoading, buttonText } = this.data
    // console.log(password)
    // this.setData({
    //   buttonLoading: true,
    //   buttonText: '登录中',
    // })

    const result = await wx.$get('companies')
    console.log(result)
  },
})
