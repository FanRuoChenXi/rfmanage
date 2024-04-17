Component({
  properties: {
    tabBarValue: {
      type: String,
      default: 'home',
    },
  },

  data: {
    list: [
      { value: 'home', label: '首页' },
      { value: 'search', label: '查询' },
      { value: 'manage', label: '管理' },
      { value: 'user', label: '我的' },
    ],
  },

  methods: {
    onTabBarChange(e) {
      const value = e.detail.value
      console.log(value, this.data.tabBarValue)
      if (value == this.data.tabBarValue) return false
      switch (value) {
        case 'home':
          return wx.$replace('/pages/basic/dashboard')
        case 'search':
          return wx.$replace('/pages/search/search')
        case 'manage':
          return wx.$replace('/pages/manage/manage')
        case 'user':
          return wx.$replace('/pages/user/user')
      }
    },
  },
})
