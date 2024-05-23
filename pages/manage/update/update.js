//Page Object
Page({
  data: {
    pickerName: '', // 显示选择器类型
    companyValue: [], // 企业
    companyText: '',
    company: [],
    userValue: [], // 用户
    userText: '',
    user: [],
    locationValue: [], // 位置
    locationText: '',
    location: [],
    modelCategoryValue: [], // 类别
    modelCategoryText: '',
    modelCategory: [],

    categoryName: '', // 类别名称

    userFirstName: '', // 用户名称
    userLastName: '',
    userPassword: '', // 密码

    manufacturerName: '', // 制造商名称
    manufacturerUrl: '', // 制造商网址
    manufacturerSupportUrl: '', // 售后网址
    manufacturerSupportPhone: '', // 售后电话
    manufacturerSupportEmail: '', // 售后邮箱

    departmentName: '', // 部门名称
    departmentPhone: '', // 部门电话

    modelName: '', // 模型名称
    modelNumber: '', // 模型编号

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
  },

  async onLoad(query) {
    this.setData({ mode: query['key'], id: query['id'] })
    const url = `${query['key']}/${query['id']}`
    wx.$loading('加载中...')
    const [res, err] = await wx.$get(url)
    if (err) return wx.$msg(err)
    switch (query['key']) {
      case 'categories':
        this.setCategoryData(res)
        break
      case 'users':
        this.setUserData(res)
        break
      case 'manufacturers':
        this.setManufacturerData(res)
        break
      case 'departments':
        this.setDepartmentData(res)
        break
      case 'models':
        this.setModelData(res)
        break
      case 'statuslabels':
        this.setStatusLabelData(res)
        break
      case 'companies':
        this.setCompanyData(res)
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
      case 'categories':
        param = {
          name: this.data.categoryName,
        }
        break
      case 'users':
        param = {
          first_name: this.data.userFirstName,
          last_name: this.data.userLastName,
          password: this.data.userPassword,
        }
        break
      case 'manufacturers':
        param = {
          name: this.data.manufacturerName,
          url: this.data.manufacturerUrl,
          support_url: this.data.manufacturerSupportUrl,
          support_phone: this.data.manufacturerSupportPhone,
          support_email: this.data.manufacturerSupportEmail,
        }
        break
      case 'departments':
        param = {
          name: this.data.departmentName,
          company_id: this.data.companyValue[0],
          phone: this.data.departmentPhone,
          manager_id: this.data.userValue[0],
          location_id: this.data.locationValue[0],
        }
        break
      case 'models':
        param = {
          name: this.data.modelName,
          model_number: this.data.modelNumber,
          category_id: this.data.modelCategoryValue[0],
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
        }
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
          wx.$push('back', { delta: 1 })
        } else {
          wx.$msg(response.errMsg)
        }
      },
      fail: (error) => {
        console.log(error)
      },
    })
  },

  // 类别数据
  setCategoryData(res) {
    const categoryName = res['name']
    const categoryType = res['categoryType']
    this.setData({ categoryName, categoryType })
  },

  // 用户数据
  setUserData(res) {
    const userFirstName = res['firstName']
    const userLastName = res['lastName']
    this.setData({ userFirstName, userLastName })
  },

  // 制造商数据
  setManufacturerData(res) {
    const manufacturerName = res['name']
    const manufacturerUrl = res['url']
    const manufacturerSupportUrl = res['supportUrl']
    const manufacturerSupportPhone = res['supportPhone']
    const manufacturerSupportEmail = res['supportEmail']
    this.setData({
      manufacturerName,
      manufacturerUrl,
      manufacturerSupportUrl,
      manufacturerSupportPhone,
      manufacturerSupportEmail,
    })
  },

  // 部门数据
  setDepartmentData(res) {
    const departmentName = res['name']
    const departmentCompany = res['company'] == null ? '' : res['company']
    const departmentPhone = res['phone'] == null ? '' : res['phone']
    const departmentManager = res['manager'] == null ? '' : res['manager']
    const departmentLocation = res['location']
    this.setData({
      departmentName,
      departmentPhone,
      companyText: departmentCompany,
      userText: departmentManager,
      locationText: departmentLocation['name'],
    })
  },

  // 模型数据
  setModelData(res) {
    const modelName = res['name']
    const modelCategory = res['category']
    const modelNumber = res['modelNumber']
    this.setData({
      modelName,
      modelCategoryText: modelCategory['name'],
      modelNumber,
    })
  },

  // 状态标签数据
  setStatusLabelData(res) {
    const statusLabelName = res['name']
    const statusLabelType = res['type']
    const statusValue = {
      deployable: '部署',
      undeployable: '不可部署',
      pending: '待定',
      archived: '已存档',
    }
    this.setData({
      statusLabelName,
      statusTypeText: statusValue[statusLabelType],
    })
  },

  // 企业数据
  setCompanyData(res) {
    const companyName = res['name']
    const companyPhone = res['phone']
    const companyEmail = res['email']
    this.setData({
      companyName,
    })
  },

  // 选择企业
  async onCompanyPicker() {
    const company = []
    const [res, err] = await wx.$get('companies') // 获取企业列表
    if (err) return wx.$msg(err)
    const { total, rows } = res
    rows.forEach((e) => {
      company.push({
        label: e['name'],
        value: e['id'],
      })
    })
    this.setData({ pickerName: 'company', company })
  },

  // 选择用户
  async onUserPicker() {
    const param = {
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const user = []
    const [res, err] = await wx.$get('users', param) // 获取企业列表
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

  // 选择位置
  async onLocationPicker() {
    const param = {
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'asc',
    }
    const location = []
    const [res, err] = await wx.$get('locations', param) // 获取企业列表
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
    const [res, err] = await wx.$get('categories', param) // 获取类别列表
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
