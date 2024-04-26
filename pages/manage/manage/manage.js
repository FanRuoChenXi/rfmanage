//Page Object
Page({
  data: {
    user: wx.getStorageSync('user'),
  },

  // 资产查询
  toAssetSearch() {
    wx.$push('/pages/manage/search')
  },

  // 新增项目
  toItemUpload() {
    wx.$push('/pages/manage/item-upload')
  },

  // 资产审计
  toAssetAudit() {
    wx.$push('/pages/manage/asset-audit')
  },

  // 数据趋势
  toDataTrend() {},

  // 类别管理
  toCategory() {
    wx.$push('/pages/manage/category')
  },

  // 用户管理
  toUser() {
    wx.$push('/pages/manage/user')
  },

  // 制造商管理
  toManufacturer() {
    wx.$push('/pages/manage/manufacturer')
  },

  // 制造商管理
  toSupplier() {
    wx.$push('/pages/manage/supplier')
  },
})
