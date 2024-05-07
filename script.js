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
    { name: "Competency 1", value: 1, performance: 1, imageUrl: 'sample1.jpg', linkUrl: 'http://example.com/link1', expanded: false },
    { name: "Competency 2", value: 1, performance: 4, imageUrl: 'sample2.jpg', linkUrl: 'http://example.com/link2', expanded: false },
    { name: "Competency 3", value: 1, performance: 2, imageUrl: 'sample3.jpg', linkUrl: 'http://example.com/link3', expanded: false },
    // More competencies...
];

// Define the performance color scale
const performanceColorScale = d3.scaleOrdinal()
    .domain([1, 2, 3, 4])
    .range(['green', 'yellow', 'orange', 'red']);  // Colors from good to poor performance

// Define the pie layout
const pie = d3.pie()
    .value(d => d.value)
    .sort(null);  // Optionally disable sorting to maintain original order

// Define the arcs for regular and hover states
const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

const arcHover = d3.arc()
    .outerRadius(radius)  // Slightly larger for hover effect
    .innerRadius(0);

// Bind data to paths and create arc groups
const arcs = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc');

// Append paths to the arcs and set initial uniform fill color
arcs.append('path')
    .attr('d', arc)
    .attr('fill', '#ccc')  // Neutral initial color for all segments
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .on('mouseover', function (event, d) {
        d3.select(this)
            .attr('fill', performanceColorScale(d.data.performance));  // Change fill to performance color on hover
        d3.select('#hover-info').text(d.data.name);  // Display the name on hover
    })
    .on('mouseout', function (event, d) {
        d3.select(this)
            .attr('fill', d.data.expanded ? performanceColorScale(d.data.performance) : '#ccc');  // Revert color on mouseout unless clicked
        d3.select('#hover-info').text('');  // Clear the hover info text
    })
    .on('click', function (event, d) {
        svg.selectAll('.arc path').each(function(p) { p.data.expanded = false; d3.select(this).attr('fill', '#ccc'); });
        d.data.expanded = true;
        d3.select(this).attr('fill', performanceColorScale(d.data.performance));  // Highlight clicked segment

        const detailsDiv = d3.select('#click-info');
        detailsDiv.html('');  // Clear previous content
        detailsDiv.append('img')
            .attr('src', d.data.imageUrl)
            .attr('alt', 'Detail Image for ' + d.data.name)
            .style('width', 'auto')
            .style('height', 'auto');
        detailsDiv.append('a')
            .attr('href', d.data.linkUrl)
            .style('display', 'block')
            .text('More Details about ' + d.data.name);
    });

// Add text labels inside each segment with white text color
arcs.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .style('fill', 'white')  // Set text color to white
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .text(d => d.data.name);
