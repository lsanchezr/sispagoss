$("#divBusquedaAvanzada").hide();
$('#mapaInformacional').html(DB.imgs.mapa);

var arrayHeader_indicadoresATM = [];
var arrayDataTable_indicadoresATM = [];
var chart_indicadoresATM;
var data_indicadoresATM;
var options_indicadoresATM;

Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

function getPeriodosATM(){
 var arrayPeriodos = [];
 $.each(DB.indicadoresATM, function (keyEntidad, objEntidad) {
     $.each(objEntidad, function (keyPeriodo, objPeriodo) {
         arrayPeriodos.push(keyPeriodo);
     });
 });
 arrayPeriodos = arrayPeriodos.unique();
 return arrayPeriodos;
}

function getPuntuacionPeriodoEntidad(periodo,entidad){
  var puntuacion = 0;
  $.each(DB.indicadoresATM, function (keyEntidad, objEntidad) {
      if(keyEntidad == entidad){
        $.each(objEntidad, function (keyPeriodo, objPeriodo) {
            if(keyPeriodo == periodo){
              puntuacion = objPeriodo.TO_ATM;
            }
        });
      }
  });
  return puntuacion;
}

google.charts.load('current', {'packages':['corechart','bar']});
google.charts.setOnLoadCallback(draw_indicadoresATM);

function carga_indicadoresATM(){

  var entidadSelect = $("#cmbEntidadFederativa").val();
  var periodoSelect = $("#cmbPeriodo").val();

  arrayHeader_indicadoresATM.push('Periodo');
  $.each(estados, function (key, obj) {
      var entidad = obj.id;
      if(entidadSelect == "-1"){
          arrayHeader_indicadoresATM.push(entidad);
      }else{
          arrayHeader_indicadoresATM.push(entidadSelect);
          return false;
      }
  });

  arrayDataTable_indicadoresATM.push(arrayHeader_indicadoresATM);

  var arrPeriodos = getPeriodosATM();

  if(periodoSelect == "-1"){
    $.each(arrPeriodos, function (index, value) {
        var rowPeriodo = [];
        var periodo = value;

          rowPeriodo.push(periodo);

          $.each(estados, function (key, obj) {
              var estado = obj.id;
              if(entidadSelect == "-1"){
                  rowPeriodo.push(getPuntuacionPeriodoEntidad(periodo,estado));
              }else{
                  rowPeriodo.push(getPuntuacionPeriodoEntidad(periodo,entidadSelect));
                  return false;
              }
          });
        arrayDataTable_indicadoresATM.push(rowPeriodo);
    });
  }else{
    var rowPeriodo = [];
    rowPeriodo.push(periodoSelect);
    $.each(estados, function (key, obj) {
      var estado = obj.id;
      if(entidadSelect == "-1"){
          rowPeriodo.push(getPuntuacionPeriodoEntidad(periodoSelect,estado));
      }else{
          rowPeriodo.push(getPuntuacionPeriodoEntidad(periodoSelect,entidadSelect));
          return false;
      }
    });
    arrayDataTable_indicadoresATM.push(rowPeriodo);
  }

  data_indicadoresATM = google.visualization.arrayToDataTable(arrayDataTable_indicadoresATM);

  options_indicadoresATM = {
    //'width' :600,
    //'height':300,
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
    ]
  };
}

function draw_indicadoresATM() {

  carga_indicadoresATM();

  chart_indicadoresATM = new google.visualization.ComboChart(document.getElementById('chart_indicadoresATM'));
  chart_indicadoresATM.draw(data_indicadoresATM, options_indicadoresATM);

 }

 function actualizar_indicadoresATM(){
   arrayDataTable_indicadoresATM = [];
   arrayHeader_indicadoresATM = [];
   carga_indicadoresATM();
   chart_indicadoresATM.draw(data_indicadoresATM, options_indicadoresATM);
 }

function toggleBusquedaAvanzada(){
  if($("#divBusquedaAvanzada").is(":visible")){
    $("#divBusquedaAvanzada").hide();
    $('#cmbEntidadFederativa').empty();
    $('#cmbEntidadFederativa').append('<option value="-1" selected>Todas las Entidades</option>');
    $('#cmbPeriodo').empty();
    $('#cmbPeriodo').append('<option value="-1" selected>Todas los Periodos</option>');
    selectEntidadMapa("-1");
    actualizar_indicadoresATM();
  }else{
    $("#divBusquedaAvanzada").show();

    $.each(estados, function (key, obj) {
        $('#cmbEntidadFederativa').append('<option value="'+obj.id+'">'+obj.name+'</option>');
    });

    var arrPeriodos = getPeriodosATM();

    $.each(arrPeriodos, function (index, value) {
        $('#cmbPeriodo').append('<option value="'+value+'">'+value+'</option>');
    });

  }
}

function selectEntidadMapa(entidad){
  $.each(estados, function (key, obj) {
      if(obj.id == entidad.value){
        document.getElementById("e_"+obj.id).style="fill:rgb(0, 110, 193) !important";
      }else{
        document.getElementById("e_"+obj.id).style="";
      }
  });
}

function loadEventMap(){
    $.each(estados, function (key, obj) {
      document.getElementById("e_"+obj.id).onclick = function() {
        document.getElementById("cmbEntidadFederativa").value = obj.id;
        actualizar_indicadoresATM();
        var entidad = {};
        entidad.value = obj.id;
        selectEntidadMapa(entidad);
      };
    });
}

loadEventMap();

$(window).resize(function(){
  actualizar_indicadoresATM();
});
