//Page Object
Page({
  data: {},

  onShow() {
    this.updateDepartmentList()
  },

  // 更新类别列表
  async updateDepartmentList() {
    wx.$loading('加载中...')
    const departmentList = await getDepartmentList() // 获取活动列表
    this.setData({ departmentList }) // 若无数据返回, 则标记加载到底
    wx.$loading(false)
  },

  // 前往新增页
  toCreate(e) {
    const { key } = e.currentTarget.dataset
    wx.$push('/pages/manage/create', { key })
  },

  // 前往更新页
  toUpdate(e) {
    const { key, id } = e.currentTarget.dataset
    wx.$push('/pages/manage/update', { key, id })
  },

  // 删除
  onDelete(e) {
    const { id } = e.currentTarget.dataset
    wx.$modal({
      title: '删除部门',
      showCancel: true,
      content: '确定要删除吗?',
    }).then(() => {
      wx.$loading('提交中...')
      this.DeleteDepartment(id)
    })
  },

  DeleteDepartment(id) {
    const url = `https://develop.snipeitapp.com/api/v1/departments/${id}`
    wx.request({
      url,
      method: 'DELETE',
      header: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTU2MDc0MjVmYjM5YTEwYjFjNTZlZTAxMTBmZDk4ZjQ0ZjVjODMzYjcxZWVhYjZlNDk1NGMwOThlY2YzMzU2MDY4Mzg4MmFhMDMzOTAzNzciLCJpYXQiOjE2MzI4NjU5MTgsIm5iZiI6MTYzMjg2NTkxOCwiZXhwIjoyMjY0MDIxNTE4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.LgGVzyH67IRhXvccHd4j2Dn6TDuIuQTBoo30_wD9jPehy8v_h0xBmE1-dOUBRJyeJOI8B4gwPeALsWaudpGj9Lb5qWAtKV7eYtH9IYQKoLF_iHgOGXnAUcNwID6zBU_YyLNSI6gp8zjutLJias33CBLsHy5ZRNpxVibVrZouJ_HjYuIYbtZyLus-KFFeibtZoPiTWOeHhQFD37MR6ifx4dBqT37fN-xDS99mONtrkAplEIou5aSO1oZ4IlJIPCUyA1lixPgpn1YU7PxiBDZp1teeugD0WEmrAqxRS2I0bH4qPsuTsrVXS_lo87Sf5LBGLW7lGHKqyYH6J47OZOM0K-SrxLKtE1ww8jyLBgnnxH0lJHRLCBiwUnL5ZGTUmiOysUA-wSJ6s78o8Pc-ec6bpBvAlelHdiQ-wslE7gzEJDptbejFg-75b_CEwgJYh7J2D18ul6Qu5EFCUEgt033mm04dgVk0isWTDt6EW5ZvTo5Qhr1LY0YnEIXCTqIRN-BSQjL55sZaCrtwR_21bnBGgniyI5MRDYblFawVmFKroeClCpSjBo9vi66akdD5hjpvx67RL3r33BZQhEXmPifUPNH5wP_U-IHGFUD99TJk2c1awF0RASveZRLSunbJb1x6hGAVUaIvQV4r2quWzXqYyKLph9kGTyJYrb6iJtH5smE',
        Accept: 'application/json',
      },
      success: async (response) => {
        console.log(response)
        if (response.statusCode == 200) {
          wx.$msg('删除成功')
          this.updateDepartmentList() // 更新列表
        } else {
          wx.$msg(response.errMsg)
        }
      },
      fail: (error) => {
        console.log(error)
      },
    })
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
      location: e['location'],
      availableActions: e['availableActions'],
    })
  })
  return list
}
