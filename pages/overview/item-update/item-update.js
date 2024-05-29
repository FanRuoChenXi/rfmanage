//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    modelValue: [], // 模型
    modelText: '',
    model: [],
    statusValue: [], // 状态标签
    statusText: '',
    status: [],
    categoryValue: [], // 类别
    categoryText: '',
    category: [],

    assetTag: '', // 资产标签

    licensesName: '', // 许可证名称
    licenseSeats: 0, // 许可证总量

    accessoryName: '', // 配件名称
  },

  async onLoad(query) {
    this.setData({ mode: query['key'], id: query['id'] })
    const url = `${query['key']}/${query['id']}`
    wx.$loading('加载中...')
    const [res, err] = await wx.$get(url)
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

  // 更新项目
  async onUpdate() {
    wx.$loading('提交中...')
    const { mode, id } = this.data
    const url = `https://develop.snipeitapp.com/api/v1/${mode}/${id}`
    let param = {}
    switch (mode) {
      case 'hardware':
        param = {
          asset_tag: this.data.assetTag,
          status_id: this.data.statusValue[0],
          model_id: this.data.modelValue[0],
        }
        break
      case 'licenses':
        param = {
          name: this.data.licensesName,
          category_id: this.data.categoryValue[0],
          seats: this.data.licenseSeats,
        }
        break
      case 'accessories':
        param = {
          name: this.data.accessoryName,
          category_id: this.data.categoryValue[0],
        }
        break
      case 'consumables':
        break
      case 'components':
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

  // 关闭选择器
  onPickerCancel() {
    this.setData({ pickerName: '' })
  },

  // 确认
  onPickerChange(e) {
    // console.log(e)
    const { key } = e.currentTarget.dataset
    const { label, value } = e.detail
    this.setData({
      pickerName: '',
      [`${key}Value`]: value,
      [`${key}Text`]: label.join(' '),
    })
  },

  // 选择资产模型
  async onModelPicker() {
    const model = []
    const param = {
      limit: 50,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get('models', param) // 获取模型列表
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      model.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'model', model })
  },

  // 选择状态标签
  async onStatusPicker() {
    const status = []
    const param = {
      limit: 50,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get('statuslabels', param) // 获取状态标签列表
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      status.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'status', status })
  },

  // 选择类别
  async onCategoryPicker() {
    const categoryType = {
      licenses: 'license',
      accessories: 'accessory',
      consumables: 'consumable',
      components: 'component',
    }
    const category = []
    const param = {
      limit: 50,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
      categoryType: categoryType[this.data.mode],
    }
    const [res, err] = await wx.$get('categories', param) // 获取状态标签列表
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      category.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'category', category })
  },

  // 步进器
  licenseSeatsChange(e) {
    this.setData({
      licenseSeats: e.detail.value,
    })
  },

  // 资产数据
  setHardwareData(res) {
    const assetTag = res['assetTag']
    const modelText = res['model']['name']
    const statusText = res['statusLabel']['name']
    this.setData({ mode: 'hardware', assetTag, modelText, statusText })
  },

  // 许可证数据
  setLicensesData(res) {
    const licensesName = res['name']
    const category = res['category']
    const licenseSeats = res['seats']
    this.setData({
      mode: 'licenses',
      licensesName,
      licenseSeats,
      categoryText: category['name'],
    })
  },

  // 配件数据
  setAccessoryData(res) {
    const accessoryName = res['name']
    const category = res['category']
    this.setData({
      mode: 'accessories',
      accessoryName,
      categoryText: category['name'],
    })
  },

  // 消耗品数据
  setConsumableData(res) {},

  // 组件数据
  setComponentData(res) {},
})
