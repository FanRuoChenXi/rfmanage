//Page Object
Page({
  data: {
    tabValue: '0',
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
