var dataSet_Resultados = [];

$.each(DB.secciones, function (keySeccion, objSeccion) {
    $('#cmbSeccionesResult').append('<option value="'+keySeccion+'">'+keySeccion+'</option>');
});

$.each(DB.data_parametria, function (keyPeriodo, objPeriodo) {
  $('#cmbPeriodosResult').append('<option value="'+keyPeriodo+'">'+keyPeriodo+'</option>');
});

$.each(DB.data_parametria, function (keyPeriodo, objPeriodo) {
    if(keyPeriodo == $('#cmbPeriodosResult').val()){
      dataSet_Resultados  = $.map(objPeriodo, function(el, i) {
        return [el];
      });
    }
});

function selectSeccionResult(obj){
  $('#cmbConceptosResult').empty();
  $('#cmbConceptosResult').append('<option value="-1" selected>--Conceptos--</option>');
  $.each(DB.secciones, function (keySeccion, objSeccion) {
    if($('#cmbSeccionesResult').val() == keySeccion){
      $.each(objSeccion, function (key, obj) {
        if(key != 'rfp'){
              $('#cmbConceptosResult').append('<option value="'+key+'">'+key+'</option>');
        }
      });
    }
  });
}

function filtrarPeriodoResult(){
  var filtro = {};

  if($("#cmbSeccionesResult").val() != "-1"){
    filtro.cdSeccion = $("#cmbSeccionesResult").val();
  }

  if($("#cmbConceptosResult").val() != "-1"){
    filtro.cdConcepto = $("#cmbConceptosResult").val();
  }

  $('#tableResult').bootstrapTable('filterBy',filtro);

  $(".input-group-btn").removeClass("open");
}

$('#tableResult').bootstrapTable({
    search: true,
		pagination: true,
		pageSize: 10,
		pageList: [10, 20, 40],
    detailView: true,
    mobileResponsive:true,
    data:dataSet_Resultados,
    columns: [
      {field:'cdValidacion',title : 'ID',sortable: true, align:'center'},
      {field:'txSqlQuery',title : 'Query',sortable: true,visible:false},
      {field:'txDesQuery',title : 'Desc.Qry',sortable: true},
      {field:'resultado.txResultado',title : 'Resultado',sortable: true},
      //{field:'nbUsuario',title : 'Usuario',sortable: true,visible:false},
      //{field:'fhAlta',title : 'Alta',sortable: true,visible:false},
      //{field:'fhModificacion',title : 'Modif.',sortable: true,visible:false},
      {field:'nbTabla',title : 'Tbl. Origen',sortable: true,visible:false},
      {field:'nbEsquema',title : 'Esquema Tbl.',sortable: true,visible:false},
      {field:'cdSeccion',title : 'Sección',sortable: true,visible:true},
      {field:'cdConcepto',title : 'Concepto',sortable: true},
      //{field:'stCriticidad',title : 'Criticidad',sortable: true,visible:true,formatter:formatterStCriticidad},
      {field:'fhCierre',title : 'Cierre',sortable: true, align:'center'},
      {field:'resultado.fhEjecucion',title : 'Ejecución',sortable: true,align:'center'},
      {field:'nbWorkflow',title : 'Workflow',sortable: true,visible:false},
      {field:'cdWorkflow',title : 'ID Workflow',sortable: true,visible:false}
      //{field:'stActivo',title : 'Activo',sortable: true,formatter:formatterStActivo}
    ],
    uniqueId: 'cdValidacion',
    checkboxHeader: false,
    maintainSelected: false,
    exportDataType: 'all',
    exportTypes:['excel'],
    exportOptions:{
      fileName:'Resultados',
      worksheetName:'Resultados'
    },
    detailFormatter: function(index, row, element) {
      var html = [];
      var hidden_columns = $('#tableResult').bootstrapTable('getHiddenColumns');
      html.push('<ul class="list-group" style="margin-bottom:0px;">');
      $.each(row, function (key, value) {
          for(i = 0; i < hidden_columns.length;i++){
            var title = hidden_columns[i].title;
            var field = hidden_columns[i].field;
            if(field == key){
              html.push('<li class="list-group-item"><span class="glyphicon glyphicon-asterisk" aria-hidden="true" style="color:#337ab7"></span> <b>' + title + ':</b> ' + value +'</li>');
            }
          }
      });
      return html;
    },
    formatShowingRows: function (pageFrom, pageTo, totalRows) {
        return 'Mostrando ' + pageFrom + ' al ' + pageTo + ' de ' + totalRows + ' registros';
    },
    formatRecordsPerPage: function (pageNumber) {
    	return pageNumber + ' registros por pagina';
    },
    formatLoadingMessage: function () {
    	return 'Cargando, espere por favor...';
    },
    formatSearch: function () {
    	return 'Buscar';
    },
    formatNoMatches: function () {
    	return 'No se encontro informaci&oacute;n';
    }
});

function formatterStActivo(value,row,index){
    var stActivo = 'INACTIVO';
    if(value == 1){
      stActivo = 'ACTIVO';
    }
    return stActivo;
}

function formatterStCriticidad(value,row,index){
    var stCriticidad = 'NO CRÍTICO';
    if(value == 1){
      stCriticidad = 'CRÍTICO';
    }
    return stCriticidad;
}

$("#resultados .search").css('width','200px');
$("#resultados .search").addClass("input-group");
$("#resultados .search").append($("#busquedaAvanzadaResult").html());
$("#busquedaAvanzadaResult").empty();

$('#resultados .stop-propagation').on('click', function (e) {
    e.stopPropagation();
});
