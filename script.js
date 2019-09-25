function openChart(evt, chartName) {
  
  // Show tab content description
  document.getElementById("description").innerHTML=chartName

  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(chartName).style.display = "block";
  evt.currentTarget.className += " active";


}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// Slider

//Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv', function (err, data) {
Plotly.d3.csv('https://raw.githubusercontent.com/dssantos/ploty/master/dados.csv', function (err, data) {
  // Create a lookup table to sort and regroup the columns of data,
  // first by year, then by continent:
  var lookup = {};
  function getData(year, continent) {
    var byYear, trace;
    if (!(byYear = lookup[year])) {;
      byYear = lookup[year] = {};
    }
	 // If a container for this year + continent doesn't exist yet,
	 // then create one:
    if (!(trace = byYear[continent])) {
      trace = byYear[continent] = {
        x: [],
        y: [],
        id: [],
        text: [],
        marker: {size: []}
      };
    }
    return trace;
  }

  // Go through each row, get the right trace, and append the data:
  for (var i = 0; i < data.length; i++) {
    var datum = data[i];
    var trace = getData(datum.year, datum.continent);
    trace.text.push(datum.country);
    trace.id.push(datum.country);
    trace.x.push(datum.lifeExp);
    trace.y.push(datum.gdpPercap);
    trace.marker.size.push(datum.pop);
  }

  // Get the group names:
  var years = Object.keys(lookup);
  // In this case, every year includes every continent, so we
  // can just infer the continents from the *first* year:
  var firstYear = lookup[years[0]];
  var continents = Object.keys(firstYear);

  // Create the main traces, one for each continent:
  var traces = [];
  for (i = 0; i < continents.length; i++) {
    var data = firstYear[continents[i]];
	 // One small note. We're creating a single trace here, to which
	 // the frames will pass data for the different years. It's
	 // subtle, but to avoid data reference problems, we'll slice
	 // the arrays to ensure we never write any new data into our
	 // lookup table:
    traces.push({
      name: continents[i],
      x: data.x.slice(),
      y: data.y.slice(),
      id: data.id.slice(),
      text: data.text.slice(),
      mode: 'markers',
      marker: {
        size: data.marker.size.slice(),
        sizemode: 'area',
        sizeref: 30200000
      }
    });
  }

  // Create a frame for each year. Frames are effectively just
  // traces, except they don't need to contain the *full* trace
  // definition (for example, appearance). The frames just need
  // the parts the traces that change (here, the data).
  var frames = [];
  for (i = 0; i < years.length; i++) {
    frames.push({
      name: years[i],
      data: continents.map(function (continent) {
        return getData(years[i], continent);
      })
    })
  }

  // Now create slider steps, one for each frame. The slider
  // executes a plotly.js API command (here, Plotly.animate).
  // In this example, we'll animate to one of the named frames
  // created in the above loop.
  var sliderSteps = [];
  for (i = 0; i < years.length; i++) {
    sliderSteps.push({
      method: 'animate',
      label: years[i],
      args: [[years[i]], {
        mode: 'immediate',
        transition: {duration: 500},
        frame: {duration: 500, redraw: false},
      }]
    });
  }

  var layout = {
    xaxis: {
      title: 'Life Expectancy',
      // range: [30, 85]
      range: [0, 90]
    },
    yaxis: {
      title: 'GDP per Capita',
      type: 'log'
    },
    hovermode: 'closest',
	 // We'll use updatemenus (whose functionality includes menus as
	 // well as buttons) to create a play button and a pause button.
	 // The play button works by passing `null`, which indicates that
	 // Plotly should animate all frames. The pause button works by
	 // passing `[null]`, which indicates we'd like to interrupt any
	 // currently running animations with a new list of frames. Here
	 // The new list of frames is empty, so it halts the animation.
    updatemenus: [{
      x: 0,
      y: 0,
      yanchor: 'top',
      xanchor: 'left',
      showactive: false,
      direction: 'left',
      type: 'buttons',
      pad: {t: 87, r: 10},
      buttons: [{
        method: 'animate',
        args: [null, {
          mode: 'immediate',
          fromcurrent: true,
          transition: {duration: 300},
          frame: {duration: 500, redraw: false}
        }],
        label: 'Play'
      }, {
        method: 'animate',
        args: [[null], {
          mode: 'immediate',
          transition: {duration: 0},
          frame: {duration: 0, redraw: false}
        }],
        label: 'Pause'
      }]
    }],
	 // Finally, add the slider and use `pad` to position it
	 // nicely next to the buttons.
    sliders: [{
      pad: {l: 130, t: 55},
      currentvalue: {
        visible: true,
        prefix: 'Year:',
        xanchor: 'right',
        font: {size: 20, color: '#666'}
      },
      steps: sliderSteps
    }]
  };

  // Create the plot:
  Plotly.plot('Slider', {
    data: traces,
    layout: layout,
    frames: frames,
  });
});

// Radar
data = [
  {
  type: 'scatterpolar',
  r: [39, 28, 8, 7, 28, 39],
  theta: ['A','B','C', 'D', 'E', 'A'],
  fill: 'toself',
  name: 'Group A'
  },
  {
  type: 'scatterpolar',
  r: [1.5, 10, 39, 31, 15, 1.5],
  theta: ['A','B','C', 'D', 'E', 'A'],
  fill: 'toself',
  name: 'Group B'
  }
]

layout = {
  polar: {
    radialaxis: {
      visible: true,
      range: [0, 50]
    }
  }
}

Plotly.plot("Radar", data, layout)

// Splom
//Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/iris-data.csv', function(err, rows){
Plotly.d3.csv('https://raw.githubusercontent.com/dssantos/ploty/master/medicos_2018_sem_ssa.csv', function(err, rows){

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key.replace('.',' ')]; });
    }

    // colors = []
    // for (i=0; i < unpack(rows, 'regiao').length; i++) {
    //   if (unpack(rows, 'regiao')[i] == "a") {
    //     colors.push(0)
    //   } else if (unpack(rows, 'regiao')[i] == "b") {
    //     colors.push(0.5)
    //   } else if (unpack(rows, 'regiao')[i] == "c") {
    //     colors.push(1)
    //   }
    // }

    colors = []
    for (i=0; i < unpack(rows, 'População').length; i++) {
      if (unpack(rows, 'População')[i] < 100000) {
        colors.push(0)
      } else if (unpack(rows, 'População')[i] < 200000) {
        colors.push(0.5)
      } else {
        colors.push(1)
      }
    }

    var pl_colorscale=[
               [0.0, '#19d3f3'],
               [0.333, '#19d3f3'],
               [0.333, '#e763fa'],
               [0.666, '#e763fa'],
               [0.666, '#636efa'],
               [1, '#636efa']
    ]

    var axis = () => ({
      showline:false,
      zeroline:false,
      gridcolor:'#ffff',
      ticklen:4
    })

    var data = [{
      type: 'splom',
      dimensions: [
        // {label:'Médicos SUS', values:unpack(rows,'QtMédicosSUS')},
        // {label:'Médicos Não SUS', values:unpack(rows,'QtMédicosNãoSUS')},
        // {label:'Enfermeiros SUS', values:unpack(rows,'QtEnfermeirosSUS')},
        // {label:'Enfermeiros Não SUS', values:unpack(rows,'QtEnfermeirosNãoSUS')}
        {label:'Médicos', values:unpack(rows,'QtMédicos')},
        {label:'Enfermeiros', values:unpack(rows,'QtEnfermeiros')},
        {label:'Profissionais SUS', values:unpack(rows,'QtSUS')},
        {label:'Profissionais Não SUS', values:unpack(rows,'QtNãoSUS')}
      ],
      text: unpack(rows, 'Município'),
      marker: {
        color: colors,
        colorscale:pl_colorscale,
        size: 7,
        line: {
          color: 'white',
          width: 0.5
        }
      }
    }]

    var layout = {
      title:'Correlações',
      height: 800,
      width: 800,
      autosize: false,
      hovermode:'closest',
      dragmode:'select',
      plot_bgcolor:'rgba(240,240,240, 0.95)',
      xaxis:axis(),
      yaxis:axis(),
      xaxis2:axis(),
      xaxis3:axis(),
      xaxis4:axis(),
      yaxis2:axis(),
      yaxis3:axis(),
      yaxis4:axis()
    }

    Plotly.react('Splom', data, layout)

});