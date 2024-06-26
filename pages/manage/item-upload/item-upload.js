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
    categoryValue: [], // 类别
    categoryText: '',
    category: [],
    modelValue: [], // 模型
    modelText: '',
    model: [],
    statusValue: [], // 状态
    statusText: '',
    status: [],

    assetTag: wx.getStorageSync('assetTag'), // 资产标签

    licensesItemName: '', // 许可证名称
    licenseEmail: '',
    licenseName: '',
    licenseSeats: 0, // 许可证总量

    accessoryItemName: '', // 配件名称
    accessoryQuantity: 0, // 配件数量

    consumableItemName: '', // 消耗品名称
    consumableQuantity: 0, // 消耗品数量

    componentItemName: '', // 组件名称
    componentQuantity: 0, // 组件数量
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
      case 'component':
        await this.createComponent()
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
      licenseEmail,
      licenseName,
      licenseSeats,
    } = this.data
    const param = {
      name: licensesItemName,
      categoryId: categoryValue[0],
      licenseEmail,
      licenseName,
      seats: licenseSeats,
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

  // 新增组件
  async createComponent() {
    const { componentItemName, categoryValue, componentQuantity } = this.data
    const param = {
      name: componentItemName,
      categoryId: categoryValue[0],
      qty: componentQuantity,
    }
    const [res, err] = await wx.$post('components', param)
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
    const { itemTypeValue } = this.data
    const category = []
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
    const model = []
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
    const status = []
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

  // 步进器
  licenseSeatsChange(e) {
    this.setData({
      licenseSeats: e.detail.value,
    })
  },

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

  componentQuantityChange(e) {
    this.setData({
      componentQuantity: e.detail.value,
    })
  },
})
