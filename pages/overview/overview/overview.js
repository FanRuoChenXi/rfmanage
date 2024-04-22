//Page Object
Page({
  data: {
    tabValue: '0',
  },

  async onLoad() {
    wx.$loading('加载中...')
    const assetList = await getAssetList()
    this.setData({ assetList })
    wx.$loading(false)
  },

  // 选项卡更新
  async onTabChange(e) {
    const newValue = e.detail.value
    const { tabValue } = this.data
    if (tabValue == newValue) return false
    wx.$loading('加载中...')
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
      case '2':
        if (this.data['accessoryList']) break
        const accessoryList = await getAccessoryList()
        this.setData({ accessoryList })
        break
      case '3':
        if (this.data['consumableList']) break
        const consumableList = await getConsumableList()
        this.setData({ consumableList })
        break
      case '4':
        if (this.data['componentList']) break
        const componentList = await getComponentList()
        this.setData({ componentList })
        break
    }
    this.setData({
      tabValue: newValue,
    })
    wx.$loading(false)
  },

  // 前往项目详情页
  toItemDetail(e) {
    const { key, id } = e.currentTarget.dataset
    // console.log(key, id)
    wx.$push('/pages/overview/item-detail', { key, id })
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

// 获取配件列表
async function getAccessoryList() {
  const param = {
    limit: 5,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('accessories', param) // 获取房单客人列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const accessoryList = []
  rows.forEach((e) => {
    accessoryList.push({
      id: e['id'],
      name: e['name'],
      manufacturer: e['manufacturer'],
    })
  })
  return accessoryList
}

// 获取消耗品列表
async function getConsumableList() {
  const param = {
    limit: 5,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('consumables', param) // 获取房单客人列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const consumableList = []
  rows.forEach((e) => {
    consumableList.push({
      id: e['id'],
      name: e['name'],
      manufacturer: e['manufacturer'],
    })
  })
  return consumableList
}

// 获取组件列表
async function getComponentList() {
  const param = {
    limit: 5,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('components', param) // 获取房单客人列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const componentList = []
  rows.forEach((e) => {
    componentList.push({
      id: e['id'],
      name: e['name'],
      supplier: e['supplier'],
    })
  })
  return componentList
}
