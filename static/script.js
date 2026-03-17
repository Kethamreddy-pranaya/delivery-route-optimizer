let map = L.map('map').setView([20.5937,78.9629],5);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{maxZoom:19}
).addTo(map);

let markers=[];
let routeLines=[];

async function optimizeRoute(){

let text=document.getElementById("locations").value;

let addresses=text.split("\n");

markers.forEach(m=>map.removeLayer(m));
markers=[];

routeLines.forEach(l=>map.removeLayer(l));
routeLines=[];

let response=await fetch("/optimize",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({locations:addresses})

});

let data=await response.json();

let drivers=data.drivers;
let coords=data.coordinates;
let ranking=data.distance_ranking;

let output="";

let colors=["blue","red"];

drivers.forEach((driver,i)=>{

output+="<h4>Driver "+(i+1)+"</h4>";

driver.segments.forEach((d,j)=>{

let eta=driver.eta[j];

output+="Stop "+driver.route[j]+" → Stop "+
driver.route[j+1]+" : "+d+" km | ETA: "+eta+" minutes<br>";

});

output+="Total Distance: "+driver.distance+" km<br>";
output+="Total Time: "+driver.total_time+" minutes<br><br>";

let routeCoords=[];

driver.route.forEach(index=>{

let coord=coords[index];

routeCoords.push(coord);

let marker=L.marker(coord).addTo(map);

markers.push(marker);

});

let line=L.polyline(routeCoords,{color:colors[i]}).addTo(map);

routeLines.push(line);

map.fitBounds(line.getBounds());

});

document.getElementById("result").innerHTML=output;

let rankText="";

ranking.forEach(r=>{

rankText+="Location "+r.location+" : "+r.distance+" km<br>";

});

document.getElementById("ranking").innerHTML=rankText;

}