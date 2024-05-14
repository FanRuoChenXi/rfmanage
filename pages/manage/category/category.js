//Page Object
Page({
  data: {
    categoryList: [], // 活动列表
    isBottom: false, // 是否加载到底
    categoryTypeText: {
      Asset: '资产',
      Accessory: '配件',
      Consumable: '消耗品',
      Component: '组件',
      License: '许可证',
    },
    itemIcon: {
      Asset: 'barcode',
      License: 'system-storage',
      Consumable: 'highlight-1',
      Accessory: 'keyboard',
      Component: 'component-dropdown',
    },
  },

  onShow() {
    initPagination() // 重置分页器
    this.updateCategoryList() // 更新列表
  },

  // 触底加载
  async onReachBottom() {
    if (this.data.isBottom) return // 如果已加载到底，拦截
    this.updateCategoryList() // 更新列表
  },

  // 更新类别列表
  async updateCategoryList() {
    wx.$loading('加载中...')
    const newList = await getCategoryList()
    if (newList) {
      const { categoryList } = this.data
      this.setData({ categoryList: [...categoryList, ...newList] }) // 若有数据返回, 则追加到下面
    } else {
      this.setData({ isBottom: true }) // 若无数据返回, 则标记加载到底
    }
    wx.$loading(false)
  },

  // 前往新增页
  toCreate(e) {
    const { key } = e.currentTarget.dataset
    wx.$push('/pages/manage/create', { key })
  },
})

// 获取类别列表
async function getCategoryList() {
  const param = {
    limit: 10,
    offset: pagination.offset,
    sort: 'id',
    order: 'desc',
  }
  const list = []
  if (pagination.isBottom) return false // 已加载到底时,拦截
  const [res, err] = await wx.$get('categories', param) // 获取房单客人列表
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
      categoryType: e['categoryType'],
      availableActions: e['availableActions'],
      itemCount: e['itemCount'],
    })
  })
  return list
}

// 分页器及搜索条件
const pagination = {}
function initPagination() {
  pagination.offset = 0 // 当前偏移量
  pagination.isBottom = false // 是否加载到底
}
