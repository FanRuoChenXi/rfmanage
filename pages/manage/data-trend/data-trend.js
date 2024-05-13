import * as echarts from '../../../ec-canvas/echarts'
const chartsOption = require('../../../utils/chartsOption')

Page({
  data: {
    ec: {
      lazyLoad: true, // 懒加载
    },
  },

  async onLoad() {
    const pieData = await getPieData()
    this.initChart(pieData)
  },

  initChart(pieData) {
    // 绑定组件
    this.pieComponent = this.selectComponent('#mychart-dom-pie')
    // 初始化柱状图
    this.pieComponent.init((canvas, width, height, dpr) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr, // 解决模糊显示问题
      })
      chart.setOption(chartsOption.pieOption('资产状态', pieData)) // 根据从后端获取pieData数据,动态更新图表
      return chart
    })
  },
})

// 获取图表数据
async function getPieData() {
  const data = []
  const nameText = {}
  const [res, err] = await wx.$get('statuslabels/assets/name')
  if (err) return wx.$msg(err)
  const { labels, datasets } = res
  labels.forEach((e) => {
    const dataArr = e.split(' (')
    const name = dataArr[0]
    const value = dataArr[1].split(')')[0]
    data.push({
      value,
      name,
    })
  })
  return data
}
