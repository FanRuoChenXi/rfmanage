//Page Object
Page({
  data: {
    tabValue: '0',
    assetList: [],
    isBottom: false, // 是否加载到底
  },

  async onLoad() {
    initPagination() // 重置分页器
    this.updateAssetList() // 更新活动列表
  },

  // 选项卡更新
  async onTabChange(e) {
    const newValue = e.detail.value
    const { tabValue } = this.data
    if (tabValue == newValue) return false
    wx.$loading('加载中...')
    switch (newValue) {
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

  // 滚动到底部
  onAssetBottom() {
    if (this.data.isBottom) return // 如果已加载到底，拦截
    this.updateAssetList() // 更新列表
  },

  // 更新资产列表
  async updateAssetList() {
    wx.$loading('加载中...')
    const newList = await getAssetList() // 获取活动列表
    if (newList) {
      const { assetList } = this.data
      this.setData({ assetList: [...assetList, ...newList] }) // 若有数据返回, 则追加到下面
    } else {
      this.setData({ isBottom: true }) // 若无数据返回, 则标记加载到底
    }
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
    limit: 10,
    offset: pagination.offset,
    sort: 'created_at',
    order: 'desc',
  }
  const list = []
  if (pagination.isBottom) return false // 已加载到底时,拦截
  const [res, err] = await wx.$get('hardware', param)
  if (err) return wx.$msg(err)
  const { total, rows } = res
  if (param.limit + pagination.offset >= total) {
    pagination.isBottom = true // 判断已加载到底
  }
  pagination.offset += param.limit // 偏移量添加
  rows.forEach((e) => {
    list.push({
      id: e['id'],
      name: e['name'],
      assetTag: e['assetTag'],
      model: e['model'],
    })
  })
  return list
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

// 分页器及搜索条件
const pagination = {}
function initPagination() {
  pagination.offset = 0 // 当前偏移量
  pagination.isBottom = false // 是否加载到底
}
