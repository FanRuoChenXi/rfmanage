//Page Object
Page({
  data: {},

  async onLoad(query) {
    // console.log(query)
    const url = 'licenses/' + query['licensesId']
    const param = {
      limit: 5,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get(url, param) // 获取房单客人列表
    if (err) return wx.$msg(err)
    this.setData({
      name: res.name,
      productKey: res.productKey,
      expirationDate: res.expirationDate,
      licenseEmail: res.licenseEmail,
      licenseName: res.licenseName,
      manufacturer: res.manufacturer,
      seats: res.seats,
      freeSeatsCount: res.freeSeatsCount,
    })
  },
})
