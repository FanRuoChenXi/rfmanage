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

    userFirstName: '', // 用户名称
    userLastName: '',
    userName: '',
    userPassword: '', // 用户密码
    userEmail: '', // 用户邮箱
    departmentValue: [], // 部门
    departmentText: '',
    department: [],

    manufacturerName: '', // 制造商名称
    manufacturerUrl: '', // 网址
    manufacturerSupportUrl: '', // 售后网址
    manufacturerSupportPhone: '', // 售后电话
    manufacturerSupportEmail: '', // 售后邮箱

    departmentName: '', // 部门名称
    locationValue: [], // 位置
    locationText: '',
    location: [],

    modelName: '', // 模型名称
    modelNumber: '', // 模型编号
    modelEol: 0, // 生命周期
    modelCategoryValue: [], // 模型类别
    modelCategoryText: '',
    modelCategory: [],

    statusLabelName: '', // 状态标签名称
    statusTypeValue: [], // 类别类型
    statusTypeText: '',
    statusType: [
      { label: '部署', value: 'deployable' },
      { label: '不可部署', value: 'undeployable' },
      { label: '待定', value: 'pending' },
      { label: '已存档', value: 'archived' },
    ],

    companyName: '', // 企业名称
    companyPhone: '', // 企业电话
    companyEmail: '', // 企业邮箱

    locationName: '', // 地点名称
    locationAddress: '', // 地址
    locationCity: '', // 城市
    locationState: '', // 区域
    locationCurrency: 'USD', // 货币种类
  },

  async onLoad(query) {
    this.setData({ mode: query['key'] })
  },

  // 新增
  async onCreateItem() {
    wx.$loading('提交中...')
    const { mode } = this.data
    let param = {}
    switch (mode) {
      case 'categories':
        param = {
          name: this.data.categoryName,
          categoryType: this.data.categoryTypeValue[0],
        }
        break
      case 'users':
        param = {
          firstName: this.data.userFirstName,
          lastName: this.data.userLastName,
          username: this.data.userName,
          password: this.data.userPassword,
          passwordConfirmation: this.data.userPassword,
          email: this.data.userEmail,
          department_id: this.data.departmentValue[0]
            ? this.data.departmentValue[0]
            : '',
        }
        break
      case 'manufacturers':
        param = {
          name: this.data.manufacturerName,
          url: this.data.manufacturerUrl,
          supportUrl: this.data.manufacturerSupportUrl,
          supportPhone: this.data.manufacturerSupportPhone,
          supportEmail: this.data.manufacturerSupportEmail,
        }
        break
      case 'departments':
        param = {
          name: this.data.departmentName,
          locationId: this.data.locationValue[0],
        }
        break
      case 'models':
        param = {
          name: this.data.modelName,
          categoryId: this.data.modelCategoryValue[0],
          modelNumber: this.data.modelNumber,
          eol: this.data.modelEol,
        }
        break
      case 'statuslabels':
        param = {
          name: this.data.statusLabelName,
          type: this.data.statusTypeValue[0],
        }
        break
      case 'companies':
        param = {
          name: this.data.companyName,
          phone: this.data.companyPhone,
          email: this.data.companyEmail,
        }
        break
      case 'locations':
        param = {
          name: this.data.locationName,
          address: this.data.locationAddress,
          city: this.data.locationCity,
          state: this.data.locationState,
          currency: this.data.locationCurrency,
        }
        break
    }
    const [res, err] = await wx.$post(mode, param)
    if (err) return wx.$msg(err || '创建失败')
    wx.$push('back', { delta: 1 })
  },

  // 选择类别类型
  onCategoryTypePicker() {
    this.setData({ pickerName: 'categoryType' })
  },

  // 选择模型类别
  async onModelCategoryPicker() {
    const param = {
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
      categoryType: 'asset',
    }
    const modelCategory = []
    const [res, err] = await wx.$get('categories', param)
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      modelCategory.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'modelCategory', modelCategory })
  },

  // 选择状态类型
  onStatusTypePicker() {
    this.setData({ pickerName: 'statusType' })
  },

  // 选择部门
  async onDepartmentPicker() {
    const department = []
    const [res, err] = await wx.$get('departments')
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      department.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'department', department })
  },

  // 选择位置
  async onLocationPicker() {
    const param = {
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const location = []
    const [res, err] = await wx.$get('locations', param)
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

  // 步进器
  modelEolChange(e) {
    this.setData({
      modelEol: e.detail.value,
    })
  },
})
