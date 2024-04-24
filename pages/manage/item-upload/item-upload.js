//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    itemTypeValue: '',
    itemTypeText: '',
    itemType: [
      { label: '资产', value: 'asset' },
      { label: '许可证', value: 'license' },
      { label: '配件', value: 'accessories' },
      { label: '消耗品', value: 'consumables' },
      { label: '组件', value: 'components' },
      { label: '用户', value: 'user' },
    ],
    licensesItemName: '', // 许可证名称
    licenseEmail: '',
    licenseName: '',
    seats: 0, // 许可证总量
    categoryValue: [], // 类别
    categoryText: '',
    category: [],
    assetTag: '', // 资产标签
    modelValue: [], // 模型
    modelText: '',
    model: [],
    statusValue: [], // 状态
    statusText: '',
    status: [],
  },

  // 保存按钮
  async onCreateItem() {
    wx.$loading('提交中...')
    const { itemTypeValue } = this.data
    switch (itemTypeValue[0]) {
      case 'asset':
        await this.createHardware()
        break
      case 'license':
        await this.createLicenses()
        break
    }
  },

  // 新增资产
  async createHardware() {
    const { assetTag, modelValue, statusValue } = this.data
    const param = {
      assetTag,
      modelId: modelValue[0],
      statusId: statusValue[0],
    }
    const [res, err] = await wx.$post('hardware', param)
    if (err) return wx.$msg(err || '创建失败')
    wx.$replace('/pages/overview/overview')
  },

  // 新增许可证
  async createLicenses() {
    const {
      licensesItemName,
      categoryValue,
      seats,
      licenseEmail,
      licenseName,
    } = this.data
    const param = {
      name: licensesItemName,
      categoryId: categoryValue[0],
      seats,
      licenseEmail,
      licenseName,
    }
    const [res, err] = await wx.$post('licenses/', param)
    if (err) return wx.$msg(err || '创建失败')
    wx.$replace('/pages/overview/overview')
  },

  // 关闭选择器
  onPickerCancel() {
    this.setData({ pickerName: '' })
  },

  // 确认
  onPickerChange(e) {
    console.log(e)
    const { key } = e.currentTarget.dataset
    const { label, value } = e.detail
    this.setData({
      pickerName: '',
      [`${key}Value`]: value,
      [`${key}Text`]: label.join(' '),
    })
  },

  // 选择项目类型
  onitemTypePicker() {
    this.setData({ pickerName: 'itemType' })
  },

  // 选择类别
  async oncategoryPicker() {
    const { itemTypeValue, category } = this.data
    const param = {
      limit: 50,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
      categoryType: itemTypeValue,
    }
    const [res, err] = await wx.$get('categories', param) // 获取房单客人列表
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

  // 滑块选择器
  seatsChange(e) {
    this.setData({
      seats: e.detail.value,
    })
  },

  // 选择资产模型
  async onModelPicker() {
    const { model } = this.data
    const param = {
      limit: 50,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get('models', param) // 获取房单客人列表
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
    const { status } = this.data
    const param = {
      limit: 50,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get('statuslabels', param) // 获取房单客人列表
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
})
