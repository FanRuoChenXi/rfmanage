//Page Object
Page({
  data: {},

  async onLoad() {
    wx.$loading('加载中...')
    const supplierList = await getSupplierList()
    this.setData({ supplierList })
    wx.$loading(false)
  },
})

// 获取供应商列表
async function getSupplierList() {
  const list = []
  const [res, err] = await wx.$get('suppliers') // 获取用户列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  rows.forEach((e) => {
    list.push({
      id: e['id'],
      name: e['name'],
      address: e['address'],
      contact: e['contact'],
      email: e['email'],
      phone: ['phone'],
      assetsCount: e['assetsCount'],
      licensesCount: e['licensesCount'],
      accessoriesCount: e['accessoriesCount'],
      consumablesCount: e['consumablesCount'],
      componentsCount: e['componentsCount'],
    })
  })
  return list
}
