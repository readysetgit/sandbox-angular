import { Component } from '@angular/core';
import * as d3 from 'd3';
import { EventManagerPlugin } from '@angular/platform-browser/src/dom/events/event_manager';
import DATA from './data/buildings.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {



  updatingList:any 

  title = 'sandbox-angular';

  list = [1,2,3,4,5];

  constructor(){
    this.updatingList = DATA
  }

  ngAfterContentInit(){
    
    // this.makeCircles();
    this.makeBarChart();
    let i = 1 
    let sign = 1

    setInterval(() =>{
      sign = -sign
      let heightOffset = sign*500*Math.random()
      this.updatingList.push({"name":`bleh${i}`,"height":1200 + heightOffset})   
      i++
      this.updatingList = this.updatingList.slice(1,this.updatingList.length)
    },1000)
  }


  makeBarChart(){
      /* #region */
      let t = d3.transition().duration(350)
      let data = this.updatingList
      setInterval(() => {
        data = this.updatingList
        console.log(data)
      },500)

      let margin = {left: 100, right: 10, top: 10, bottom: 100};

      let width = 600 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;
  
      let g = d3.select("#bar-chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
                   .append("g")
                      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
          
      console.log(data);
  
      data.forEach(function(d){
        d.height = +d.height //Converting to int
      });
  

      
      
      let xAxisGroup = g.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0, ${height})`)


  
      let yAxisGroup = g.append("g")
          .attr("class", "y-axis") 
      
  
      // X Label 
      g.append("text")
      .attr("class", "x axis-label")
      .attr("x", width /2)
      .attr("y", height + 140)
      .attr("font-size", "20px")
      .attr("color", "black")
      .attr("text-anchor", "middle")
      .text("The world's tallest buildings")
      // Y Label 
      g.append("text")
          .attr("class", "y axis-label")
          .attr("x", -(height / 2))
          .attr("y", -60)
          .attr("font-size", "20px")
          .attr("color", "black")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("The world's tallest buildings")
          
          /* #endregion */

    d3.interval(function(){
      update()
      console.log("Yooo")
    }, 1000);

    update();
    
    function update(){
      let x = d3.scaleBand()
      .domain(data.map(function(d) {return d.name; }))
      .range([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.3);
  
      let y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d){
        return d.height;
      })])
      .range([height, 0]);

      x.domain(data.map(function(d){ return d.name}));
      y.domain([0, d3.max(data, function(d) { return d.height})])

      //X Axis
      let xAxisCall = d3.axisBottom(x);
      xAxisGroup.transition(t).call(xAxisCall)
                  .selectAll("text")
                    .attr("x", "-5")
                    .attr("y", "10")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-40)")
      //Y Axis
      let yAxisCall = d3.axisLeft(y)
          .ticks(10)
          .tickFormat(function(d){
            return d + " m";
          });

      yAxisGroup.transition(t).call(yAxisCall)

      // Join new data with old elements.
      let rects = g.selectAll("rect")
          .data(data, function(d){
            return d.name;
          })
      
      // EXIT old elements not present in new data
      rects.exit()
           .attr("fill", "red")
          .transition(t)
           .attr("y", y(0))
           .attr("height", 0)
          .remove();

      // UPDATE old elements present in new data 
      rects
          .transition(t)
          .attr("y", function (d){return y(d.height)})
          .attr("x", function(d, i){return x(d.name);})
          .attr("width", x.bandwidth)
          .attr("height", function(d){return height - y(d.height)})
          .attr("fill", function(d){return "grey"});
      
      //ENTER new elements present in new data 
      rects.enter()
          .append("rect")
              .attr("height", 0)
              .attr("y", y(0))
              .attr("x", function(d){return x(d.name)})
              .attr("fill", "green")
          .transition(t)
              .attr("y", function (d){return y(d.height)})
              .attr("x", function(d, i){return x(d.name);})
              .attr("width", x.bandwidth)
              .attr("height", function(d){return height - y(d.height)})
              // .attr("fill", function(d){return "grey"});
    }
  }

  
  makeCircles(){
    //---------------------------Scaling-------------------   
    let t = d3.transition().duration(450)
    let x = d3.scaleLinear()
    .domain([0,998])
    .range([0,100])
   
   let y = d3.scaleLog()
    .domain([1,998])
    .range([0,100])
    .base(10)
   
   
   let z = d3.scaleOrdinal()
    .domain([
      "Africa"
    ])
    .range(["red","blue"])
   
   let bb = d3.scaleBand()
    .domain([
      "Africa","US","India"
    ])
    .range([0,100])
    .paddingInner(0.3)
    .paddingOuter(0.2)
   
    console.log(bb("India"))
    console.log(bb.bandwidth())
   
   console.log(x(349))
   console.log(y(349))
   console.log(z("Africa"))
   
   //-------------------------------------------------------
   let svg = d3.select("#canvas")
    .append("svg")
      .attr("width", 400)
      .attr("height", 400);
   
    svg
    .append("circle")
    .transition(t)
      .attr("cx", 200)
      .attr("cy", 200)
      .attr("r", 10)
      .attr("fill", "red");
   
   let circles = svg.selectAll("circle")
        .data(this.list)
   
    circles.enter()
        .append("circle")
         .transition(t)
          .attr("cx", (d,i) => i*30 + 30)
          .attr("cy", 200)
          .attr("r", (d,i) => d*i)
          .attr("fill", "blue");
     }

}
