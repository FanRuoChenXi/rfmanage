//Page Object
Page({
  data: {
    mode: '',
  },

  async onLoad(query) {
    // console.log(query)
    this.setData({ id: query['id'] })
    const url = `${query['key']}/` + query['id']
    const param = {
      limit: 5,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    wx.$loading('加载中...')
    const [res, err] = await wx.$get(url, param) // 获取房单客人列表
    if (err) return wx.$msg(err)
    switch (query['key']) {
      case 'hardware':
        this.setHardwareData(res)
        break
      case 'licenses':
        this.setLicensesData(res)
        break
      case 'accessories':
        this.setAccessoryData(res)
        break
      case 'consumables':
        this.setConsumableData(res)
        break
      case 'components':
        this.setComponentData(res)
        break
    }
    wx.$loading(false)
  },

  // 资产数据
  setHardwareData(res) {
    const hardware = {
      name: res.name,
      assetTag: res.assetTag,
      serial: res.serial,
      model: res.model,
      category: res.category,
      statusLabel: res.statusLabel,
      location: res.location,
      purchaseCost: res.purchaseCost,
      bookValue: res.bookValue,
    }
    const availableActions = res.availableActions
    this.setData({ mode: 'hardware', hardware, availableActions })
  },

  // 许可证数据
  setLicensesData(res) {
    const licenses = {
      name: res.name,
      productKey: res.productKey,
      expirationDate: res.expirationDate,
      licenseEmail: res.licenseEmail,
      licenseName: res.licenseName,
      manufacturer: res.manufacturer,
      seats: res.seats,
      freeSeatsCount: res.freeSeatsCount,
    }
    const availableActions = res.availableActions
    this.setData({ mode: 'licenses', licenses, availableActions })
  },

  // 配件数据
  setAccessoryData(res) {
    const accessory = {
      name: res.name,
      category: res.category,
      modelNumber: res.modelNumber,
      location: res.location,
      qty: res.qty,
      usersCount: res.usersCount,
      minQty: res.minQty,
    }
    const availableActions = res.availableActions
    this.setData({ mode: 'accessories', accessory, availableActions })
  },

  // 消耗品数据
  setConsumableData(res) {
    const consumable = {
      name: res.name,
      category: res.category,
      modelNumber: res.modelNumber,
      itemNo: res.itemNo,
      qty: res.qty,
      remaining: res.remaining,
      minQty: res.minQty,
      orderNumber: res.orderNumber,
      purchaseDate: res.purchaseDate,
      purchaseCost: res.purchaseCost,
    }
    const availableActions = res.availableActions
    this.setData({ mode: 'consumables', consumable, availableActions })
  },

  // 组件数据
  setComponentData(res) {
    const component = {
      name: res.name,
      serial: res.serial,
      category: res.category,
      qty: res.qty,
      remaining: res.remaining,
      minQty: res.minQty,
      location: res.location,
      orderNumber: res.orderNumber,
      purchaseDate: res.purchaseDate,
      purchaseCost: res.purchaseCost,
    }
    const availableActions = res.availableActions
    this.setData({ mode: 'components', component, availableActions })
  },

  onDelete() {
    const { mode } = this.data
    const modeText = {
      hardware: '资产',
      licenses: '许可证',
      accessories: '配件',
      consumables: '消耗品',
      components: '组件',
    }
    wx.$modal({
      title: `删除${modeText[mode]}`,
      showCancel: true,
      content: '确定要删除吗?',
    }).then(() => {
      wx.$loading('提交中...')
      this.DeleteItem()
      // wx.$push('back', { delta: 1 })
    })
  },

  // 删除项目
  DeleteItem() {
    const { mode, id } = this.data
    const url = `https://develop.snipeitapp.com/api/v1/${mode}/${id}`
    wx.request({
      url,
      method: 'DELETE',
      header: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTU2MDc0MjVmYjM5YTEwYjFjNTZlZTAxMTBmZDk4ZjQ0ZjVjODMzYjcxZWVhYjZlNDk1NGMwOThlY2YzMzU2MDY4Mzg4MmFhMDMzOTAzNzciLCJpYXQiOjE2MzI4NjU5MTgsIm5iZiI6MTYzMjg2NTkxOCwiZXhwIjoyMjY0MDIxNTE4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.LgGVzyH67IRhXvccHd4j2Dn6TDuIuQTBoo30_wD9jPehy8v_h0xBmE1-dOUBRJyeJOI8B4gwPeALsWaudpGj9Lb5qWAtKV7eYtH9IYQKoLF_iHgOGXnAUcNwID6zBU_YyLNSI6gp8zjutLJias33CBLsHy5ZRNpxVibVrZouJ_HjYuIYbtZyLus-KFFeibtZoPiTWOeHhQFD37MR6ifx4dBqT37fN-xDS99mONtrkAplEIou5aSO1oZ4IlJIPCUyA1lixPgpn1YU7PxiBDZp1teeugD0WEmrAqxRS2I0bH4qPsuTsrVXS_lo87Sf5LBGLW7lGHKqyYH6J47OZOM0K-SrxLKtE1ww8jyLBgnnxH0lJHRLCBiwUnL5ZGTUmiOysUA-wSJ6s78o8Pc-ec6bpBvAlelHdiQ-wslE7gzEJDptbejFg-75b_CEwgJYh7J2D18ul6Qu5EFCUEgt033mm04dgVk0isWTDt6EW5ZvTo5Qhr1LY0YnEIXCTqIRN-BSQjL55sZaCrtwR_21bnBGgniyI5MRDYblFawVmFKroeClCpSjBo9vi66akdD5hjpvx67RL3r33BZQhEXmPifUPNH5wP_U-IHGFUD99TJk2c1awF0RASveZRLSunbJb1x6hGAVUaIvQV4r2quWzXqYyKLph9kGTyJYrb6iJtH5smE',
        Accept: 'application/json',
      },
      success: (response) => {
        console.log(response)
        if (response.statusCode == 200) {
          wx.$msg('删除成功')
          wx.$replace('/pages/overview/overview')
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
