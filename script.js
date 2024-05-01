const width = 1200;
const height = 1200;
const radius = Math.min(width/2, height/2) / 2;
const arcHover = d3.arc()
    .outerRadius(radius+10)  // This arc is slightly larger
    .innerRadius(0);

const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);
    const data = [
        {name: "Competency 1", value: 1},
        {name: "Competency 2", value: 1},
        {name: "Competency 3", value: 1},
        {name: "Competency 4", value: 1},
        {name: "Competency 5", value: 1},
        // Add more competencies as needed
    ];
    
const color = d3.scaleOrdinal(d3.schemeCategory10);

const pie = d3.pie()
    .value(d => d.value);

const path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

const arc = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc');

    arc.append('path')
    .attr('d', path)
    .attr('fill', d => color(d.data.name))
    .on('mouseover', function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('d', arcHover);  // Use the larger arc on hover

        // Calculate the centroid and display the tooltip there
        const [x, y] = arcHover.centroid(d);
        svg.append('text')
            .attr('class', 'tooltip')
            .attr('x', x)  // Position the text at the centroid x
            .attr('y', y)  // Position the text at the centroid y
            .attr('text-anchor', 'middle')  // Center the text at the centroid
            .attr('alignment-baseline', 'middle')  // Align the text vertically
            .text(d.data.name);  // Set text to the name of the competency
    })
    .on('mouseout', function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('d', path);  // Revert to original arc size

        svg.select('.tooltip').remove();  // Remove the tooltip text
    });

arc.on('click', function(event, d) {
    alert(`You clicked on ${d.data.name}`);
    // You can update this part to open a modal or display detailed info somewhere on the page.
});

