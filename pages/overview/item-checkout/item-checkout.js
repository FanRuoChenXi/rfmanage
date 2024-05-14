//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    typeValue: '', // 类型
    typeText: '',
    type: [
      { label: '用户', value: 'user' },
      { label: '位置地点', value: 'location' },
      { label: '其他资产', value: 'asset' },
    ],
    userValue: '', // 用户
    userText: '',
    user: [],
    locationValue: '', // 地点
    locationText: '',
    location: [],
    assetValue: '', // 资产
    assetText: '',
    asset: [],
    statusValue: [], // 状态
    statusText: '',
    status: [],
  },

  async onLoad(query) {
    this.setData({ mode: query['key'], id: query['id'] })
  },

  // 选择项目类型
  onTypePicker() {
    this.setData({ pickerName: 'type' })
  },

  // 选择用户
  async onUserPicker() {
    const user = []
    const param = {
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get('users', param) // 获取用户列表
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      user.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'user', user })
  },

  // 选择地点
  async onLocationPicker() {
    const location = []
    const param = {
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get('locations', param) // 获取地点列表
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

  // 选择资产
  async onAssetPicker() {
    const asset = []
    const param = {
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const [res, err] = await wx.$get('hardware', param) // 获取资产列表
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      asset.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'asset', asset })
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
  async onCheckOut() {
    wx.$loading('提交中...')
    const { mode, id, typeValue, statusValue, userValue, locationValue } =
      this.data
    const url = `${mode}/${id}/checkout`
    const param = {
      checkoutToType: typeValue[0],
      statusId: statusValue[0],
      assignedUser: userValue[0],
      assignedLocation: locationValue[0],
    }
    const [res, err] = await wx.$post(url, param)
    if (err) return wx.$msg(err || '签出失败')
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
})
