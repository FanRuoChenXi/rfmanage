//Page Object
Page({
  data: {},

  async onLoad() {
    wx.$loading('加载中...')
    const departmentList = await getDepartmentList() // 获取活动列表
    this.setData({ departmentList }) // 若无数据返回, 则标记加载到底
    wx.$loading(false)
  },
})

// 获取部门列表
async function getDepartmentList() {
  const [res, err] = await wx.$get('departments')
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const list = []
  rows.forEach((e) => {
    list.push({
      id: e['id'],
      name: e['name'],
      usersCount: e['usersCount'],
    })
  })
  return list
}
