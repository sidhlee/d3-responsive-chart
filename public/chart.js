 // dataset for responsive label 
 const labels = [
  {
    x: new Date('03-15-2019'),
    y: .17,
    text: 'Test label 1',
    orient: 'right'
  },
  {
    x: new Date('10-25-2019'),
    y: .24,
    text: 'Test label 2',
    orient: 'right'
  }
];



const Chart = (function(/* window, d3 */) { // global objects. why?
  
  let svg, data, x, y, xAxis, yAxis, chartWrapper, line, path, locator,
  margin = {}, width, height, breakPoint = 768;

  d3.csv('../data.csv', d => { 
    return {// dsv(csv, tsv) takes cb to shape parsed data into object
      date: new Date(d.date),
      value: d.value
    }
  }).then(init); // load data, then initialize chart(v5 fetch API)

  // called once the data is loaded
  function init(csv) {
    data = csv;
    
    //initialize scales
    xExtent = d3.extent(data, d => d.date);
    yExtent = d3.extent(data, d => d.value);
    x = d3.scaleTime().domain(xExtent);
    y = d3.scaleLinear().domain(yExtent);
    
    /* moved x and y axis init into render()
    to change y axis based on window width */
    
    //the path generator for the line chart
    line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    //initialize svg
    svg = d3.select('#chart').append('svg');
    chartWrapper = svg.append('g');
    path = chartWrapper.append('path').datum(data).classed('line', true);
    chartWrapper.append('g').classed('x axis', true); // adds multiple classes
    chartWrapper.append('g').classed('y axis', true);

    // tooltip
    locator = chartWrapper.append('circle')
      .style('display','none')
      .attr('r', 10)
      .attr('fill', '#f00')
      .style('pointer-events', 'none');

   


    
    //render the chart
    render();
  }

  function render() {
  
    //get dimensions based on browser's content area
    updateDimensions(window.innerWidth);

    const md = window.innerWidth > breakPoint; // a la BS4
    //initialize axis
    xAxis = d3.axisBottom()
      .ticks(d3.timeMonth.every(md ? 1 : 2)); // show label for every 2nd month when !md
    yAxis = md ? d3.axisLeft() : d3.axisRight(); // inset y-axis label when !md

    
    // ** update x and y scales to new dimensions **
    x.range([0, width]);
    y.range([height, 0]);


    // update svg elements to new dimensions
    svg
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);
    chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // update the axis and line
    xAxis.scale(x);
    yAxis.scale(y);

    svg.select('.x.axis') // parent: chartWrapper
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);
    
    // text-anchor needs to be reset on resize
    svg.select('.y.axis')
      .attr('text-anchor', (md) ? 'end': 'start')
      .call(yAxis);

    path.attr('d', line);


    renderLabels()

    // implement tooltip (original example uses 'touchmove' event)
    svg.on('mousemove', onMouseMove) // listener works best when set at the top-level svg element
      
     
    const xToDataIndex = d3.scaleLinear()
      .domain([margin.left, margin.left + width]).range([0, data.length - 1]).clamp(true);

    function onMouseMove() {
      var xPos = d3.mouse(this)[0];
      var d = data[~~xToDataIndex(xPos)]; // ~~ is a bitwise double NOT operator. drops decimal points
      
      locator
        .attr('cx', x(d.date))
        .attr('cy', y(d.value))
        .style('display', 'block');

    }

  }

  function updateDimensions(winWidth) {
    margin.top = 20;
    margin.right = winWidth < breakPoint ? 0 : 50;
    margin.left = winWidth < breakPoint ? 10 : 50;
    margin.bottom = 50;

    width = winWidth - margin.left - margin.right;
    // height = 500 - margin.top - margin.bottom;
    height = .7 * width; // aspect ratio is 0.7
  }

  function renderLabels() {

    var _labels = chartWrapper.selectAll('text.label');
  
    if(_labels._groups[0].length > 0) {
      // labels already exist
      _labels // only update position with updated scales
        .attr('x', d => x(d.x)) 
        .attr('y', d => y(d.y))
    }
    else {
      _labels // or append label
        .data(labels)
        .enter().append('text') 
        .classed('label', true)
        .attr('x', d => x(d.x))
        .attr('y', d => y(d.y))
        .style('text-anchor', d => d.orient == 'right' ? 'start': 'end')
        .text(d => d.text);
    }
      
  }

  return {
    render: render
  }

})(/* window, d3 */);

window.addEventListener('resize', Chart.render);