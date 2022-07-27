

const w = 900;
const h = 500;
const padding = 60;

const main = d3.select('body')
               .attr('class','d-flex justify-content-center align-items-center')
               .append('div')
               .attr('class','main');
            
            main.append('h1')
               .attr('id','title')
               .text('Doping in Professional Bicycle Racing');
               
            main.append('h2')
               .attr('id','subtitle')
                .text("35 Fastest times up Alpe d'Huez");

const tooltip = main.append('div')
                    .attr('id','tooltip');    

const svg = main.append('svg')
                .attr('width',w)
                .attr('height',h)
            
         svg.append('text')
            .text('Time in Minutes')
            .attr('fill','white')
            .attr('transform','rotate(-90)')
            .attr('x',-180)
            .attr('y',15)

const legend = svg.append('g')
                  .attr('id','legend')
                  
                  
                  legend.append('text')
                        .text('No doping allegations')
                        .attr('fill','white')
                        .attr('x',650  )
                        .attr('y',200);

                  legend.append('rect')   
                        .attr('width', '15px')
                        .attr('height','15px')
                        .attr('fill','rgb(255, 228, 152)')
                        .attr('x',810)
                        .attr('y',188);

                  legend.append('text')
                        .text('Riders with doping allegations')
                        .attr('fill','white')
                        .attr('x',594)
                        .attr('y',225);

                  legend.append('rect')   
                        .attr('width', '15px')
                        .attr('height','15px')
                        .attr('fill','#88DBFF')
                        .attr('x',810)
                        .attr('y',213);
                        
                    

const req = new XMLHttpRequest();

    req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true)
    req.send()
    req.onload = function(){
        const json = JSON.parse(req.responseText);
        console.log(json)
        const xScale = d3.scaleTime()
                         .domain([new Date(d3.min(json,d=>d.Year) -1,1,1), new Date(d3.max(json,d=>d.Year),12,1)])
                         .range([padding,w-padding]);
        const yScale = d3.scaleTime()
                         .domain([d3.max(json,d=> d.Seconds*1000), d3.min(json,d=> d.Seconds*1000)])
                         .range([ h-padding , padding])
                         .nice();
         
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale)
                        .tickFormat(d3.timeFormat("%M:%S"));
   
            svg.append('g')
               .attr('id','x-axis')
               .attr('transform','translate(0,' + (h-padding) + ')')
               .call(xAxis);

            svg.append('g')
               .attr('id','y-axis')
               .attr('transform','translate(' + padding + ',0)')
               .call(yAxis);
            
            svg.selectAll('circle')
               .data(json)
               .enter()
               .append('circle')
               .attr('class','dot')
               .attr('cx',d => xScale(new Date(d.Year,1,1)))
               .attr('cy',d => yScale(d.Seconds*1000))
               .attr('data-xvalue', d => d.Year)
               .attr('data-yvalue',d => new Date(d.Year,1,1,1,d.Seconds/60,d.Seconds%60))
               .attr('r', 6)
               .attr('fill', d => {
                  return d.Doping === '' ? '#FFE498':'#88DBFF'
               })
               .on('mouseover', function(event,d){
                  tooltip.style('visibility','visible')
                         .attr('data-year', d.Year)
                         .html(d.Name + ': ' + d.Nationality + '<br>Year: ' + d.Year + ', Time: ' + d.Time + (d.Doping === '' ? '':'<br><br>') + d.Doping)
                         .style('left', event.x + 'px')
                         .style('top', event.y + 'px' )
               })
               .on('mouseout', function(){
                  tooltip.style('visibility','hidden')
               });
            
    }
                       