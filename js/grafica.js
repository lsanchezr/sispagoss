var lenguaje = {
  'sProcessing'    :  'Procesando...',
  'sLengthMenu'    :  'Mostrar _MENU_ registros',
  'sZeroRecords'   :  'No se encontraron resultados',
  'sEmptyTable'    :  'Ningún dato disponible en esta tabla',
  'sInfo'          :  'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
  'sInfoEmpty'     :  'Mostrando registros del 0 al 0 de un total de 0 registros',
  'sInfoFiltered'  :  '(filtrado de un total de _MAX_ registros)',
  'sInfoPostFix'   :  '',
  'sSearch'        :  'Buscar:',
  'sUrl'           :  '',
  'sInfoThousands' :  ',',
  'sLoadingRecords':  'Cargando...',
  'oPaginate'      :  {
                        'sFirst'     :  'Primero',
                        'sLast'      :  'Último',
                        'sNext'      :  'Siguiente',
                        'sPrevious'  :  'Anterior'
                      }
  };

/*var dataFiltro = [];


var cols = [
  {title : 'Title',width: '350px'},
  {title : 'Type'},
  {title : 'Year'},
  {title : 'imdbID'},
  {title : 'Poster'}
];

var table = $('#table_div').DataTable({
  bPaginate : false,
  sPaginationType: 'first_last_numbers',
  columns   : cols,
  data      : [],
  dom       : 'Bfrtip',
  select    : 'single',
  altEditor : true,
  order     : [[ 0, 'asc' ]],
  iDisplayLength: 10,
  buttons   : [],
  bDestroy  : true,
  bAutoWidth: false,
  searching : false,
  language : lenguaje
});

var cols1 = [
  {title : 'Locación',width: '350px'},
  {title : 'Valor'}
];

var table1 = $('#table_div1').DataTable({
  bPaginate : false,
  sPaginationType: 'first_last_numbers',
  columns   : cols1,
  data      : [],
  dom       : 'Bfrtip',
  select    : 'single',
  altEditor : true,
  order     : [[ 0, 'asc' ]],
  iDisplayLength: 10,
  buttons   : [],
  bDestroy  : true,
  bAutoWidth: false,
  searching : false,
  language : lenguaje
});

var cols2 = [
  {title : 'Locación',width: '350px'},
  {title : 'Promedio'}
];

var table2 = $('#table_div2').DataTable({
  bPaginate : false,
  sPaginationType: 'first_last_numbers',
  columns   : cols2,
  data      : [],
  dom       : 'Bfrtip',
  select    : 'single',
  altEditor : true,
  order     : [[ 0, 'asc' ]],
  iDisplayLength: 10,
  buttons   : [],
  bDestroy  : true,
  bAutoWidth: false,
  searching : false,
  language : lenguaje
});

google.charts.load('current', {'packages':['corechart','table']});
google.charts.setOnLoadCallback(drawChart);

Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

function filtroLocacion(data){
  for (var i = 0; i < data.length; i++){
    dataFiltro[i] = data[i][2];
  }
  dataFiltro = dataFiltro.unique();
}

function graficaElementosLocacion(){
  var arrElementosLocacion = [];
  var contadorElementos = 0;
  for (var i = 0; i < dataFiltro.length; i++){
    for (var x = 0; x < DB.dataSet.length; x++){
      if(dataFiltro[i] == DB.dataSet[x][2]){
        contadorElementos++;
        arrElementosLocacion[i] = [dataFiltro[i],contadorElementos];
      }
    }
    contadorElementos = 0;
  }
  return arrElementosLocacion;
}

function graficaPromedioLocacion(){
  var arrPromedioLocacion = [];
  var suma = 0;
  var contadorElementos = 0;
  for (var i = 0; i < dataFiltro.length; i++){
    for (var x = 0; x < DB.dataSet.length; x++){
      if(dataFiltro[i] == DB.dataSet[x][2]){
        contadorElementos++;
        suma = suma + Number(DB.dataSet[x][3]);
        arrPromedioLocacion[i] = [dataFiltro[i],(suma/contadorElementos)];
      }
    }
    suma = 0;
    contadorElementos = 0;
  }
  return arrPromedioLocacion;
}

function graficaPelis(){
  var arrPelis = [];
  for(var i=0; i<DB.pelis.data.length;i++){
    arrPelis[i] = [DB.pelis.data[i].Title,DB.pelis.data[i].Year,''];
  }
  return arrPelis;
}

function tooltipBBVA(value){
  return '<div>'+value+'</div>';
}

filtroLocacion(DB.dataSet);

function drawChart() {

  var dataPelisGrafica = new google.visualization.DataTable();
  dataPelisGrafica.addColumn('string', 'Title');
  dataPelisGrafica.addColumn('number', 'Year');
  dataPelisGrafica.addColumn({type: 'string', role: 'tooltip','p': {'html': true}});
  dataPelisGrafica.addRows(graficaPelis());

  for(var i=0; i<DB.pelis.data.length;i++){
     table.row.add([DB.pelis.data[i].Title,DB.pelis.data[i].Type,DB.pelis.data[i].Year+"",DB.pelis.data[i].imdbID,'<div style="width:530px;overflow:hidden;" title="'+DB.pelis.data[i].Poster+'">'+DB.pelis.data[i].Poster+'</div>']).draw( false );
  }

  var data1 = new google.visualization.DataTable();
  data1.addColumn('string', 'Locación');
  data1.addColumn('number', 'Valor');
  data1.addRows(graficaElementosLocacion());
  table1.rows.add(graficaElementosLocacion()).draw(false);

  var data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'Locación');
  data2.addColumn('number', 'Promedio');
  data2.addRows(graficaPromedioLocacion());
  table2.rows.add(graficaPromedioLocacion()).draw(false);

  var options = {
    'width' :400,
    'height':300,
    'colors': [
      'rgb(137, 209, 243)',
      'rgb(0, 158, 229)',
      'rgb(9, 79, 164)',
      'rgb(134, 200, 45)',
      'rgb(253, 189, 44)',
      'rgb(246, 137, 30)',
      'rgb(179, 179, 179)',
      'rgb(183, 194, 4)',
      'rgb(0, 110, 193)',
      'rgb(62, 182, 187)'
    ],
    pieHole: 0.3,
    pieSliceText: 'none',
    legend: {textStyle: {color: '#363636', fontSize: 8, fontName: 'Arial'}},
    tooltip: {textStyle: {color: '#363636', fontSize: 12, fontName: 'Arial'}}
  };

  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  var chart1 = new google.visualization.PieChart(document.getElementById('chart_div1'));
  var chart2 = new google.visualization.PieChart(document.getElementById('chart_div2'));

  chart.draw(dataPelisGrafica, options);
  chart1.draw(data1, options);
  chart2.draw(data2, options);
}*/

var estados = [
  {
    "id": 'AG',
    "name": "Aguascalientes"
  },
  {
    "id": 'BN',
    "name": "Baja California"
  },
  {
    "id": 'BS',
    "name": "Baja California Sur"
  },
  {
    "id": 'CA',
    "name": "Campeche"
  },
  {
    "id": 'CH',
    "name": "Coahuila"
  },
  {
    "id": 'CO',
    "name": "Colima"
  },
  {
    "id": 'CS',
    "name": "Chiapas"
  },
  {
    "id": 'CU',
    "name": "Chihuahua"
  },
  {
    "id": 'DF',
    "name": "Distrito Federal"
  },
  {
    "id": 'DU',
    "name": "Durango"
  },
  {
    "id": 'GU',
    "name": "Guanajuato"
  },
  {
    "id": 'GO',
    "name": "Guerrero"
  },
  {
    "id": 'HI',
    "name": "Hidalgo"
  },
  {
    "id": 'JA',
    "name": "Jalisco"
  },
  {
    "id": 'EM'  ,
    "name": "México"
  },
  {
    "id": 'MI',
    "name": "Michoacán"
  },
  {
    "id": 'MO',
    "name": "Morelos"
  },
  {
    "id": 'NA',
    "name": "Nayarit"
  },
  {
    "id": 'NL',
    "name": "Nuevo León"
  },
  {
    "id": 'OA',
    "name": "Oaxaca"
  },
  {
    "id": 'PU',
    "name": "Puebla"
  },
  {
    "id": 'QR',
    "name": "Querétaro"
  },
  {
    "id": 'QU',
    "name": "Quintana Roo"
  },
  {
    "id": 'SL',
    "name": "San Luis Potosí"
  },
  {
    "id": 'SI',
    "name": "Sinaloa"
  },
  {
    "id": 'SO',
    "name": "Sonora"
  },
  {
    "id": 'TA',
    "name": "Tabasco"
  },
  {
    "id": 'TM',
    "name": "Tamaulipas"
  },
  {
    "id": 'TL',
    "name": "Tlaxcala"
  },
  {
    "id": 'VE',
    "name": "Veracruz"
  },
  {
    "id": 'YU',
    "name": "Yucatán"
  },
  {
    "id": 'ZA',
    "name": "Zacatecas"
  }
];

var arrayHeader = [];

var arrayDataTable1 = [];
var arrayDataTable2 = [];

var chart1;
var chart2;

var data1;
var data2;

var options;

$.each(estados, function (key, obj) {
    $('#cmbEntidad').append('<option value="'+obj.id+'">'+obj.name+'</option>');
});

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawVisualization);

function cargaEntidad(){
  var entidad = $('#cmbEntidad').val();

  arrayHeader.push('Periodo');
  arrayHeader.push(entidad);

  arrayDataTable1.push(arrayHeader);
  getPuntuacionPorPeriodoTPV(entidad);

  arrayDataTable2.push(arrayHeader);
  getPuntuacionPorPeriodoATM(entidad);

  data1 = google.visualization.arrayToDataTable(arrayDataTable1);
  data2 = google.visualization.arrayToDataTable(arrayDataTable2);

  options = {
    'width' :600,
    'height':300,
    vAxis: {title: 'Puntuación'},
    hAxis: {title: 'Periodo'},
    seriesType: 'bars',
    colors: [
      'rgb(137, 209, 243)',
      'rgb(0, 158, 229)',
      'rgb(9, 79, 164)',
      'rgb(134, 200, 45)',
      'rgb(253, 189, 44)',
      'rgb(246, 137, 30)',
      'rgb(179, 179, 179)',
      'rgb(183, 194, 4)',
      'rgb(0, 110, 193)',
      'rgb(62, 182, 187)'
    ],
    legend: {position: 'none'}
  };
}

function drawVisualization() {

  cargaEntidad();

  chart1 = new google.visualization.ComboChart(document.getElementById('chart_div1'));
  chart1.draw(data1, options);

  chart2 = new google.visualization.ComboChart(document.getElementById('chart_div2'));
  chart2.draw(data2, options);
 }

 function selectEntidad(){
   arrayDataTable1 = [];
   arrayDataTable2 = [];
   arrayHeader = [];
   cargaEntidad();
   chart1.draw(data1, options);
   chart2.draw(data2, options);
 }

function getPuntuacionPorPeriodoTPV(entidad){
  $.each(DB.indicadoresTPV, function (keyEntidad, objEntidad) {
    if(keyEntidad == entidad){
      $.each(objEntidad, function (keyPeriodo, objPeriodo) {
          arrayDataTable1.push([keyPeriodo,objPeriodo.TO_TPV]);
      });
    }
  });
}

function getPuntuacionPorPeriodoATM(entidad){
  $.each(DB.indicadoresATM, function (keyEntidad, objEntidad) {
    if(keyEntidad == entidad){
      $.each(objEntidad, function (keyPeriodo, objPeriodo) {
          arrayDataTable2.push([keyPeriodo,objPeriodo.TO_ATM]);
      });
    }
  });
}
