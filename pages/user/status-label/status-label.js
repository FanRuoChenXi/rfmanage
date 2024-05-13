//Page Object
Page({
  data: {},

  async onLoad() {
    wx.$loading('加载中...')
    const statusLabelList = await getStatusLabelList()
    this.setData({ statusLabelList })
    wx.$loading(false)
  },
})

// 获取状态标签列表
async function getStatusLabelList() {
  const param = {
    limit: 50,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('statuslabels', param)
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const list = []
  rows.forEach((e) => {
    list.push({
      id: e['id'],
      name: e['name'],
      type: e['type'],
      assetsCount: e['assetsCount'],
      availableActions: e['availableActions'],
      defaultLabel: e['defaultLabel'],
    })
  })
  return list
}
