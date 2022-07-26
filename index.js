

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
            
const svg = main.append('svg')
                .attr('width',w)
                .attr('height',h)

const req = new XMLHttpRequest();

    req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true)
    req.send()
    req.onload = function(){
        const json = JSON.parse(req.responseText);
        
                 
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
               });
            
    }
                       