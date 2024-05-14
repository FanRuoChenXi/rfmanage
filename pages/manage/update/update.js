//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    categoryName: '',
  },

  async onLoad(query) {
    this.setData({ mode: query['key'], id: query['id'] })
    const url = `${query['key']}/${query['id']}`
    wx.$loading('加载中...')
    const [res, err] = await wx.$get(url)
    if (err) return wx.$msg(err)
    switch (query['key']) {
      case 'categories':
        this.setCategoryData(res)
        break
    }
    wx.$loading(false)
  },

  // 更新项目
  async onUpdate() {
    wx.$loading('提交中...')
    const { mode, id } = this.data
    const url = `https://develop.snipeitapp.com/api/v1/${mode}/${id}`
    let param = {}
    switch (mode) {
      case 'categories':
        param = {
          name: this.data.categoryName,
        }
        break
    }
    await this.updateItem(url, param)
  },

  // 更新请求
  updateItem(url, param) {
    wx.request({
      url,
      data: param,
      method: 'PUT',
      header: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTU2MDc0MjVmYjM5YTEwYjFjNTZlZTAxMTBmZDk4ZjQ0ZjVjODMzYjcxZWVhYjZlNDk1NGMwOThlY2YzMzU2MDY4Mzg4MmFhMDMzOTAzNzciLCJpYXQiOjE2MzI4NjU5MTgsIm5iZiI6MTYzMjg2NTkxOCwiZXhwIjoyMjY0MDIxNTE4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.LgGVzyH67IRhXvccHd4j2Dn6TDuIuQTBoo30_wD9jPehy8v_h0xBmE1-dOUBRJyeJOI8B4gwPeALsWaudpGj9Lb5qWAtKV7eYtH9IYQKoLF_iHgOGXnAUcNwID6zBU_YyLNSI6gp8zjutLJias33CBLsHy5ZRNpxVibVrZouJ_HjYuIYbtZyLus-KFFeibtZoPiTWOeHhQFD37MR6ifx4dBqT37fN-xDS99mONtrkAplEIou5aSO1oZ4IlJIPCUyA1lixPgpn1YU7PxiBDZp1teeugD0WEmrAqxRS2I0bH4qPsuTsrVXS_lo87Sf5LBGLW7lGHKqyYH6J47OZOM0K-SrxLKtE1ww8jyLBgnnxH0lJHRLCBiwUnL5ZGTUmiOysUA-wSJ6s78o8Pc-ec6bpBvAlelHdiQ-wslE7gzEJDptbejFg-75b_CEwgJYh7J2D18ul6Qu5EFCUEgt033mm04dgVk0isWTDt6EW5ZvTo5Qhr1LY0YnEIXCTqIRN-BSQjL55sZaCrtwR_21bnBGgniyI5MRDYblFawVmFKroeClCpSjBo9vi66akdD5hjpvx67RL3r33BZQhEXmPifUPNH5wP_U-IHGFUD99TJk2c1awF0RASveZRLSunbJb1x6hGAVUaIvQV4r2quWzXqYyKLph9kGTyJYrb6iJtH5smE',
        Accept: 'application/json',
      },
      success: (response) => {
        console.log(response)
        if (response.statusCode == 200) {
          wx.$msg('更新成功')
          wx.$push('back', { delta: 1 })
        } else {
          wx.$msg(response.errMsg)
        }
      },
      fail: (error) => {
        console.log(error)
      },
    })
  },

  // 类别数据
  setCategoryData(res) {
    const categoryName = res['name']
    const categoryType = res['categoryType']
    this.setData({ categoryName, categoryType })
  },
})
