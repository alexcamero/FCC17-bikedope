

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const W = 900;
const H = 600;
const pad = 70;


const svg = d3.select("body")
.append("div")
.attr("id","main")
.append("svg")
.attr("width", W)
.attr("height", H);

fetch(url).then(response => response.json())
.then(data => {

  const xScale = d3.scaleLinear()
  .domain([d3.min(data, (d) => d.Year),d3.max(data, (d) => d.Year)])
  .range([pad,W - pad]);
  
  const yScale = d3.scaleLinear()
  .domain([d3.min(data, (d) => d.Seconds),d3.max(data, (d) => d.Seconds)])
  .range([pad, H - pad]);
  
  const xAxis = d3.axisBottom(xScale).ticks(12,"d");
  
  const yAxis = d3.axisLeft(yScale).ticks(11)
  .tickFormat((d) => {
    const sec = d % 60;
    const min = (d - sec) / 60;
    return `${min}:${('0' + sec).slice(-2)}`;
  });

  svg.append("g")
  .attr("id","x-axis")
  .attr("transform",`translate(0,${H-pad})`)
  .call(xAxis);
  
  svg.append("g")
  .attr("id","y-axis")
  .attr("transform",`translate(${pad},0)`)
  .call(yAxis);
  
  svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr("class","dot")
  .attr("data-xvalue", (d) => d.Year)
  .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
  .attr("name", (d) => d.Name)
  .attr("nationality", (d) => d.Nationality)
  .attr("time", (d) => d.Time)
  .attr("blurb", (d) => d.Doping)
  .attr('cx', (d) => xScale(d.Year))
  .attr('cy', (d) => yScale(d.Seconds))
  .attr("r", 5)
  .attr("fill", (d) => d.Doping != "" ? "red" : "blue")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);
  
  svg.append("text")
  .text("Time in Minutes")
  .attr("transform", `translate(${pad/3}, ${H/3}) rotate(-90)`);
  
  svg.append("text")
  .text("Doping and Biking")
  .attr("id","title")
  .attr("x", W/2)
  .attr("y", pad/2)
  .attr("text-anchor","middle")
  .style("font-size", 40);
  
  const legend = svg.append("g")
  .attr("id","legend")
  
  legend.append("rect")
  .attr("fill", "white")
  .attr("x", W - 3*pad)
  .attr("y", pad + H/8)
  .attr("width", W/6 - 0.5 * pad)
  .attr("height", H/8 - 0.25 * pad);
  
  legend.append("text")
  .text("No dope")
  .attr("x", W - 2.8*pad)
  .attr("y", 1.3*pad + H/8);
  
  legend.append("circle")
  .attr("fill", "blue")
  .attr("r", 5)
  .attr("cx", W - 1.8 * pad)
  .attr("cy", 1.24*pad + H/8);
  
  legend.append("text")
  .text("Yes dope")
  .attr("x", W - 2.8*pad)
  .attr("y", 1.6*pad + H/8);
  
  legend.append("circle")
  .attr("fill", "red")
  .attr("r", 5)
  .attr("cx", W - 1.8 * pad)
  .attr("cy", 1.54*pad + H/8);
  
  const tooltip = d3.select("body").append("div")
  .attr("id", "tooltip");
  
  function handleMouseOver(event) {
    const year = d3.select(this).attr("data-xvalue");
    const name = d3.select(this).attr("name");
    const nationality = d3.select(this).attr("nationality");
    const time = d3.select(this).attr("time");
    const blurb = d3.select(this).attr("blurb");
    
    tooltip
    .attr("data-year", year)
    .html(`<h2>${name}: ${nationality}<br>Year: ${year}, Time: ${time}</h2><p>${blurb}</p>`)
    .style("display","flex")
    .style("left", `${event.pageX + 20}px`)
    .style("top", `${event.pageY}px`);
  }
  
  function handleMouseOut() {
    tooltip
    .style("display","none");
  }
  
  
});

