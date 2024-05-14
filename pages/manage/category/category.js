//Page Object
Page({
  data: {
    categoryList: [], // 类别列表
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

  // 删除
  onDelete(e) {
    const { id } = e.currentTarget.dataset
    wx.$modal({
      title: '删除类别',
      showCancel: true,
      content: '确定要删除吗?',
    }).then(() => {
      wx.$loading('提交中...')
      this.DeleteCategory(id)
    })
  },

  DeleteCategory(id) {
    const url = `https://develop.snipeitapp.com/api/v1/categories/${id}`
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
          this.setData({ categoryList: [] })
          initPagination() // 重置分页器
          this.updateCategoryList() // 更新列表
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
