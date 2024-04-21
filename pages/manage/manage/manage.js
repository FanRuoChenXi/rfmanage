//Page Object
Page({
  data: {
    user: wx.getStorageSync('user'),
  },

  toItemUpload() {
    wx.$push('/pages/manage/item-upload')
  },
})
