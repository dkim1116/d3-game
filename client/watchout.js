// start slingin' some d3 here.

// 
var width = 1900;
var height =900;
var highestScore = 0, currentScore = 0, collisions = 0;

var numberOfEnemies = 50;

var randomPositionX = function(){return Math.floor(Math.random()*1800)};
var randomPositionY = function(){return Math.floor(Math.random()*850)};



//  Initiate move of player on mouse click
var drag = d3.behavior.drag()
  .on("dragstart", dragstarted)
  .on("drag", dragged)
  .on("dragend", dragended);

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(".playa").classed("dragging", true);
}

function dragged(d) {
  d3.select(".playa").attr("x", d.x = (d3.event.x-32)).attr("y", d.y = (d3.event.y-28));
}

function dragended(d) {
  d3.select(".playa").classed("dragging", false);
}


// Create our game board
var svg = d3.select("body").append("svg")
  .attr("class","backgroundImage")
  .attr("width", width)
  .attr("height", height)
  .append("g")


// create our player mario and call the drag event on it
var playa = d3.select("svg").append("g")
  .append("image")
  .data([{x:0, y: 710}])
  .attr("class","playa")
  .attr("width",70)
  .attr("height", 70)
  .attr("x", function(d){return d.x})
  .attr("y", function(d){return d.y})
  .attr("xlink:href","mario.png")
  .call(drag)

// create enemies
var enemies = d3.select("g")            
// dynamically create mutiple enemies
for (var i = 0; i < numberOfEnemies; i++) {
  enemies.append("svg")
    .append("image")
    .attr("class","enemy")
    .attr("width", 50+ "px")
    .attr("height", 50+ "px")
    .attr("x", Math.floor(Math.random()*1880))
    .attr("y", Math.floor(Math.random()*880))
    .attr("xlink:href","asteroid.gif") 
};

var switchARoo = function () {
  var totalContainer = [];
// get and set random x and y values for each the enemies. 
    var randomizer = function(){

      for (var i = 0; i < numberOfEnemies; i++) {

      var objectContainer = {};
        objectContainer['x']=randomPositionX();
        objectContainer['y']=randomPositionY();
        totalContainer.push(objectContainer)
      };
    }

      randomizer();

// Allow the enemies to move randomly across the stage
d3.selectAll(".enemy")
  .data(totalContainer)
  .transition()
  .duration(1500)
  .ease('cubic')
  .attr("x", function(d){return d.x})
  .attr("y", function(d){return d.y})
}


var marioPosition = d3.select("svg").select(".playa")
var allEnemies = enemies.selectAll('.enemy')

// check for collisions between mario and gumbas
var collisionCounter = function(){
  for (var i = 0; i < allEnemies[0].length; i++) {
    if((Math.abs(allEnemies[0][i].attributes.x.value - marioPosition[0][0].attributes.x.value)<=40) && 
       (Math.abs(allEnemies[0][i].attributes.y.value - marioPosition[0][0].attributes.y.value)<=60)){
        return true
      }
    }
    if(marioPosition[0][0].attributes.x.value < 0 || marioPosition[0][0].attributes.x.value >1870 || 
       marioPosition[0][0].attributes.y.value < 0 || marioPosition[0][0].attributes.y.value > 870){
        return true
    }
};

// SCORE COUNTER

var scoreCounter = function(){
  // Check foe collision
  if(collisionCounter()){
    //  set score back to 0 
    currentScore = -1;
    // increment collisions
    collisions++
      d3.select('.collisions').select('span')
        .data([collisions])
        .text(function(d){return d})
  } else {
    // else increment score if there are no collisions
    currentScore++;
      d3.select('.current').select('span')
        .data([currentScore])
        .text(function(d){return d})
  }
  // add high score or set high score
  if(highestScore<currentScore){
    highestScore=currentScore
      d3.select('.high').select('span')
        .data([highestScore])
        .text(function(d){return d})
  }
}
// score counter interval 
setInterval(scoreCounter, 150)
// move gumbas randomly on the screen
setInterval( switchARoo, 1500)

