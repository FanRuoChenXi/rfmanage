//Page Object
Page({
  data: {
    mode: '',
  },

  async onLoad(query) {
    // console.log(query)
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
    this.setData({ mode: 'hardware', hardware })
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
    this.setData({ mode: 'licenses', licenses })
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
    this.setData({ mode: 'accessory', accessory })
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
    this.setData({ mode: 'consumable', consumable })
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
    this.setData({ mode: 'component', component })
  },
})
