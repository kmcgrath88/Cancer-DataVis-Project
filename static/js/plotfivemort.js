// Bar graph for the top 5 cancer incidence
var trace1 = {
  x: data.map(row =>row.Statename),
  y: data.map(row =>row.breast_mort),
  name: "Breast",
  type: "bar"
};

var trace2 = {
  x: data.map(row =>row.Statename),
  y: data.map(row =>row.colon_rectum_mort),
  name: "Colon",
  type: "bar"
};

var trace3 = {
  x: data.map(row =>row.Statename),
  y: data.map(row =>row.lung_mort),
  name: "Lung",
  type: "bar"
};

var trace4 = {
  x: data.map(row =>row.Statename),
  y: data.map(row =>row.melanoma_mort),
  name: "Skin",
  type: "bar"
};

var trace5 = {
  x: data.map(row =>row.Statename),
  y: data.map(row =>row.prostate_mort),
  name: "Prostate",
  type: "bar"
};

var data = [trace1, trace2,trace3,trace4,trace5];

var layout = {
  title: "Top Five Cancer Mortality Rate in United States",
  xaxis: { title: " "},
  yaxis: { title: "Mortality Rate"}
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("plot", data, layout);
