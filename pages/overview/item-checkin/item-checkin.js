//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    statusValue: [], // 状态
    statusText: '',
    status: [],
    date: new Date().getTime(), // 支持时间戳传入
    dateText: '',
    start: '2020-01-01 00:00:00', // 时间起始
    end: '2050-09-09 12:12:12',
  },

  async onLoad(query) {
    this.setData({ mode: query['key'], id: query['id'] })
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

  // 签出
  async onCheckIn() {
    wx.$loading('提交中...')
    const { mode, id, statusValue, date } = this.data
    const url = `${mode}/${id}/checkin`
    const param = {
      statusId: statusValue[0],
      checkinAt: date,
    }
    const [res, err] = await wx.$post(url, param)
    if (err) return wx.$msg(err || '签入失败')
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
})
