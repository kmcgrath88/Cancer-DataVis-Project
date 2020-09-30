// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// get the geojson data.
var link = "Data/US_cancer_state.geojson";
//var link = "data/cancer_incidence_revised.json"; --- not rendering map??

function updateDash(state) {
  //d3.json("../../Data/cancer_incidence_revised.json", function (incomingData) {
  d3.json(link, function (incomingData) {
    //console.log(incomingData.features)

    var allData = incomingData.features;
    console.log(allData);
    //})};

    // Storing samples list of dictionaries to variable.
    // console.log(incomingData)
    var state1 = allData.filter(value =>
      //console.log(value)

      value.properties.NAME == state);
    console.log(state1);

    var stateValues = state1[0].properties
    console.log(stateValues)
    // console.log(stateValues.NAME)
    // console.log(stateValues.all_cancers)


    //TESTING
    var top5 = Object.entries(stateValues).sort((a, b) => b[1] - a[1]).slice(5, 10)
    //var top5 = stateValues.sort((a,b)=> b-a).slice(5,10)
    console.log(top5)

    var top5Labels = []
    var top5Values = []
    for (i = 0; i < top5.length; i++) {
      top5Labels[i] = top5[i][0]
      top5Values[i] = top5[i][1]
    }
    console.log(top5Labels)
    console.log(top5Values)


    // Bar graph trace.
    var barTrace = [{
      x: top5Labels,
      y: top5Values,
      //text:
      type: "bar",
      marker: {
        color: 'rgba(18,162,169,.75)',
      }
    }];

    Plotly.newPlot("bar", barTrace);



    // Bubble chart trace.
    var bubbleTrace = [{
      x: top5Labels,
      y: top5Values,
      mode: "markers",
      marker: {
      //     size: top5Values,
      //     //color: top5Labels,
      //     colorscale: 'Viridis',
      },
      //text: otuLabels,
  }];

  // Bubble layout.
  var bubbleLayout = {
      height: 600,
      title: `Top 5 Cancers in ${state1[0].properties.NAME}`,
      xaxis: { title: "<b>OTU ID</b>" },
      yaxis: {
          title: "<b>Sample Values</b>",
      },
  };

  // Creating bubble chart.
  Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

  })



};





// Grabbing our GeoJSON data..
d3.json(link, function (data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // Called on each feature
    onEachFeature: function (feature, layer) {
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 20%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.2
          });
        },
        // When a feature (state) is clicked, it is enlarged to fit the screen
        click: function (event) {
          myMap.fitBounds(event.target.getBounds());
          console.log(event.target.feature.properties.NAME)
          updateDash(event.target.feature.properties.NAME)
        }
      });
      layer.bindPopup("<h1>" + feature.properties.NAME + "</h1> <hr> <h3> Cancer Incidence: " + feature.properties.all_cancers + "</h3>")
    }
  }).addTo(myMap);
});