//Page Object
Page({
  data: {
    tabValue: '0',
    user: wx.getStorageSync('user'),
    itemIcon: {
      asset: 'barcode',
      license: 'system-storage',
      consumable: 'highlight-1',
      accessory: 'keyboard',
      component: 'component-dropdown',
      user: 'user-1',
    },
    actionType: {
      checkout: '收款',
      checkinfrom: '签到',
      update: '更新',
      create: '创建',
      delete: '删除',
      audit: '审计',
      uploaded: '上传',
      accepted: '接受',
      declined: '拒绝',
      requested: '请求',
    },
  },
  async onLoad() {
    const list = await getActionList()
    this.setData({ actionList: list })
  },

  // 选项卡更新
  onTabChange(e) {
    this.setData({
      tabValue: e.detail.value,
    })
  },
})

// 获取活动列表
async function getActionList() {
  const param = {
    limit: 5,
    offset: 0,
    sort: 'created_at',
    order: 'desc',
  }
  const [res, err] = await wx.$get('reports/activity', param) // 获取房单客人列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const list = []
  rows.forEach((e) => {
    list.push({
      actionDate: e['actionDate'],
      admin: e['admin'],
      actionType: e['actionType'],
      item: e['item'],
      target: e['target'],
    })
  })
  return list
}
