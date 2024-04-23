//Page Object
Page({
  data: {
    assetList: [],
    isBottom: false, // 是否加载到底
    searchValue: '',
  },

  // onLoad() {
  //   initPagination() // 重置分页器
  // },

  // 搜索
  async onSearch(e) {
    const searchValue = e.detail.value
    initPagination() // 重置分页器
    this.setData({ searchValue, assetList: [] })
    this.updateAssetList()
  },

  // 触底加载
  async onReachBottom() {
    if (this.data.isBottom) return // 如果已加载到底，拦截
    this.updateAssetList() // 更新列表
  },

  // 更新资产列表
  async updateAssetList() {
    const { searchValue } = this.data
    wx.$loading('加载中...')
    const newList = await getAssetList(searchValue) // 获取活动列表
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
async function getAssetList(searchValue) {
  const param = {
    limit: 10,
    offset: pagination.offset,
    sort: 'created_at',
    order: 'desc',
    search: searchValue,
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

// 分页器及搜索条件
const pagination = {}
function initPagination() {
  pagination.offset = 0 // 当前偏移量
  pagination.isBottom = false // 是否加载到底
}
