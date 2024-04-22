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
    const [res, err] = await wx.$get(url, param) // 获取房单客人列表
    if (err) return wx.$msg(err)
    switch (query['key']) {
      case 'licenses':
        this.setLicensesData(res)
        break
    }
  },

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
})
