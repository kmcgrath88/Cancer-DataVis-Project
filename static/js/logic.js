
// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
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

function init() {

  // Running function on first ID to create initial dashboard.
  updateDash('North Carolina');
};

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

    var stateValues = state1[0].properties;
    console.log(stateValues)


    //TESTING
    var test = Object.entries(stateValues).sort((a, b) => b[1] - a[1])
    console.log(test)
    var top5 = Object.entries(stateValues).sort((a, b) => b[1] - a[1]).slice(5, 10);
    var allCancers = Object.entries(stateValues).sort((a, b) => b[1] - a[1]).slice(5, 24);
    //var top5 = stateValues.sort((a,b)=> b-a).slice(5,10)
    console.log(top5);
    console.log(allCancers)

    var top5Labels = [];
    var top5Values = [];
    var allCancerLabels = [];
    var allCancerValues = [];
    for (i = 0; i < top5.length; i++) {
      top5Labels[i] = top5[i][0].charAt(0).toUpperCase() + top5[i][0].slice(1)
      top5Values[i] = top5[i][1]

    }
    for (i = 0; i < allCancers.length; i++) {
      allCancerLabels[i] = allCancers[i][0].charAt(0).toUpperCase() + allCancers[i][0].slice(1)
      allCancerValues[i] = allCancers[i][1]
    }
    // console.log(allCancerLabels);
    // console.log(allCancerValues);

    // Bar Graph through chart.js
    var bar = document.getElementById('bar').getContext('2d');
    var barGraph = new Chart(bar, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
        labels: top5Labels,
        datasets: [{
          label: 'Total Incidents',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: top5Values
        }],

      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Cancer Type'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Number of Incidents'
            }
          }]

        },
        title: {
          display: true,
          text: `Top 5 Cancer Incidents In ${state1[0].properties.NAME}`
        },
        legend: { //not working
          display: true,
          postion: 'bottom',
          align: 'right'
        },
        // layout: {
        //   padding: {
        //     top: 20,
        //     bottom: 25,
        //     left: 10,
        //     right: 10
        //   }
        // }
      }
    });

    // Doughnut graph for all cancers
    var doughnut = document.getElementById("doughnut");
    var doughnutChart = new Chart(doughnut, {
      type: "doughnut",
      data: {
        labels: allCancerLabels,
        datasets: [
          {
            data: allCancerValues,
            borderWidth: 1
          }
        ],

      },
      options: {
        plugins: {
          colorschemes: {
            scheme: 'tableau.HueCircle19'
          }

        },
        responsive: true,
        title: {
          display: true,
          text: `Cancers Incidents In ${state1[0].properties.NAME}`
        },
        legend: {
          display: true,
          postion: 'bottom',
          // align: 'end'
        },
        cutoutPercentage: 40,
        // layout: {
        //   padding: {
        //     top: 20,
        //     bottom: 25,
        //     left: 10,
        //     right: 10
        //   }
        // }

      }
    });

    var radar = document.getElementById('radar').getContext('2d');
    var myRadarChart = new Chart(radar, {
      type: 'radar',
      data: {
        labels: top5Labels,
        datasets: [{
          data: top5Values
        }]
      },
      // options: {
      //   layout: {
      //     padding: {
      //       top: 25,
      //       bottom: 20,
      //       left: 10,
      //       right: 10
      //     }
      //   }
      // }
    });


    // Polar Area chart
    var polar = new Chart(document.getElementById("polar"), {
      type: 'polarArea',
      data: {
        labels: top5Labels,
        datasets: [
          {
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: top5Values
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: `Top 5 Cancers Incidents In ${state1[0].properties.NAME}`
        },
        // layout: {
        //   padding: {
        //     top: 25,
        //     bottom: 20,
        //     left: 10,
        //     right: 10
        //   }
        // }
      }
    });
    // Bubble chart trace.
    var bubbleTrace = [{
      //x: top5Labels, // what should this be??
      y: allCancerValues,
      mode: "markers",
      marker: {
        //size: top5Values,
        //color: top5Values,
        //colorscale: 'Viridis',
      },
      text: allCancerLabels,
    }];
    // Bubble layout.
    var bubbleLayout = {
      height: 600,
      title: `Cancers in ${state1[0].properties.NAME}`,
      xaxis: { title: "<b>What goes here?</b>" },
      yaxis: {
        title: "<b>Total Incidents</b>",
      },
      margin: { // not sure if this is working....
        l: 50,
        r: 50,
        b: 100,
        t: 100,
      },
      pad: 4
    };

    // Creating bubble chart.
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

    //Testing bubble chart through Chart.js
    // var bubble = document.getElementById('bubble').getContext('2d');
    // var myBubbleChart = new Chart(bubble, {
    //   type: 'bubble',
    //   data: {
    //     x: top5Labels,
    //     y: top5Values
    //   }
    //options: options
    // });



  })
};

// Function that will determine the color of a state based on cancer incidence
function chooseColor(val) {
  if (val < 10000) {
    return "#FFE400";
  }
  else if (val >= 10000 && val < 20000) {
    return "#FFB200";
  }
  else if (val >= 20000 && val < 30000) {
    return "#FF8000";
  }
  else if (val >= 30000 && val < 40000) {
    return "#FF6100";
  }
  else if (val >= 40000 && val < 60000) {
    return "#FF2A00";
  }
  else {
    return "red";
  }

}


// Grabbing our GeoJSON data..
d3.json(link, function (data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    //creating style that will adjust color of state based on all_cancer incidince
    style: function(feature) {
      return {
        color: "black",
        fillColor: chooseColor (feature.properties.all_cancers),
        fillOpacity: 0.5,
        weight: 1.5
      };   
    },
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
            fillOpacity: 0.5
          });
        },
        // When a feature (state) is clicked, it is enlarged to fit the screen
        click: function (event) {
          //myMap.fitBounds(event.target.getBounds());
          console.log(event.target.feature.properties.NAME)
          updateDash(event.target.feature.properties.NAME)
        }
      });
      layer.bindPopup("<h1>" + feature.properties.NAME + "</h1> <hr> <h3> Cancer Incidence: " + feature.properties.all_cancers + "</h3>")
    }
  }).addTo(myMap);

  /*Legend specific*/

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Cancer Incidence</h4>";
    div.innerHTML += '<i style="background: #FFE400"></i> <10,000 <br>';
    div.innerHTML += '<i style="background: #FFB200"></i><span>10,000 - 20,000</span><br>';
    div.innerHTML += '<i style="background: #FF8000"></i><span>20,000 - 30,000</span><br>';
    div.innerHTML += '<i style="background: #FF6100"></i><span>30,000 - 40,000</span><br>';
    div.innerHTML += '<i style="background: #FF2A00"></i><span>40,000 - 60,000</span><br>';
    div.innerHTML += '<i style="background: red"></i> <span>>60,000</span><br>';
    
    

    return div;
  };

  legend.addTo(myMap);
});

// Initializing dashboard.
init();