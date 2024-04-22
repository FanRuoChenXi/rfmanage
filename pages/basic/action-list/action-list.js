//Page Object
Page({
  data: {
    actionList: [], // 活动列表
    isBottom: false, // 是否加载到底
    itemIcon: {
      asset: 'barcode',
      license: 'system-storage',
      consumable: 'highlight-1',
      accessory: 'keyboard',
      component: 'component-dropdown',
      user: 'user-1',
    },
    actionType: {
      checkout: '签出',
      'checkin from': '签入',
      update: '更新',
      'create new': '新增项目',
      delete: '删除项目',
      audit: '审计',
      uploaded: '上传',
      accepted: '接受',
      declined: '拒绝',
      requested: '请求',
      'request canceled': '请求取消',
    },
  },

  onLoad() {
    initPagination() // 重置分页器
    this.updateActionList() // 更新活动列表
  },

  // 触底加载
  async onReachBottom() {
    if (this.data.isBottom) return // 如果已加载到底，拦截
    this.updateActionList() // 更新列表
  },

  // 更新活动列表
  async updateActionList() {
    wx.$loading('加载中...')
    const newList = await getActionList() // 获取活动列表
    if (newList) {
      const { actionList } = this.data
      this.setData({ actionList: [...actionList, ...newList] }) // 若有数据返回, 则追加到下面
    } else {
      this.setData({ isBottom: true }) // 若无数据返回, 则标记加载到底
    }
    wx.$loading(false)
  },
})

// 获取活动列表
async function getActionList() {
  const param = {
    limit: 10,
    offset: pagination.offset,
    sort: 'created_at',
    order: 'desc',
  }
  const list = []
  if (pagination.isBottom) return false // 已加载到底时,拦截
  const [res, err] = await wx.$get('reports/activity', param) // 获取房单客人列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  if (param.limit + pagination.offset >= total) {
    pagination.isBottom = true // 判断已加载到底
  }
  pagination.offset += param.limit // 偏移量添加
  rows.forEach((e) => {
    list.push({
      actionDate: e['actionDate'],
      admin: e['admin'],
      actionType: e['actionType'],
      item: e['item'],
      target: e['target'],
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
