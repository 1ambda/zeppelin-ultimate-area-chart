import HumanFormat from 'human-format'

export const CommonParameter = {
  'graphLineThickness': { valueType: 'int', defaultValue: 1, description: 'thickness for graph line', },
  'graphLineAlpha': { valueType: 'int', defaultValue: 0.5, description: 'alpha for graph line', },
  'graphFillAlpha': { valueType: 'int', defaultValue: 0.4, description: 'alpha for graph area', },
  'bulletType': { valueType: 'string', defaultValue: 'none', description: 'type of bullet', widget: 'option', optionValues: [ 'none', 'round', 'round-white', ], },
  'balloonType': { valueType: 'string', defaultValue: 'simple', description: 'type of balloon', widget: 'option', optionValues: [ 'simple', 'color', 'drop-shaped', ], },
  'yAxisValueInside': { valueType: 'boolean', defaultValue: true, description: 'show yAxis value inside of plot', widget: 'checkbox', },
  'yAxisValueFormat': { valueType: 'string', defaultValue: 'none', description: 'the format of yAxis value', widget: 'option', optionValues: [ 'none', 'no-comma', 'compact-int', 'binary-size', 'second', ], },
  'yAxisValuePrecision': { valueType: 'int', defaultValue: 2, description: 'yAxisValue precision that for <code>compact-int</code>, <code>binary-size</code>, <code>second</code>', },
  'showXAxisScroll': { valueType: 'boolean', defaultValue: false, description: 'show xAxis scroll', widget: 'checkbox', },
  'showYAxisScroll': { valueType: 'boolean', defaultValue: true, description: 'show yAxis scroll', widget: 'checkbox', },
  'xAxisPosition': { valueType: 'string', defaultValue: 'bottom', description: 'xAxis position', widget: 'option', optionValues: [ 'bottom', 'top', ], },
  'yAxisPosition': { valueType: 'string', defaultValue: 'left', description: 'yAxis position', widget: 'option', optionValues: [ 'left', 'right', ], },
  'balloonText': { valueType: 'string', defaultValue: '', description: 'text format of balloon (<a href="https://docs.amcharts.com/3/javascriptcharts/AmGraph#balloonText">doc</a>)', },
  'legendValueText': { valueType: 'string', defaultValue: '', description: 'text format of legend (<a href="https://docs.amcharts.com/3/javascriptcharts/AmGraph#legendValueText">doc</a>)', },
  'hideBulletsCount': { valueType: 'int', defaultValue: 50, description: 'bullets will be shown until this count', },
  'yAxisGuides': { valueType: 'JSON', defaultValue: '', description: 'guides of yAxis (<a href="https://docs.amcharts.com/3/javascriptcharts/ValueAxis#guides">doc</a>) (<a href="https://www.amcharts.com/demos/logarithmic-scale/">example</a>)', widget: 'textarea', },
  'trendLines': { valueType: 'JSON', defaultValue: '', description: 'trend lines (<a href="https://docs.amcharts.com/3/javascriptcharts/TrendLine">doc</a>) (<a href="https://www.amcharts.com/demos/trend-lines/">example</a>)', widget: 'textarea', },
  'mainTitle': { valueType: 'string', defaultValue: '', description: 'main title of chart', },
  'subTitle': { valueType: 'string', defaultValue: '', description: 'sub title of chart', },
  'xAxisName': { valueType: 'string', defaultValue: '', description: 'name of xAxis', },
  'yAxisName': { valueType: 'string', defaultValue: '', description: 'name of yAxis', },
  'xAxisUnit': { valueType: 'string', defaultValue: '', description: 'unit of xAxis', },
  'yAxisUnit': { valueType: 'string', defaultValue: '', description: 'unit of yAxis', },
  'logarithmicYAxis': { valueType: 'boolean', defaultValue: false, description: 'use logarithmic scale in yAxis', widget: 'checkbox', },
  'rotateXAxisLabel': { valueType: 'string', defaultValue: 'none', description: 'rotate xAxis labels', widget: 'option', optionValues: [ 'none', '+90', '-90', ], },
  'showLegend': { valueType: 'boolean', defaultValue: true, description: 'show legend', widget: 'checkbox', },
  'legendPosition': { valueType: 'string', defaultValue: 'bottom', description: 'position of legend', widget: 'option', optionValues: [ 'bottom', 'top', 'left', 'right', ], },
  'inverted': { valueType: 'boolean', defaultValue: false, description: 'invert x and y axes', widget: 'checkbox', },
  'graphType': { valueType: 'string', defaultValue: 'line', description: 'graph type', widget: 'option', optionValues: [ 'line', 'smoothedLine', ], },
  'dateFormat': { valueType: 'string', defaultValue: '', description: 'format of date (<a href="https://docs.amcharts.com/3/javascriptcharts/AmGraph#dateFormat">doc</a>) (e.g YYYY-MM-DD)', },
}

export function createCommonChartGraphs(parameter, selectors) {

  let {
    graphLineThickness, graphLineAlpha, graphFillAlpha,
    xAxisUnit, yAxisUnit, graphType,
    bulletType, hideBulletsCount, balloonType, balloonText, legendValueText,
  } = parameter

  let counter = 1
  const graphs = []

  let defaultBalloonText = `[[title]]: <b>[[value]]</b> ${yAxisUnit}`
  let defaultLegendValueText = (yAxisUnit) ? `[[value]] ${yAxisUnit}` : '[[value]]'

  for (let selector of selectors) {
    const g = {
      id: `g${counter}`,
      title: selector,
      valueField: selector,
      bulletSize: 5,
      hideBulletsCount,
      lineThickness: graphLineThickness,
      fillAlphas: graphFillAlpha,
      lineAlpha: graphLineAlpha,
    }

    if (graphType) { g.type = graphType }

    if (bulletType === 'round') {
      g.bullet = 'round'
    } else if (bulletType === 'round-white') {
      g.bullet = 'round'
      g.bulletBorderAlpha = 1
      g.bulletColor = '#FFFFFF'
      g.useLineColorForBulletBorder = true
    }

    if (balloonType === 'color') {
      g.balloon = { adjustBorderColor: false, color: '#ffffff' }
    } else if (balloonType === 'drop-shaped') {
      g.balloon = { adjustBorderColor: false, color: '#ffffff', drop: true, }
      defaultBalloonText = '[[value]]'
    }

    if (balloonText.trim()) { defaultBalloonText = balloonText }
    if (legendValueText.trim()) { defaultLegendValueText = legendValueText }

    g.balloonText = defaultBalloonText
    g.legendValueText = defaultLegendValueText

    graphs.push(g)

    counter = counter + 1
  }

  return graphs
}
export function createCommonChartOption(graphs, data, parameter, keyColumnName) {
  const {
    dateFormat,
    inverted, logarithmicYAxis, rotateXAxisLabel,
    balloonType, showLegend, legendPosition,
    xAxisPosition, yAxisPosition, showXAxisScroll, showYAxisScroll,
    yAxisGuides, trendLines,
    xAxisName, yAxisName, yAxisValueFormat, yAxisValuePrecision, yAxisValueInside,
    mainTitle, subTitle,
  } = parameter

  const option = {
    path: 'https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.21.0/',
    type: 'serial',
    theme: 'light',
    rotate: inverted,
    marginRight: 15,
    marginLeft: 15,
    autoMarginOffset: 20,
    dataDateFormat: (dateFormat) ? dateFormat : undefined,
    categoryField: keyColumnName,
    categoryAxis: {
      parseDates: (dateFormat), dashLength: 1, minorGridEnabled: true,
      title: (xAxisName) ? xAxisName : undefined,
      position: xAxisPosition,
      labelRotation: (rotateXAxisLabel === 'none') ? 0 : (rotateXAxisLabel === '+90') ? 90 : -90,
    },
    trendLines: (Array.isArray(trendLines)) ? trendLines : [],
    valueAxes: [{
      id: 'v1', axisAlpha: 0, ignoreAxisWidth: true,
      title: (yAxisName !== '') ? yAxisName : undefined,
      position: yAxisPosition,
      guides: (Array.isArray(yAxisGuides)) ? yAxisGuides : [],
      logarithmic: logarithmicYAxis,
    }],
    graphs: graphs,
    balloon: { borderThickness: 0.8, shadowAlpha: 0 },
    chartCursor: {
      valueLineEnabled: true,
      valueLineBalloonEnabled: true,
      cursorAlpha: 1,
      cursorColor: '#258cbb',
      valueLineAlpha: 0.2,
      zoomable: true,
      valueZoomable: false,
    },
    export: { enabled: true },
    responsive: { enabled: true },
    dataProvider: data,
  }

  if (showLegend) {
    option.legend = { align: 'center', equalWidths: true, position: legendPosition, }
  }

  if (balloonType === 'drop-shaped') { option.balloon.borderThickness = 0.3 }

  if (showXAxisScroll) {
    option.chartScrollbar = {
      autoGridCount: true,
      graph: "g1",
      scrollbarHeight: 40,
      backgroundAlpha: 0.15,
      backgroundColor: '#868686',
      selectedBackgroundAlpha: 0.3,
      selectedBackgroundColor: '#757586',
    }
  }

  setYAxisValueFormatForAmcharts(option, yAxisValueFormat, yAxisValuePrecision)

  if (showYAxisScroll) {
    option.valueScrollbar = {
      oppositeAxis: false, offset: 15, scrollbarHeight: 10,
      backgroundAlpha: 0.15,
      backgroundColor: '#868686',
      selectedBackgroundAlpha: 0.3,
      selectedBackgroundColor: '#757586',
    }
  }

  if (yAxisValueInside) { option.valueAxes[0].inside = true }

  if (mainTitle !== '') { option.titles = [{ text: mainTitle, }] }
  if (subTitle !== '') {
    if (typeof option.titles === 'undefined') { option.titles = [] }
    option.titles.push({ text: subTitle, bold: false, })
  }

  return option
}

export function setYAxisValueFormatForAmcharts(option, yAxisValueFormat, yAxisValuePrecision) {
  // `labelFunction` https://docs.amcharts.com/3/javascriptcharts/ValueAxis#labelFunction
  // `HumanFormat` https://github.com/JsCommunity/human-format
  if (yAxisValueFormat === 'no-comma') {
    option.valueAxes[0].labelFunction = (value) => {
      return value
    }
  } else if (yAxisValueFormat === 'compact-int') {
    option.valueAxes[0].labelFunction = (value) => {
      try {
        value = HumanFormat(value, { decimals: yAxisValuePrecision, })
      } catch (error) { /** ignore */ }
      return value
    }
  } else if (yAxisValueFormat === 'binary-size') {
    option.valueAxes[0].labelFunction = (value) => {
      try {
        value = HumanFormat(value, { scale: 'binary', unit: 'B', decimals: yAxisValuePrecision, })
      } catch (error) { /** ignore */ }
      return value
    }
  } else if (yAxisValueFormat === 'second') {
    var timeScale = new HumanFormat.Scale({
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
      months: 2592000,
      years: 31104000,
    })
    option.valueAxes[0].labelFunction = (value) => {
      try {
        value = HumanFormat(value, { scale: timeScale, decimals: yAxisValuePrecision, })
      } catch (error) { /** ignore */ }
      return value
    }
  }
}
