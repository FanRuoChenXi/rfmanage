//Page Object
Page({
  data: {},

  async onLoad() {
    wx.$loading('加载中...')
    const companyList = await getCompanyList()
    this.setData({ companyList })
    wx.$loading(false)
  },
})

// 获取企业列表
async function getCompanyList() {
  const [res, err] = await wx.$get('companies')
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const list = []
  rows.forEach((e) => {
    list.push({
      id: e['id'],
      name: e['name'],
      usersCount: e['usersCount'],
      assetsCount: e['assets_count'],
      licensesCount: e['licensesCount'],
      accessoriesCount: e['accessoriesCount'],
      consumablesCount: e['consumablesCount'],
      componentsCount: e['componentsCount'],
      availableActions: e['availableActions'],
    })
  })
  return list
}
