//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    categoryName: '', // 类别名称
    categoryTypeValue: [], // 类别类型
    categoryTypeText: '',
    categoryType: [
      { label: '资产', value: 'asset' },
      { label: '许可证', value: 'license' },
      { label: '配件', value: 'accessory' },
      { label: '消耗品', value: 'consumable' },
      { label: '组件', value: 'component' },
    ],
  },

  async onLoad(query) {
    this.setData({ mode: query['key'] })
  },

  // 选择类别类型
  onCategoryTypePicker() {
    this.setData({ pickerName: 'categoryType' })
  },

  // 新增
  async onCreateItem() {
    wx.$loading('提交中...')
    const { mode, categoryName, categoryTypeValue } = this.data
    let param = {}
    switch (mode) {
      case 'categories':
        param = {
          name: categoryName,
          categoryType: categoryTypeValue[0],
        }
        break
      case 'licenses':
        break
      case 'accessories':
        break
      case 'consumables':
        break
      case 'components':
        break
    }
    const [res, err] = await wx.$post(mode, param)
    if (err) return wx.$msg(err || '创建失败')
    wx.$push('back', { delta: 1 })
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
})
