//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    itemTypeValue: '',
    itemTypeText: '',
    itemType: [
      { label: '资产', value: 'asset' },
      { label: '许可证', value: 'license' },
      { label: '配件', value: 'accessory' },
      { label: '消耗品', value: 'consumable' },
      { label: '组件', value: 'component' },
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
    accessoryItemName: '', // 配件名称
    accessoryQuantity: 0, // 配件数量
    consumableItemName: '', // 消耗品名称
    consumableQuantity: 0, // 消耗品数量
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
      case 'accessory':
        await this.createAccessory()
        break
      case 'consumable':
        await this.createConsumable()
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

  // 新增配件
  async createAccessory() {
    const { accessoryItemName, categoryValue, accessoryQuantity } = this.data
    const param = {
      name: accessoryItemName,
      categoryId: categoryValue[0],
      qty: accessoryQuantity,
    }
    const [res, err] = await wx.$post('accessories', param)
    if (err) return wx.$msg(err || '创建失败')
    wx.$replace('/pages/overview/overview')
  },

  // 新增消耗品
  async createConsumable() {
    const { consumableItemName, categoryValue, consumableQuantity } = this.data
    const param = {
      name: consumableItemName,
      categoryId: categoryValue[0],
      qty: consumableQuantity,
    }
    const [res, err] = await wx.$post('consumables', param)
    if (err) return wx.$msg(err || '创建失败')
    wx.$replace('/pages/overview/overview')
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

  // 选择项目类型
  onitemTypePicker() {
    this.setData({ pickerName: 'itemType', categoryText: '' })
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

  // 滑块选择器
  seatsChange(e) {
    this.setData({
      seats: e.detail.value,
    })
  },

  // 步进器
  accessoryQuantityChange(e) {
    this.setData({
      accessoryQuantity: e.detail.value,
    })
  },

  consumableQuantityChange(e) {
    this.setData({
      consumableQuantity: e.detail.value,
    })
  },
})
