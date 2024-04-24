//Page Object
Page({
  data: {
    assetTag: '', // 资产标签
    pickerName: '', // 显示选择器类型
    locationValue: [],
    locationText: '',
    location: [], // 位置列表
    date: new Date().getTime(), // 支持时间戳传入
    dateText: '',
    start: '2020-01-01 00:00:00', // 时间起始
    end: '2050-09-09 12:12:12',
    autosize: {
      maxHeight: 120,
      minHeight: 20,
    },
    note: '', // 备注'
    isButtonDisabled: false, // 是否禁用按钮
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

  // 选择位置
  async onlocationPicker() {
    const { location } = this.data
    const param = {
      limit: 50,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get('locations', param) // 获取房单客人列表
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      location.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'location', location })
  },

  onDatePicker() {
    this.setData({ pickerName: 'date' })
  },

  // 选择时间
  onDateChange(e) {
    const { key } = e.currentTarget.dataset
    const { value } = e.detail

    this.setData({
      [key]: value,
      [`${key}Text`]: value,
    })

    this.onPickerCancel()
  },

  // 审计
  async onAssetAudit() {
    const { assetTag, locationValue, date, note } = this.data
    const param = {
      assetTag,
      locationId: locationValue[0],
      nextAuditDate: date,
    }
    wx.$loading('提交中...')
    const [res, err] = await wx.$post('hardware/audit', param)
    if (err) return wx.$msg(err || '审计失败')
    wx.$msg('成功审计')
    wx.$replace('/pages/manage/asset-audit')
  },
})
