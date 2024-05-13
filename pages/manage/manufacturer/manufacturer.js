//Page Object
Page({
  data: {},

  async onLoad() {
    wx.$loading('加载中...')
    const manufacturerList = await getManufacturerList()
    this.setData({ manufacturerList })
    wx.$loading(false)
  },
})

// 获取制造商列表
async function getManufacturerList() {
  const list = []
  const [res, err] = await wx.$get('manufacturers') // 获取用户列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  rows.forEach((e) => {
    list.push({
      id: e['id'],
      name: e['name'],
      image: e['image'],
      url: e['url'],
      supportUrl: e['supportUrl'],
      supportPhone: e['supportPhone'],
      supportEmail: e['supportEmail'],
      assetsCount: e['assetsCount'],
      licensesCount: e['licensesCount'],
      accessoriesCount: e['accessoriesCount'],
      consumablesCount: e['consumablesCount'],
      availableActions: e['availableActions'],
    })
  })
  return list
}
