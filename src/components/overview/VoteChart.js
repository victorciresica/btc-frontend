import React from 'react';
import * as d3 from 'd3';
import '../../css/VoteChart.css';

export class VoteChart extends React.Component {

    constructor(props){
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    }
    componentDidMount() {
        this.createBarChart()
    }
    componentDidUpdate() {
        this.createBarChart()
    }
    
    createBarChart() {
        this.node.innerHTML = ''
        const node = this.node

        var red = "rgba(255, 0, 0, 1)";
        var green = "#228B22";
        const dataMax = d3.max(this.props.data.map(proposal => proposal.nrVotes))
        var margin = {top: 30, right: 20, bottom: 50, left: 60};
        var width = this.props.size[0] - margin.left - margin.right;
        var height = this.props.size[1] - margin.top - margin.bottom;

        // ======================================================
        // SET SCALES
        var xScale = d3.scaleBand()
            .domain(this.props.data.map(proposal => proposal.newAddress.substring(0,6) + '...'))
            .range([0, width])
            .padding(0.2);
        var yScale = d3.scaleLinear()
           .domain([0, dataMax])
           .range([height, 0])

        
        let svg = d3.select(node)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // GRAPH TITLE
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", -10)
            .attr("class", "graph-title")
            .text("Voting Statistics");

        function make_y_gridlines() {	
            return d3.axisLeft(yScale)
                .ticks(10)
        }

        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            );

        // add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(xScale)
                .tickValues(xScale.domain())
                .ticks(5))
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "0em")
            .attr("dy", ".5em")
            .attr("transform", "rotate(-40)");

        // add the y Axis
        svg.append("g")
        .call(d3.axisLeft(yScale));
        
        // append the rectangles for the bar chart
        svg.selectAll("rect")
        .data(this.props.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", function(d) { if (d.nrVotes < 0) { return red; } else { return green; } })
        .attr("x", function(d) { return xScale(d.newAddress.substring(0,6) + '...'); })
        .attr("width", xScale.bandwidth())
        .attr("y", (d) => { return yScale(d.nrVotes); })
        .attr("height", (d) => {
                var barHeight = yScale(0) - yScale(d.nrVotes);
                return barHeight;
        });
    }
  render() {
        return <svg ref={node => this.node = node}
        width={this.props.size[0]} height={this.props.size[1]}
        className="chart-canvas">
        </svg>
     }
}