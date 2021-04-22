// Joshua Hutchinson
// Code structure from Forge Envision Spring 2021 Examples

d3.csv('sect_02_table.05.csv').then((data) => {
     
    // Map data
    data.map((d) => {
        d.diagnosisYear = +d.diagnosisYear;
        d.allRacesBothSexes = +d.allRacesBothSexes;
        d.allRacesMales = +d.allRacesMales;
        d.allRacesFemales = +d.allRacesFemales;
        d.whitesBothSexes = +d.whitesBothSexes;
        d.whitesMales = +d.whitesMales;
        d.whitesFemales = +d.whitesFemales;
        d.blacksBothSexes = d.blacksBothSexes;
        d.blacksMales = d.blacksMales;
        d.blacksFemales = d.blacksFemales;
    });

    // Set up margins
    const margin = {left:100, top:100, right:50, bottom:100};

    const outerHeight = 800;
    const height = outerHeight - margin.top - margin.bottom;
    
    let outerWidth = 1500;
    let width = outerWidth - margin.left - margin.right;
        
    // Create svg and canvas
    const svg = d3.select("body").append("svg")
                .attr("height", outerHeight)
                .attr("width", outerWidth)
                .style("border", "1px solid black")
                .style("background", "white");

    const canvas  = svg.append("g")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    let draw = (dataset) => {
        
        // Scales
        let xScale = d3.scaleLinear()
                    .domain([1974, 2018])
                    .range([0, width]);
        const minRate = d3.min(dataset, d => d.allRacesBothSexes);
        const maxRate = d3.max(dataset, d => d.allRacesBothSexes);
        const yScale = d3.scaleLinear()
                    .domain([minRate - 5, maxRate + 5])
                    .range([height, 0]);

        // Axes
        const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d")); // From stackoverflow.com
        const yAxis = d3.axisLeft().scale(yScale);

        const xAxisGroup = canvas.append("g")
            .call(xAxis);

        const yAxisGroup = canvas.append("g")
            .call(yAxis);

        xAxisGroup.attr("transform", "translate(0, "+height+")");

        // Axis labels
        const xLabel = canvas.append("text")
            .text("Year")
            .style("text-anchor", "middle")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom / 2})`)
            .attr("dy", "1em")
            .style("fill", "black");

        const yLabel = canvas.append("text")
            .text("Rate per 100,000 People")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-90) translate("+-height / 2+"," +-margin.left+")")
            .attr("dy", "1em")
            .style("fill", "black");

        // Title
        const title = svg.append("text")
            .text("Rate of Cancer Incidence From 1975 to 2017")
            .style("text-anchor", "middle")
            .attr("transform", `translate(${width / 2 + margin.left}, 25)`)
            .attr("dy", "1em")
            .style("fill", "black")
            .style("font-size", 20);

        // Plot line
        const line = d3.line()
                        .x(d => xScale(d.diagnosisYear))
                        .y(d => yScale(d.allRacesBothSexes));

        canvas.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "lightpink")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Plot points
        const points = canvas.selectAll(".points")
                            .data(data)
                            .join("circle")
                            .attr("class", "points")
                            .attr("cx", d => xScale(d.diagnosisYear))
                            .attr("cy",  d => yScale(d.allRacesBothSexes))
                            .attr("r", 5)
                            .style("fill", "lightpink")
                            .style("stroke", "lightpink");

        // Tooltip
        const tooltip = d3.select("body").append("div")
                .attr("id", "complex-toooltip")
                .style("position", "absolute")
                .style("background-color", "white")
                .style("padding", "10px")
                .style("border", "1px solid black")
                .style("opacity", 0);

        let year = tooltip.append("div")
                        .text("Year: ");
        let yearSpan = year.append("span").style("font-weight", 600);
        let overall = tooltip.append("div")
                        .text("Overall: ");
        let overallSpan = overall.append("span")
                        .style("font-weight", 600);
        let male = tooltip.append("div")
                        .text("Male: ");
        let maleSpan = male.append("span")
                        .style("font-weight", 600);
        let female= tooltip.append("div")
                        .text("Female: ");
        let femaleSpan = female.append("span")
                        .style("font-weight", 600);

        // Tooltip hover functionality
        points.on("mouseover", function() {
            let thisPoint = d3.select(this)
            let thisData = thisPoint.data()[0];
            yearSpan.text(thisData.diagnosisYear);

            overallSpan.text(thisData.allRacesBothSexes);
            maleSpan.text(thisData.allRacesMales); 
            femaleSpan.text(thisData.allRacesFemales);

            tooltip.style("opacity", 1);
            thisPoint.style("opacity", 1);
            thisPoint.style("fill", "lightgray");
            })

        points.on("mouseout", function() {
            tooltip.style("opacity", 0);
            const thisPoint = d3.select(this);
                thisPoint.style("opacity", 1)
                thisPoint.style("fill", "lightpink");
            })

        points.on("mousemove", function(event) {
            tooltip.style("left", d3.pointer(event)[0] + 300 + 'px')
                    .style("top", d3.pointer(event)[1] + 340 + "px")
                    .style("pointer-events", "none");
            })

    }
    
    draw(data);
    
})