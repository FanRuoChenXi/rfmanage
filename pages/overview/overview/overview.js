//Page Object
Page({
  data: {
    tabValue: '0',
  },

  async onLoad() {
    const assetList = await getAssetList()
    this.setData({ assetList })
  },

  // 选项卡更新
  async onTabChange(e) {
    const newValue = e.detail.value
    const { tabValue } = this.data
    if (tabValue == newValue) return false
    switch (newValue) {
      case '0':
        if (this.data['assetList']) break
        const assetList = await getAssetList()
        this.setData({ assetList })
        break
      case '1':
        if (this.data['licensesList']) break
        const licensesList = await getActionList()
        this.setData({ licensesList })
        break
    }
    this.setData({
      tabValue: newValue,
    })
  },

  // 前往许可证详情页
  tolicensesDetail(e) {
    const licensesId = e.currentTarget.dataset.id
    wx.$push('/pages/overview/licenses-detail', { licensesId: licensesId })
  },
})

// 获取资产列表
async function getAssetList() {
  const param = {
    limit: 5,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('hardware', param) // 获取房单客人列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const assetList = []
  rows.forEach((e) => {
    assetList.push({
      id: e['id'],
      name: e['name'],
      assetTag: e['assetTag'],
      model: e['model'],
    })
  })
  return assetList
}

// 获取许可证列表
async function getActionList() {
  const param = {
    limit: 5,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('licenses', param) // 获取房单客人列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const licensesList = []
  rows.forEach((e) => {
    licensesList.push({
      id: e['id'],
      name: e['name'],
      manufacturer: e['manufacturer'],
    })
  })
  return licensesList
}
