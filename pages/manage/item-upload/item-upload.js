//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    itemTypeValue: '',
    itemTypeText: '',
    itemType: [
      { label: '资产', value: 'hardware' },
      { label: '许可证', value: 'licenses/' },
      { label: '配件', value: 'accessories' },
      { label: '消耗品', value: 'consumables' },
      { label: '组件', value: 'components' },
      //   { label: '用户', value: 'user' },
    ],
    licensesItemName: '', // 许可证名称
    licenseEmail: '',
    licenseName: '',
    seats: 0, // 许可证总量
    categoryValue: [],
    categoryText: '',
    category: [],
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
    const categoryText = {
      hardware: 'asset',
      'licenses/': 'license',
      accessories: 'accessories',
      consumables: 'consumables',
      components: 'components',
    }
    const categoryType = categoryText[itemTypeValue]
    const param = {
      limit: 50,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
      categoryType,
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
})
