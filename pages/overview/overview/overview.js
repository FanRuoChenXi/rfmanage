//Page Object
Page({
  data: {
    tabValue: '0',
  },

  // 选项卡更新
  async onTabChange(e) {
    const newValue = e.detail.value
    const { tabValue } = this.data
    if (tabValue == newValue) return false
    switch (newValue) {
      case '1':
        if (this.data['licensesList']) break
        const licensesList = await getActionList()
        this.setData({
          licensesList: licensesList,
        })
    }
    this.setData({
      tabValue: newValue,
    })
  },
})

// 获取许可证列表
async function getActionList() {
  const param = {
    limit: 5,
    offset: 0,
    sort: 'created_at',
    order: 'asc',
  }
  const [res, err] = await wx.$get('licenses', param) // 获取房单客人列表
  if (err) return wx.$msg(err)
  const { total, rows } = res
  const licensesList = []
  rows.forEach((e) => {
    licensesList.push({
      id: e['id'],
      name: e['name'],
      manufacturer: e['manufacturer'],
    })
  })
  return licensesList
}
