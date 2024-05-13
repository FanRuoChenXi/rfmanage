//Page Object
Page({
  data: {},

  async onLoad() {
    wx.$loading('加载中...')
    const modelList = await getModelList() // 获取模型列表
    this.setData({ modelList }) // 若无数据返回, 则标记加载到底
    wx.$loading(false)
  },
})

// 获取模型列表
async function getModelList() {
  const param = {
    limit: 50,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('models', param)
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const list = []
  rows.forEach((e) => {
    list.push({
      id: e['id'],
      name: e['name'],
      image: e['image'],
      modelNumber: e['modelNumber'],
      assetsCount: e['assetsCount'],
      category: e['category'],
      eol: e['eol'],
    })
  })
  return list
}
