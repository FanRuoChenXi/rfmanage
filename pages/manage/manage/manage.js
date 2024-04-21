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
})
