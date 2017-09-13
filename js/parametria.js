var widthGrid = null;
var arrColumns= [];
var arrPeriodos = [];

$.each(DB.secciones, function (keySeccion, objSeccion) {
    $('#cmbSeccionesValid').append('<option value="'+keySeccion+'">'+keySeccion+'</option>');
    $('#cdSeccion').append('<option value="'+keySeccion+'">'+keySeccion+'</option>');
});

$.each(DB.data_parametria, function (keyPeriodo, objPeriodo) {
  $('#cmbPeriodosValid').append('<option value="'+keyPeriodo+'">'+keyPeriodo+'</option>');
  arrPeriodos.push(keyPeriodo);
});

var dataSet_Param = [];
var periodoActual = $('#cmbPeriodosValid').val();

$.each(DB.data_parametria, function (keyPeriodo, objPeriodo) {
    if(keyPeriodo == periodoActual){
      dataSet_Param  = $.map(objPeriodo, function(el, i) {
        return [el];
      });
    }
});

function selectSeccion(obj){
  $('#cmbConceptosValid').empty();
  $('#cmbConceptosValid').append('<option value="-1" selected>--Conceptos--</option>');
  $.each(DB.secciones, function (keySeccion, objSeccion) {
    if($('#cmbSeccionesValid').val() == keySeccion){
      $.each(objSeccion, function (key, obj) {
        if(key != 'rfp'){
              $('#cmbConceptosValid').append('<option value="'+key+'">'+key+'</option>');
        }
      });
    }
  });
}

function selectSeccionForm(obj){
  $('#cdConcepto').empty();
  $('#cdConcepto').append('<option selected></option>');
  $.each(DB.secciones, function (keySeccion, objSeccion) {
    if($('#cdSeccion').val() == keySeccion){
      $.each(objSeccion, function (key, obj) {
        if(key != 'rfp'){
              $('#cdConcepto').append('<option value="'+key+'">'+key+'</option>');
        }
      });
    }
  });
  $("#formValidacion").bootstrapValidator('revalidateField','cdConcepto');
}

function modalDeletePeriodo(){
  $('#dialogo_eliminar').modal('show');
}

function modalSetPeriodo(){
  $('#dialogo_editar').modal('show');
}

function modalCopyPeriodo(){
  $('#dialogo_duplicar').on('shown.bs.modal', function() {
    $("#formPeriodo").bootstrapValidator('resetForm',true);
  });
  $('#dialogo_duplicar').modal('show');
}

function insertarValidacion(){
  $('#add_validacion').on('shown.bs.modal', function() {
    $('#cdConcepto').empty();
    $('#cdConcepto').append('<option selected></option>');
    $("#formValidacion").bootstrapValidator('resetForm',true);

  });
  $('#add_validacion').modal('show');
}

function guardarValidacion(){

  var objValidacion = {};

  objValidacion.cdValidacion = getSecuencia();
  objValidacion.nbUsuario = 'SISPAGOS';
  objValidacion.fhAlta = $.datepicker.formatDate('dd/mm/yy', new Date());
  objValidacion.fhModificacion = $.datepicker.formatDate('dd/mm/yy', new Date());
  objValidacion.stActivo = 1;

  $('#formValidacion input, #formValidacion select, #formValidacion textarea').each(function(index){
    var input = $(this);
    objValidacion[input.attr('id')] = input.val();
  });

  $('#tableValid').bootstrapTable('insertRow', {index: 0, row: objValidacion});

}

function getSecuencia(){
  var id = (dataSet_Param.length)+1;
  return id;
}

function eliminarPeriodo(){

}

function duplicarPeriodo(){

}

function filtrarPeriodo(){
  var filtro = {};

  if($("#cmbSeccionesValid").val() != "-1"){
    filtro.cdSeccion = $("#cmbSeccionesValid").val();
  }

  if($("#cmbConceptosValid").val() != "-1"){
    filtro.cdConcepto = $("#cmbConceptosValid").val();
  }

  $('#tableValid').bootstrapTable('filterBy',filtro);

  $(".input-group-btn").removeClass("open");
}

function toggle(value,row,index){
    var checked = "";
    if(value == 1){
      checked = "checked";
    }

    return '<label class="switch"><input id="check'+index+'" type="checkbox" '+checked+' onClick="disabledRow(this,'+index+');"><span class="slider round"></span></label>'
}

function disabledRow(objToggle, index){
  var row = $("tr[data-index='"+index+"']");
  var td = $("tr[data-index='"+index+"'] td");
  var rowValidacion = {};

  if(objToggle.checked){
    row.css('background','');
    rowValidacion = $('#tableValid').bootstrapTable('getRowByUniqueId', row.attr('data-uniqueid'));
    rowValidacion.stActivo = "1";
    row.find('td').each (function() {
      $(this).find('a').each(function(){
          $(this).css('color','');
          $(".div"+index).remove();
      });
    });
  }else{
    row.css('background','#FAFAFA');
    rowValidacion = $('#tableValid').bootstrapTable('getRowByUniqueId', row.attr('data-uniqueid'));
    rowValidacion.stActivo = "0";
    if(isToggle()){
      row.find('td').each (function() {
        $(this).find('a').each(function(){
            $(this).css('color','#BDBDBD');
        });
        $(this).before('<div class="div'+index+'" style="position:absolute;height:'+$(this).outerHeight()+'px;width:100%;"></div>');
      });
    }else{
      row.find('td').each (function() {
        var td = $(this);
        td.find('a').each(function(){
          var dataValue = $(this).attr("data-value");
          if(dataValue != undefined){
            $(this).css('color','#BDBDBD');
            $(this).before('<div class="div'+index+'" style="position:absolute;height:'+td.outerHeight()+'px;width:100%;"></div>');
          }
        });
      });
    }
  }
}

function iniValid(){
  $('#tableValid').find('tr').each (function() {
      var tr = $(this);
      var index = tr.attr('data-index');
      if($("#check"+index).attr("checked") != "checked"){
        if(isToggle()){
          tr.find('td').each (function() {
            $(this).find('a').each(function(){
                $(this).css('color','#BDBDBD');
            });
            $(this).before('<div class="div'+index+'" style="position:absolute;height:'+$(this).outerHeight()+'px;width:100%;"></div>');
          });
        }else{
          tr.css('background','rgb(250, 250, 250)');
          tr.find('td').each (function() {
            var td = $(this);
            td.find('a').each (function(){
              var dataValue = $(this).attr("data-value");
              if(dataValue != undefined){
                $(this).css('color','#BDBDBD');
                $(this).before('<div class="div'+index+'" style="position:absolute;height:'+td.outerHeight()+'px;width:100%;"></div>');
              }
            });
          });
        }
      }
  });
}

$('#tableValid').bootstrapTable({
    search: true,
		pagination: true,
		pageSize: 5,
		pageList: [5, 20, 40],
    detailView: true,
    mobileResponsive:true,
    columns: [
      {checkbox: true, align: 'center', valign: 'middle'},
      {field:'cdValidacion',title : 'ID',sortable: true,align:'center'},
      {field:'txSqlQuery',title : 'Query',sortable: true, editable:{type:'textarea'}},
      {field:'txDesQuery',title : 'Desc.Qry',sortable: true, editable:{type:'textarea'}},
      {field:'nbUsuario',title : 'Usuario',sortable: true,visible:false},
      {field:'fhAlta',title : 'Alta',sortable: true,visible:false},
      {field:'fhModificacion',title : 'Modif.',sortable: true,visible:false},
      {field:'nbTabla',title : 'Tbl. Origen',sortable: true,editable:true},
      {field:'nbEsquema',title : 'Esquema Tbl.',sortable: true,editable:true},
      {field:'cdSeccion',title : 'Sección',sortable: true,editable:true},
      {field:'cdConcepto',title : 'Concepto',sortable: true,visible:true,editable:true},
      {field:'stCriticidad',title : 'Criticidad',sortable: true,editable:true,formatter:formatterStCriticidad},
      {field:'fhCierre',title : 'Cierre',sortable: true,editable:true},
      {field:'nbWorkflow',title : 'Workflow',sortable: true,visible:false,editable:false},
      {field:'cdWorkflow',title : 'ID Workflow',sortable: true,visible:false,editable:false},
      {field:'stActivo',title : 'Activo',sortable: false,formatter:toggle}
    ],
    uniqueId: 'cdValidacion',
    data:dataSet_Param,
    exportDataType: 'all',
    exportTypes:['excel','txt'],
    exportOptions:{
      fileName:'Parametría',
      worksheetName:'Parametría'
    },
    checkboxHeader: true,
    maintainSelected: false,
    detailFormatter: function(index, row, element) {
      var html = [];
      var hidden_columns = $('#tableValid').bootstrapTable('getHiddenColumns');
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
      html.push('</ul>');

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

function toggleColumns(isToggle){
  if(isToggle){
    var hidden_columns = $("#tableValid").bootstrapTable('getHiddenColumns');
    for(i = 0; i < hidden_columns.length; i++){
        $('#tableValid').bootstrapTable('showColumn',hidden_columns[i].field);
        arrColumns[i] = hidden_columns[i].field;
    }
  }else{
    for(i = 0; i < arrColumns.length; i++){
        $('#tableValid').bootstrapTable('hideColumn',arrColumns[i]);
    }
  }
}

function isToggle(){
  var data = JSON.stringify($('#tableValid').bootstrapTable('getOptions'));
  var isToggle = JSON.parse(data).cardView;
  return isToggle;
}

$('#tableValid').on('toggle.bs.table', function (cardView) {
  toggleColumns(isToggle());
});

$('#tableValid').on('post-body.bs.table', function () {
  iniValid();
});

$('#tableValid').on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
    $('#remove').prop('disabled', !$('#tableValid').bootstrapTable('getSelections').length);
});

$('#remove').click(function () {
    var ids = getIdSelections();
    $('#tableValid').bootstrapTable('remove', {
        field: 'cdValidacion',
        values: ids
    });
    $('#remove').prop('disabled', true);
});

function getIdSelections() {
    return $.map($('#tableValid').bootstrapTable('getSelections'), function (row) {
        return row.cdValidacion
    });
}

$("#parametria .search").css('width','200px');
$("#parametria .search").addClass("input-group");
$("#parametria .search").append($("#busquedaAvanzada").html());
$("#parametria .search").before($("#botonera").html());
$("#busquedaAvanzada").empty();
$("#botonera").empty();

$('#parametria .stop-propagation').on('click', function (e) {
    e.stopPropagation();
});

$("#btnDuplicarPeriodo").attr('disabled','disabled');

$("#txtPeriodo").typeahead({
    source: arrPeriodos
}).change(function() {
  $("#formPeriodo").bootstrapValidator('revalidateField','txtPeriodo');
});

$("#formPeriodo").bootstrapValidator({
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    txtPeriodo: {
        validators: {
            callback: {
                message: 'El periodo informado es invalido.',
                callback: function(value, validator) {
                    if (value.trim() == '') {
                      return {
                          valid: false,
                          message: 'El nombre del nuevo periodo es requerido'
                      };
                    }

                    if (value.trim().length != 6) {
                        return {
                            valid: false,
                            message: 'El periodo informado tiene que ser de 6 caracteres.'
                        };
                    }

                    if (value.search(/^((2009)|(20[1-2][0-9]))((0[1-9])|(1[0-2]))$/) < 0) {
                        return {
                            valid: false,
                            message: 'El periodo debe estar informado con el formato "YYYYMM".'
                        }
                    }

                    var validPeriodo = false;
                    $.each(arrPeriodos, function( index, valuePeriodo ) {
                        if(value == valuePeriodo){
                          validPeriodo = true;
                        }
                    });

                    if(validPeriodo){
                      return {
                          valid: false,
                          message: 'El periodo ya existe.'
                      }
                    }
                    return true;
                }
            }
        }
    }
  }
}).on('status.field.bv', function(e, data) {
  if(!$("#formPeriodo").data('bootstrapValidator').isValid()){
    $("#btnDuplicarPeriodo").attr('disabled','disabled');
  }else{
    $("#btnDuplicarPeriodo").removeAttr('disabled');
  }
});

$("#btnInsertarValidacion").attr('disabled','disabled');

$("#formValidacion").bootstrapValidator({
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    cdSeccion: {
        validators: {
          notEmpty: {
            message: 'El campo Sección es requerido.'
          }
        }
    },
    cdConcepto: {
        validators: {
          notEmpty: {
            message: 'El campo Concepto es requerido.'
          }
        }
    },
    stCriticidad: {
        validators: {
          notEmpty: {
            message: 'El campo Criticidad es requerido.'
          }
        }
    },
    fhCierre: {
        validators: {
          notEmpty: {
            message: 'El campo Cierre es requerido.'
          },
          date:{
            format: 'DD/MM/YYYY',
            message: 'La fecha de Cierre tiene formato invalido.'
          }
        }
    },
    nbEsquema: {
        validators: {
          notEmpty: {
            message: 'El campo Esquema Tbl es requerido.'
          }
        }
    },
    nbTabla: {
        validators: {
          notEmpty: {
            message: 'El campo Tbl. Origen es requerido.'
          }
        }
    },
    cdWorkflow: {
        validators: {
          /*notEmpty: {
            message: 'El campo ID Workflow es requerido.'
          }*/
        }
    },
    nbWorkflow: {
        validators: {
          /*notEmpty: {
            message: 'El campo Workflow es requerido.'
          }*/
        }
    },
    txSqlQuery: {
        validators: {
          notEmpty: {
            message: 'El campo Query es requerido.'
          }
        }
    },
    txDesQuery: {
        validators: {
          notEmpty: {
            message: 'El campo Desc.Qry es requerido.'
          }
        }
    }
  }
}).on('status.field.bv', function(e, data) {
  if(!$("#formValidacion").data('bootstrapValidator').isValid()){
    $("#btnInsertarValidacion").attr('disabled','disabled');
  }else{
    $("#btnInsertarValidacion").removeAttr('disabled');
  }
});

$('#fhCierre').datepicker({
    dateFormat: 'dd/mm/yy',
    onSelect: function(dateText, inst) {
       $('#formValidacion').bootstrapValidator('revalidateField', 'fhCierre');
    }
});

function formatterStCriticidad(value,row,index){
    var stCriticidad = 'NO CRÍTICO';
    if(value == 1){
      stCriticidad = 'CRÍTICO';
    }
    return stCriticidad;
}
