//Page Object
Page({
  data: {},

  async onLoad() {
    wx.$loading('加载中...')
    const locationList = await getLocationList()
    this.setData({ locationList })
    wx.$loading(false)
  },
})

// 获取地点列表
async function getLocationList() {
  const param = {
    limit: 50,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('locations', param)
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const list = []
  rows.forEach((e) => {
    list.push({
      id: e['id'],
      name: e['name'],
      parent: e['parent'],
    })
  })
  return list
}
