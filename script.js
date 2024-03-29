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



// Splom
Plotly.d3.csv('https://raw.githubusercontent.com/dssantos/ploty/master/medicos_2018.csv', function(err, rows){

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key.replace('.',' ')]; });
    }

    column_values = unpack(rows, 'QtProfissionais/100000Hab')
    colors = []
    for (i=0; i < column_values.length; i++) {
      colors.push(column_values[i]/column_values.length) // Calcula o percentil
    }

    // Os pontos são coloridos de acordo com o valor do percentil
    var pl_colorscale=[
               [0.0, '#ff9999'], // Vermelho
               [0.25, '#ff9999'],
               // Quartil 1
               [0.25, '#ffcc00'], // Amarelo
               [0.50, '#ffcc00'],
               // Quartil 2
               [0.50, '#66ff66'], // Verde claro
               [0.75, '#66ff66'],
               // Quartil 3
               [0.75, '#009900'], // Verde escuro
               [1, '#009900']
    ]

    var axis = () => ({
      showline:false,
      zeroline:true,
      gridcolor:'#ffff',
      ticklen:4
    })

    var data = [{
      type: 'splom',
      dimensions: [
        {label:'Médicos', values:unpack(rows,'QtMédicos/100000Hab')},
        {label:'Enfermeiros', values:unpack(rows,'QtEnfermeiros/100000Hab')},
        {label:'SUS', values:unpack(rows,'QtSUS/100000Hab')},
        {label:'Não SUS', values:unpack(rows,'QtNãoSUS/100000Hab')},
        {label:'Profissionais', values:unpack(rows,'QtProfissionais/100000Hab')}
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
      yaxis4:axis(),
      yaxis5:axis(),
      yaxis5:axis()
    }

    Plotly.react('Splom', data, layout)

});


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

