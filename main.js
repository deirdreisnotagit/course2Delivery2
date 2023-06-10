const margin = {top: 45, right: 30, bottom: 50, left: 80};
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const padding = 1; // Vertical space between the bars of the histogram
const barsColor = 'steelblue';

// Load data here
d3.csv('/data/pay_by_gender_tennis.csv').then(data => {
  console.log('data', data);
  
  // Format and isolate earnings


   // Format and isolate earnings
   //const earnings = [];
   data.forEach(datum => {
     // Earnings: Remove commas and convert to integer
  const earning = +datum.earnings_USD_2019.replaceAll(',' , '') ;
    //  earnings.push(earning);
   });

 
 
  createViolin(data);
});


// Create Visualization
// Create Split Violin Plot
const createViolin = function (data) {

  const myMen = [];
  const myLadies=[];
  data.forEach(datum => {
  (datum.gender === 'men') ? myMen.push(+datum.earnings_USD_2019): myLadies.push(+datum.earnings_USD_2019)  ; 
  });
console.log('myMen' , myMen)
console.log('myLadies' ,myLadies)


  // Generate Bins
 const binsM = d3.bin().thresholds(17)(myMen);
 const binsL = d3.bin().thresholds(12)(myLadies);

 console.log('bins M', binsM);
 console.log('bins L', binsL);
 
 

  // Append svg
  const svg = d3.select('#viz')  
    .append('svg')
      .attr('viewbox', [0,0,width,height])
      .attr('width', width)
      .attr('height', height);


  // Create Scales
 // get max lenght
 const maxLenL = d3.max(binsL, d => d.length);
 const maxLenM = d3.max(binsM, d => d.length);
 // console.log('max M + L length', maxLenM, maxLenL )
 const halfwidth = 200;
 // get max values
 const maxL = binsL[binsL.length - 1].x1; // top value in L
 const maxM = binsM[binsM.length - 1].x1; // top value in M
 // console.log('max M + L values', maxM, maxL )
  const xScale = d3.scaleLinear()
    .domain([0, Math.max(maxLenL, maxLenM)])
    .range([0, width - margin.left - margin.right - halfwidth -  halfwidth/2]);
  const yScale = d3.scaleLinear()
    .domain([0, Math.max(maxL, maxM)])
    .range([height - margin.bottom, margin.top]); // Vertical position is calculated Top to Bottom in the svg world
    

// draw a line for the y axis, going the width of the graph

 svg
  .append('line')
  .attr("x1", margin.left)
  .attr("x2", width - margin.right)
  .attr("y1", height - margin.bottom)
  .attr("y2", height - margin.bottom)
  .attr('stroke', "#3B3B39")
  .attr('stroke-width', 1);


  // Append y-axis
  const yAxis = d3.axisLeft( yScale )
    .ticks( 17 )
    .tickSizeOuter( 0 );
  const yAxisGroup = svg
    .append('g')
      .attr('class', 'y-axis-group')
      .attr('transform', `translate(${margin.left}, 0 )`)
      .style('font-size', '13px')
    .call(yAxis);
  yAxisGroup
    .append('text')
      .attr('text-anchor', 'start')
      .attr('x',  margin.left /2 ) // Need to take into account the horizontal translation that was already applied to xAxisGroup
      .attr('y', margin.top / 2 )
      .text('Earnings of the top tennis players in 2019 (USD)')
      .attr('fill', '#3B3B39')
      .style('font-size', '16px')
      .style('font-weight', 700);

      binsM.unshift([0, 0]);
      binsM.push([0, 17000000]);
      binsL.unshift([0, 0]);
      binsL.push([0, 12000000]); 
  // Append area on histogram (density plot)
      const mAreaGenerator = d3.area()
      .x0( margin.left + halfwidth)
      .x1((d, i) => {
        if (i === 0 || i === binsM.length - 1) {
          return xScale(d[0]) + margin.left + halfwidth;
      } else {
        return xScale(d.length) + margin.left + halfwidth;
      } 
      })
      .y((d, i) => {
        if (i === 0 || i === binsM.length - 1){
          return yScale(d[1]);
      } else {
      // return (yScale(d.x0) + yScale(d.x1 - d.x0) - padding) /2 ;
       return yScale(d.x0) + (yScale(d.x1) - yScale(d.x0) - padding) / 2;
      
      }
      })
      .curve(d3.curveCatmullRom);  
  svg
    .append('path')
      .attr('d', mAreaGenerator(binsM) )
      .attr('fill', '#F2C53D')
      .attr('fill-opacity', 0.8)
      .attr('stroke', 'none');

      const fAreaGenerator = d3.area()
      .x0((d, i) => {
        if (i === 0 || i === binsL.length - 1) {
          return halfwidth + margin.left ;
      } else {
        return  margin.left + halfwidth - xScale(d.length) ;
      } 
      })
      .x1(halfwidth + margin.left)
      .y((d, i) => {
        if (i === 0 || i === binsL.length - 1){
          return yScale(d[1]);
      } else {
      // return (yScale(d.x0) + yScale(d.x1 - d.x0) - padding) /2 ;
       return yScale(d.x0) + (yScale(d.x1) - yScale(d.x0) - padding) / 2;
      
      }
      })
      .curve(d3.curveCatmullRom);  
  svg
    .append('path')
      .attr('d', fAreaGenerator(binsL) )
      .attr('fill', '#A6BF4B')
      .attr('fill-opacity', 0.8)
      .attr('stroke', 'none');

};





