// Bar graph for the top 5 cancer incidence
var trace1 = {
  x: data.map(row =>row.State),
  y: data.map(row =>row.Breast_incd),
  name: "Breast",
  type: "bar"
};

var trace2 = {
  x: data.map(row =>row.State),
  y: data.map(row =>row.colon_rectum_incd),
  name: "Colon",
  type: "bar"
};

var trace3 = {
  x: data.map(row =>row.State),
  y: data.map(row =>row.Lung_incd),
  name: "Lung",
  type: "bar"
};

var trace4 = {
  x: data.map(row =>row.State),
  y: data.map(row =>row.Melanoma_incd),
  name: "Skin",
  type: "bar"
};

var trace5 = {
  x: data.map(row =>row.State),
  y: data.map(row =>row.prostate_incd),
  name: "Prostate",
  type: "bar"
};

var data = [trace1, trace2,trace3,trace4,trace5];

var layout = {
  title: "Top Five Cancer Incidence Rate in United States",
  xaxis: { title: "State"},
  yaxis: { title: "Incidence Rate"}
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("plot", data, layout);
