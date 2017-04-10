import Visualization from 'zeppelin-vis'
import AdvancedTransformation from 'zeppelin-tabledata/advanced-transformation'

import 'amcharts3'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/themes/light'
import 'amcharts3/amcharts/plugins/responsive/responsive.min'

// TODO: ZEPPELIN-2088
// import 'amcharts3-export'
// import 'amcharts3-export/export.css'

import { CommonParameter, createCommonChartGraphs, createCommonChartOption, } from './chart/common'
import { StackedAreaParameter, createStackedAreaGraph, createStackedAreaChartOption, } from './chart/stacked'
import { PercentAreaParameter, createPercentAreaGraph, createPercentAreaChartOption, } from './chart/percent'
import { NoGroupParameter, createNoGroupChartData, createNoGroupChartOption, } from './chart/no-group'


export default class Chart extends Visualization {
  constructor(targetEl, config) {
    super(targetEl, config)

    const spec = {
      charts: {
        'area': {
          transform: { method: 'object', },
          sharedAxis: true,
          axis: {
            'xAxis': { dimension: 'multiple', axisType: 'key', },
            'yAxis': { dimension: 'multiple', axisType: 'aggregator'},
            'category': { dimension: 'multiple', axisType: 'group', },
          },
          parameter: CommonParameter,
        },

        'stacked': {
          transform: { method: 'object', },
          sharedAxis: true,
          axis: {
            'xAxis': { dimension: 'multiple', axisType: 'key', },
            'yAxis': { dimension: 'multiple', axisType: 'aggregator'},
            'category': { dimension: 'multiple', axisType: 'group', },
          },
          parameter: StackedAreaParameter,
        },

        'percent': {
          transform: { method: 'object', },
          sharedAxis: true,
          axis: {
            'xAxis': { dimension: 'multiple', axisType: 'key', },
            'yAxis': { dimension: 'multiple', axisType: 'aggregator'},
            'category': { dimension: 'multiple', axisType: 'group', },
          },
          parameter: PercentAreaParameter,
        },

        'no-group': {
          transform: { method: 'raw', },
          axis: {
            'xAxis': { dimension: 'single', axisType: 'unique', },
            'yAxis': { dimension: 'multiple', axisType: 'value', },
          },
          parameter: NoGroupParameter,
        },

      },
    }

    this.transformation = new AdvancedTransformation(config, spec)
  }

  getChartElementId() {
    return this.targetEl[0].id
  }

  getChartElement() {
    return document.getElementById(this.getChartElementId())
  }

  clearChart() {
    if (this.chartInstance) { this.chartInstance.clear() }
  }

  hideChart() {
    this.clearChart()
    this.getChartElement().innerHTML = `
        <div style="margin-top: 60px; text-align: center; font-weight: 100">
            <span style="font-size:30px;">
                Please set axes in
            </span>
            <span style="font-size: 30px; font-style:italic;">
                Settings
            </span>
        </div>`
  }

  showError(error) {
    this.clearChart()
    this.getChartElement().innerHTML = `
        <div style="margin-top: 60px; text-align: center; font-weight: 300">
            <span style="font-size:30px; color: #e4573c;">
                ${error.message} 
            </span>
        </div>`
  }

  drawLineChart(parameter, column, transformer) {
    if (column.aggregator.length === 0) {
      this.hideChart()
      return /** have nothing to display, if aggregator is not specified at all */
    }

    const { rows, keyColumnName, selectors, } = transformer()
    const graphs = createCommonChartGraphs(parameter, selectors)
    const chartOption = createCommonChartOption(graphs, rows, parameter, keyColumnName)

    this.clearChart()
    this.chartInstance = AmCharts.makeChart(this.getChartElementId(), chartOption)
  }

  drawDashedChart(parameter, column, transformer) {
    if (column.aggregator.length === 0) {
      this.hideChart()
      return /** have nothing to display, if aggregator is not specified at all */
    }

    const { rows, keyColumnName, selectors, } = transformer()

    const graphs = createStackedAreaGraph(parameter, selectors)
    const chartOption = createStackedAreaChartOption(graphs, rows, parameter, keyColumnName)

    this.clearChart()
    this.chartInstance = AmCharts.makeChart(this.getChartElementId(), chartOption)
  }

  drawStepChart(parameter, column, transformer) {
    if (column.aggregator.length === 0) {
      this.hideChart()
      return /** have nothing to display, if aggregator is not specified at all */
    }

    const { rows, keyColumnName, selectors, } = transformer()

    const graphs = createPercentAreaGraph(parameter, selectors)
    const chartOption = createPercentAreaChartOption(graphs, rows, parameter, keyColumnName)

    this.clearChart()
    this.chartInstance = AmCharts.makeChart(this.getChartElementId(), chartOption)
  }

  drawNoGroupChart(parameter, column, transformer) {
    const uniqueKeyColumns = column.custom['unique']
    const valueColumns = column.custom['value']

    if (!valueColumns || valueColumns.length === 0 ||
      !uniqueKeyColumns || uniqueKeyColumns.length !== 1) {
      this.hideChart()
      return /** have nothing to display */
    }

    const keyColumn = uniqueKeyColumns[0]

    const rows = transformer()
    const selectors = valueColumns.map(c => c.name)
    const data = createNoGroupChartData(rows, keyColumn, valueColumns)
    const graphs = createCommonChartGraphs(parameter, selectors)
    const chartOption = createNoGroupChartOption(graphs, data, parameter, keyColumn.name)

    this.clearChart()
    this.chartInstance = AmCharts.makeChart(this.getChartElementId(), chartOption)
  }

  render(data) {
    const {
      chartChanged, parameterChanged,
      chart, parameter, column, transformer,
    } = data

    if (!chartChanged && !parameterChanged) { return }

    try {
      if (chart === 'area') { this.drawLineChart(parameter, column, transformer) }
      else if (chart === 'stacked') { this.drawDashedChart(parameter, column, transformer) }
      else if (chart === 'percent') { this.drawStepChart(parameter, column, transformer) }
      else if (chart === 'no-group') { this.drawNoGroupChart(parameter, column, transformer) }
    } catch (error) {
      console.error(error)
      this.showError(error)
    }

  }

  getTransformation() {
    return this.transformation
  }
}







