//Page Object
Page({
  data: {
    user: wx.getStorageSync('user'),
  },

  // 切换账号
  onSwitchAccount(e) {
    // console.log(e)
    wx.$modal({
      title: '切换账号',
      showCancel: true,
      content: '确定要切换账号吗?',
    }).then(() => {
      // wx.setStorageSync(wx.$env + 'code', '') // 清除用户名和密码缓存
      // wx.setStorageSync(wx.$env + 'password', '')
      wx.$relaunch('/pages/basic/login') // 跳转登录页
    })
  },

  // 用户详情页
  toUserDetail() {
    wx.$push('/pages/user/user-detail')
  },

  // 部门组织
  toDepartment() {
    wx.$push('/pages/user/departments')
  },
})
