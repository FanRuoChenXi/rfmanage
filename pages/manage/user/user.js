//Page Object
Page({
  data: {
    userList: [], // 用户列表
    isBottom: false, // 是否加载到底
  },

  onLoad() {
    initPagination() // 重置分页器
    this.updateUserList() // 更新列表
  },

  // 触底加载
  async onReachBottom() {
    if (this.data.isBottom) return // 如果已加载到底，拦截
    this.updateUserList() // 更新列表
  },

  // 更新用户列表
  async updateUserList() {
    wx.$loading('加载中...')
    const newList = await getUserList()
    if (newList) {
      const { userList } = this.data
      this.setData({ userList: [...userList, ...newList] }) // 若有数据返回, 则追加到下面
    } else {
      this.setData({ isBottom: true }) // 若无数据返回, 则标记加载到底
    }
    wx.$loading(false)
  },
})

// 获取用户列表
async function getUserList() {
  const param = {
    limit: 10,
    offset: pagination.offset,
    sort: 'created_at',
    order: 'asc',
    all: 'true',
  }
  const list = []
  if (pagination.isBottom) return false // 已加载到底时,拦截
  const [res, err] = await wx.$get('users', param) // 获取用户列表
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
      department: e['department'],
      phone: e['phone'],
      email: e['email'],
      assetsCount: e['assetsCount'],
      licensesCount: e['licensesCount'],
      accessoriesCount: e['accessoriesCount'],
      consumablesCount: e['consumablesCount'],
      activated: e['activated'],
      availableActions: e['availableActions'],
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
