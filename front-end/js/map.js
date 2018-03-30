// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labelIndex = 1;
var markers = [];
var map;
var nodes = [];
var state = "Node";
var edge = [];
var edgeList = [];
var stfin = [];
function initialize() {
    var bandung ={lat: -6.890345, lng: 107.610403}
    var noPoi = [
        {
            featureType: "poi",
            stylers: [
              { visibility: "off" }
            ]   
          }
    ];
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: bandung,
        fullscreenControl: false
    });
    map.setOptions({styles: noPoi});
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
        var listener = google.maps.event.addListener(map, "idle", function() { 
            if (map.getZoom() < 16) map.setZoom(16); 
            google.maps.event.removeListener(listener); 
          });
      });
      // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function(event) {
        var myLatLng = event.latLng;
        var lat = myLatLng.lat();
        var lng = myLatLng.lng();
        if(state == "Node"){
            addNode(event.latLng, map);
            nodes.push({lat:lat,lng:lng});
        }
    });
}

// Adds a marker to the map.
function addNode(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: "" + labelIndex++,
    map: map
  });
  markers.push(marker);
}

function drawLine(location, map){
    var line = new google.maps.Polyline({
        map : map,
        path: location,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
    labelIndex = 1;
}

function addEdge(){
    for(let marker of markers ){
        google.maps.event.addListener(marker,'click', function(event) {
            edge.push({idx:0 + marker.label -1, latLng:marker.position});
            if(edge.length == 2) {
                let path = [edge[0].latLng ,edge[1].latLng];
                drawLine(path,map);
                edgeList.push({a:edge[0].idx , b:edge[1].idx});
                console.log(edgeList);
                edge = [];
            }
        });
    }
}

function nextState() {
    if(state == "Node") {
        document.getElementById("deleteButton").remove();
        state = "Edge";
        document.getElementById("stateButton").value="Next: Define Start and End";
        document.getElementById("cardcontent").innerHTML = "Click on 2 nodes to define the edge between those nodes of the graph";
        document.getElementById("cardtitle").innerHTML = "Add Edge";
        google.maps.event.clearListeners(map, 'click');
        addEdge();
    } else if (state == "Edge") {
        for(let marker of markers){
            google.maps.event.clearListeners(marker, 'click');
        }
        document.getElementById("cardtitle").innerHTML = "Define your starting and end node";
        console.log("Define Start and Finish");
        document.getElementById("stateButton").value="Next: Calculate Route";
        for(let marker of markers){
            google.maps.event.addListener(marker, 'click', function(event) {
                //Change the marker icon
                stfin.push(marker);
                if(stfin.length < 3 ){
                    marker.setIcon('http://www.googlemapsmarkers.com/v1/009900/');
                }
                if (stfin.length == 2){
                    document.getElementById("cardcontent").innerHTML = "Start: "+ stfin[0].label +"\n" + "Finish: "+stfin[1].label;
                }
            });
        }
        state = "Calculate"
    } else if (state == "Calculate") {
        console.log("Calculating...");
        document.getElementById("cardcontent").innerHTML = "1-2-3-4-5-6";
        document.getElementById("cardtitle").innerHTML = "Shortest Path";
    }
}