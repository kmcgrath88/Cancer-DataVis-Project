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
    var top5 = Object.entries(stateValues).sort((a, b) => b[1] - a[1]).slice(5, 10);
    //var top5 = stateValues.sort((a,b)=> b-a).slice(5,10)
    console.log(top5);

    var top5Labels = [];
    var top5Values = [];
    for (i = 0; i < top5.length; i++) {
      top5Labels[i] = top5[i][0].charAt(0).toUpperCase() + top5[i][0].slice(1)
      top5Values[i] = top5[i][1]
    }
    console.log(top5Labels);
    console.log(top5Values);


    // // Bar graph trace.
    // var barTrace = [{
    //   x: top5Labels,
    //   y: top5Values,
    //   //text:
    //   type: "bar",
    //   marker: {
    //     color: 'rgba(18,162,169,.75)',
    //   }
    // }];

    // Plotly.newPlot("bar", barTrace);

    // Testing Bar Graph through chart.js
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
        }
      }
    });


    // Bubble chart trace.
    var bubbleTrace = [{
      x: top5Labels, // what should this be??
      y: top5Values,
      mode: "markers",
      marker: {
        //size: top5Values,
        //color: top5Values,
        //colorscale: 'Viridis',
      },
      text: top5Labels,
    }];

    // Bubble layout.
    var bubbleLayout = {
      height: 600,
      title: `Top 5 Cancers in ${state1[0].properties.NAME}`,
      xaxis: { title: "<b>What goes here?</b>" },
      yaxis: {
        title: "<b>Total Incidents</b>",
      },
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

    var doughnut = document.getElementById("doughnut");
    var doughnutChart = new Chart(doughnut, {
      type: "doughnut",
      data: {
        labels: top5Labels,
        datasets: [
          {
            label: "Github Stars",
            data: top5Values,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1
          }
        ],
      },
      options: {
        title: {
          display: true,
          text: `Top 5 Cancers Incidents In ${state1[0].properties.NAME}`
        },
        cutoutPercentage: 40,
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
      }
      //options: options
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
      }
    }
  });



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