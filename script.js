// Set up the dimensions and radius of the pie chart
const width = 600;
const height = 600;
const radius = Math.min(width, height) / 2;

// Select the chart element and add an SVG container
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

// Define the data for each segment of the pie
const data = [
    { name: "Competency 1", value: 1, imageUrl: 'sample.jpg', linkUrl: 'http://example.com/link1', expanded: false },
    { name: "Competency 2", value: 1, imageUrl: 'sample2.jpg', linkUrl: 'http://example.com/link2', expanded: false },
    { name: "Competency 3", value: 1, imageUrl: 'sample3.jpg', linkUrl: 'http://example.com/link3', expanded: false }
];

// Set up color scale
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Define the pie layout
const pie = d3.pie()
    .value(d => d.value);

// Define the arc for regular and hover states
const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

const arcHover = d3.arc()
    .outerRadius(radius)  // Slightly larger for hover effect
    .innerRadius(0);

const arcExpanded = d3.arc()
    .outerRadius(radius - 5)  // Even larger for expanded state
    .innerRadius(0);

// Bind data to paths and create arc groups
const arcs = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc');

// Append paths to the arcs and set styles and interactions
arcs.append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.name))
    .on('mouseover', function (event, d) {
        console.log("Mouseover event on: ", d.data.name);  // Debugging log
        d3.select(this)
            .transition()
            .duration(200)
            .attr('d', arcHover);
        
            const [x, y] = arcHover.centroid(d);
            d3.select(this.parentNode)  // Append text to the parent group element
                .append('text')
                .attr('class', 'tooltip')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .style('fill', 'white')  // Set text color to ensure visibility
                .style('font-size', '14px')
                .style('pointer-events', 'none')  // Make sure the text doesn't interfere with hover
                .text(d.data.name);
    })
    .on('mouseout', function (event, d) {
        console.log("Mouseout event on: ", d.data.name);  // Debugging log
        d3.select(this)
            .transition()
            .duration(200)
            .attr('d', d.data.expanded ? arcExpanded : arc);

        d3.select(this.parentNode).select('.tooltip').remove();
    })
    .on('click', function (event, d) {
        console.log("Click event on: ", d.data.name);  // Debugging log
        const thisPath = d3.select(this);
        const alreadyExpanded = d.data.expanded;
        svg.selectAll('.arc path').each(function (p) {
            p.data.expanded = false;
            d3.select(this).attr('d', arc);
        });

        const detailsDiv = d3.select('#details');
        detailsDiv.html(''); 

        if (!alreadyExpanded) {
            thisPath
                .transition()
                .duration(200)
                .attr('d', arcExpanded);
            d.data.expanded = true;
            detailsDiv.append('img')
            .attr('src', d.data.imageUrl)
            .attr('alt', 'Detail Image for' + d.data.name)
            .style('width', 'auto')  // Adjust size as needed
            .style('height', 'auto');

            detailsDiv.append('a')
                .attr('href', d.data.linkUrl)  // Placeholder link
                .style('display', 'block')  // Make the link block level to appear below the image
                .text('More Details about '+ d.data.name);
        } else {
            d.data.expanded = false;
        }
    });
