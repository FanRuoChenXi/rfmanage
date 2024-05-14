//Page Object
Page({
  data: {
    userDetail: wx.getStorageSync('user'),
  },

  async onLoad() {
    // wx.$loading('加载中...')
    // const userDetail = await getUserDetail()
    // this.setData({ userDetail })
    // wx.$loading(false)
  },
})

// 获取个人信息
// async function getUserDetail() {
//   const [res, err] = await wx.$get('users/1')
//   if (err) return wx.$msg(err)
//   return res
// }
