/*! Datatables altEditor 1.3 - 9-jul-2017 */

/**
 * @summary     altEditor
 * @description Lightweight editor for DataTables
 * @version     1.3
 * @author      Lodela
 * @contact     lodela.n@gmail.com
 * @copyright   Copyright 2017 Norberto Lodela
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 */

$(function( factory ){
  if ( typeof define === 'function' && define.amd ){
    //AMD  más información de AMD y CommonJS en: https://editor.datatables.net/q/AMD
    define( ['jquery', 'datatables.net'], function ( $ ){
      return factory( $, window, document );
    });
  }
  else if ( typeof exports === 'object' ){
    // CommonJS
    module.exports = function (root, $){
      if ( ! root ){
        root = window;
      }
      if (! $ || !$.fn.dataTable){
        $ = require('datatables.net')(root, $).$;
      }
      return factory( $, root, root.document );
    };
  }
  else{
    // Browser
    factory( jQuery, window, document );
  }
}(function( $, window, document, undefined ) {
  'use strict';
  var DataTable = $.fn.dataTable;
  var _instance = 0;

   /**
   * fechas
   */
  function formatDate(date){
    var monthNames = [
      "Enero", "Febrero", "Marzo",
      "Abril", "Mayo", "Junio", "Julio",
      "Augosto", "Septiembre", "Octubre",
      "Noviembre", "Diciembre"
     ];
     var day    = date.getDate();
     var mIndex = date.getMonth();
     var year   = date.getFullYear().toString().substring(2);
     var hrs    = date.getHours();
     var mins   = date.getMinutes();
     var secs   = date.getSeconds();
     return day+'-'+monthNames[mIndex]+'-'+year+' '+hrs+':'+mins+':'+secs;
  }

/* altEditor: Proporciona edición modal de registros para la tabla #homologados */

   var altEditor = function( dt, opts ){
     if (! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8')){
       throw( "Warning: altEditor requiere DataTables 1.10.8 o superior... ANIMO!");
     }
     // configuracion default para el objeto:
     this.c = $.extend(true, {},
       DataTable.defaults.altEditor,
       altEditor.defaults,
       opts
     );
/* @namespace Settings que contiene información personalizable para la instancia de altEditor... */
     this.s = {
       /* @type {DataTable.Api} DataTables' API instance */
       dt: new DataTable.Api( dt ),
       /** @type {String} Unique namespace for events attached to the document */
       namespace: '.altEditor'+(_instance++)
     };
/* @namespace Elementos DOM comunes y útiles para la instancia de clase... */
     this.dom = {
       /* @type {jQuery} altEditor handle */
       modal: $('<div class="dt-altEditor-handle"/>'),
     };
     this._constructor();
   }
   $.extend( altEditor.prototype, {
/* ######################################################################
                              Constructor
###################################################################### */
/* Inicializamos: RowReorder @private */
_activeTable: function(){
  return DB.Efan.functions.active;
},
_constructor: function (){
    console.log('altEditor Enabled')
    var that = this;
    var dt = this.s.dt;
    this._setup();
    dt.on( 'destroy.altEditor', function (){
      dt.off('.altEditor');
      $(dt.table().body()).off( that.s.namespace );
      $(document.body).off( that.s.namespace );
    });
  },

/* ######################################################################
                           Private methods
###################################################################### */
/* Setup dom y acciones de btns @private */
  _setup: function(){
//    console.log('Setup');
    var that = this;
    var dt = this.s.dt;
    // add modal
    $('body').append('\
      <div class="modal fade" id="altEditor-modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">\
        <div class="modal-dialog">\
          <div class="modal-content">\
            <div class="modal-header">\
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" style="color:red;">&times;</span></button>\
              <h3 class="modal-title"></h3>\
            </div>\
            <div class="modal-body">\
              <p></p>\
            </div>\
            <div class="modal-footer">\
              <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>\
              <button type="button" class="btn btn-primary">Guardar Cambios</button>\
            </div>\
          </div>\
        </div>\
      </div>'
    );
/*#######################################################################
                          Btns Definidor
#######################################################################*/

    // btn CargaMasiva:
    if(this.s.dt.button('uploadDefinidor:name')){
      this.s.dt.button('uploadDefinidor:name').action( function(e, dt, node, config){
        that._openUploadDefinidorModal();
      });
    }

/*#######################################################################
                          Btns Homologados
#######################################################################*/
    // Btn de Editar:
    if( this.s.dt.button('edit:name')){
      this.s.dt.button('edit:name').action( function(e, dt, node, config){
        var rows = dt.rows({
          selected: true
        }).count();
        if(rows > 1){
          that._openAlertModal();
        }else{
          that._openEditModal();
        }
      });
      $(document).on('click', '#editRowBtn', function(e){
        e.preventDefault();
        e.stopPropagation();
        //that._editRowData();
      });
    }
    // Btn borrar
    if( this.s.dt.button('delete:name')){
      this.s.dt.button('delete:name').action( function(e, dt, node, config){
        var rows = dt.rows({
          selected: true
        }).count();
        if(rows > 1){
          that._openBulkDellModal();
        }else{
          that._openDeleteModal();
        }
      });
      $(document).on('click', '#deleteRowBtn', function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log('btn clickado...');
        // that._deleteRow();
        // if(that._deleteRow() == 'OK'){
        //   dt.draw(true);
        //   console.log('OK');
        // }
        return false;
      });
    }
    // Btn Nuevo
    if( this.s.dt.button('add:name')){
      this.s.dt.button('add:name').action( function(e, dt, node, config){
        var rows = dt.rows({
          selected: true
        }).count();
        var addWhat = $(this)[0].node.innerText;
//        console.log('rows: '+rows);
        that._openAddModal(addWhat);
      });
      $(document).on('click', '#addRowBtn', function(e){
        e.preventDefault();
        e.stopPropagation();
        //that._addRowData();
      });
    }
    // Btn Carga Masiva
    if( this.s.dt.button('upload:name')){
      this.s.dt.button('upload:name').action( function(e, dt, node, config){
        var rows = dt.rows({
          selected: true
        }).count();
//        console.log('rows: '+rows);
        that._openUploadModal();
      });
      $(document).on('click', '#addRowBtn', function(e){
        e.preventDefault();
        e.stopPropagation();
        //that._addRowData();
      });
    }
  },
/* ######################################################################
                           Eventos y Listeners
###################################################################### */
/*
  @param  {string} name
  @param  {array} args Event arguments
  @private
*/
  _emitEvent: function (name,args){
    this.s.dt.iterator( 'table', function ( ctx, i ){
      $(ctx.nTable).triggerHandler( name+'.dt', args );
    });
  },
/* Modal para hacer una carga masiva DEFINIDOR */
  _openUploadDefinidorModal: function(){
    var that = this;
    var dt = this.s.dt;
    var aoColumns = dt.context[0].aoColumns;
    var columnDefs = {};
    for(var i in aoColumns){
      var title = dt.context[0].aoColumns[i].sTitle;
      var value = title.replace(/ /g,'');
      var val   = quitaacentos(value);
      if(undefined == columnDefs[val]){
        columnDefs[val] = {};
      }columnDefs[val] = '<option value="'+val+'">'+title+'</option>';
    }
    delete columnDefs['EpigrafeEFAN'];
    delete columnDefs['Signo'];
    delete columnDefs['UDA'];
    var data = "";
        data += '<form name="altEditor-form" role="form" id="altUploadDefinidor">';
        data += '<div class="form-group"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="sel1">Opciones:</label></div><div class="col-sm-9 col-md-9 col-lg-9"><select class="form-control" id="sel1"><option value="">Seleccione un destino:</option></select></div><div style="clear:both;"></div></div>';
        data += '<div class="form-group uploadBulkDefinidor"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="bulkUpload">Carga Masiva txt :</label></div><div class="col-sm-9 col-md-9 col-lg-9"><input type="text" id="bulkUploadDefinidor" name="bulkUploadDefinidor" placeholder="Id archivo txt" style="overflow:hidden"  class="form-control  form-control-sm" value=""></div><div style="clear:both;"></div></div>';
        data += "</form>";
    $('#altEditor-modal').on('show.bs.modal', function(){
      $('#altEditor-modal').find('.modal-title').html('Carga masiva Catálogos del definidor - Txt:');
      $('#altEditor-modal').find('.modal-body').html('<pre>' + data + '</pre>');
      $('#altEditor-modal').find('.modal-footer').html("<div class='btn-group bulkUpload'><button type='button' data-content='bulkUpload' class='btn btn-default closeM' data-dismiss='modal'>Close</button><button type='button' data-content='bulkUploadDefinidor' class='btn btn-primary' id='bulkUploadDefinidorBtn'>Subir Datos</button></div>");
    });
    $('#altEditor-modal').modal('show');
    for(var i in columnDefs){
      $('#sel1').append(columnDefs[i]);
    }
    $('#sel1').append('<option value="all"><b>Todos los catálogos</b></option>');
    $('#sel1').change(function(){
      $('.uploadBulkDefinidor').fadeIn(600);
    });
    $('#bulkUploadDefinidorBtn').on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      var totalInputs = $('form[name="altEditor-form"] .form-control').length;
      var count = 0;
      $('form[name="altEditor-form"] .form-control').each(function(i){
        var id = $(this).attr('id');
        if($(this).val() == ''){
          $(this).addClass('empty');
          var message = '<div class="message alert alert-danger" role="alert"><strong>ALERTA!</strong> No puede haber campos vacíos.</div>';
          $('#altEditor-modal .modal-body').append(message);
        }else{
          count = count+1;
        }
      });
      $('.form-control').keyup(function(){
        if ($.trim($(this).val()).length){
          $(this).removeClass('empty');
        }else{
          $(this).addClass('empty');
        }
        $('#altEditor-modal .modal-body .message').hide();
      });
      console.log('count: '+count+' - inputs: '+totalInputs);
      if(count == totalInputs){
        $('#bulkUploadDefinidorBtn, .closeM').fadeOut();
        $('#altEditor-modal .modal-body .alert').remove();
        var message = '<div class="alert alert-info" id="notice"><strong>ESPERE!</strong> Estamos procesando la información del archivo. <span id="counter">00</span></div>';
        $('#altEditor-modal .modal-body').append(message);
        var id2up = {};
        $('form[name="altEditor-form"] .form-control').each(function(i){
          var valor = $(this).val().toString();
          var id    = $(this).attr('id');
          id2up[id] = valor;
        });
        var bulkId;
        var file2Upload = id2up['bulkUploadDefinidor'];
        var indexOf = file2Upload.indexOf('id=');
        if(indexOf !== -1){
          bulkId = file2Upload.split('id=')[1];
        }else{
          bulkId = file2Upload;
        }
        var que = id2up['sel1']+'&'+bulkId;
        var uploadDefs = getDefs(que);
        if(undefined != uploadDefs && uploadDefs == 'ok'){
          var where = id2up['sel1'];
          if(where != 'CuentaContable'){
            var i =9;
            var fadeOI = 9500;
          }else{
            var i      = 35;
            var fadeOI = 34500;
          }
          var NoRegstrs = Object.keys(DB.jksStrk.definidor[where]).length;
          var fadeOutIn = function(){
            $('#altEditor-modal .modal-body .alert').remove();
            $('#bulkUploadDefinidor').val('');
            $('.closeM').fadeIn();
            var message = '<div class="alert alert-success" role="alert" id="success"><strong>Exito!</strong> Ha subido un definidor a: '+where+'. Subieron: '+NoRegstrs+' registros</div>';
            $('#altEditor-modal .modal-body').append(message);
            clearInterval(counter);
          };
          var reload = function(){
            $('.newHmlg').on('click',function(e){
              e.preventDefault();
              $('#altEditor-modal').modal('hide');
            });
          };
          setTimeout(reload, 5000);
          setTimeout(fadeOutIn, fadeOI);
          function count(){
            $("#counter").html(i--);
          }
          var counter = setInterval(function(){
            count();
          },1100);
        }
      }
    });
  },
/* Modal para hacer una carga masiva HOMOLOGADOS */
  _openUploadModal: function(){
    var that = this;
    var dt = this.s.dt;
    var aoColumns = dt.context[0].aoColumns;
    var columnDefs = [];
    for(var i in aoColumns){
      columnDefs.push({ title: dt.context[0].aoColumns[i].sTitle })
    }
    var adata = dt.rows({
      selected: true
    });
    var data = "";
        data += '<form name="altEditor-form" role="form" id="altEditor">';
        data += '<div class="form-group uploadBulk"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="bulkUpload">Carga Masiva txt :</label></div><div class="col-sm-9 col-md-9 col-lg-9"><input type="text" id="bulkUpload" name="bulkUpload" placeholder="Id archivo txt" style="overflow:hidden"  class="form-control  form-control-sm" value=""></div><div style="clear:both;"></div></div>';
        data += "</form>";
    $('#altEditor-modal').on('show.bs.modal', function(){
      $('#altEditor-modal').find('.modal-title').html('Carga masiva desde Txt:');
      $('#altEditor-modal').find('.modal-body').html('<pre>' + data + '</pre>');
      $('#altEditor-modal').find('.modal-footer').html("<div class='btn-group bulkUpload'><button type='button' data-content='bulkUpload' class='btn btn-default closeM' data-dismiss='modal'>Close</button><button type='button' data-content='bulkUpload' class='btn btn-primary' id='bulkUploadBtn'>Subir Datos</button><button type='button' data-content='bulkUpload' class='btn btn-success newHmlg' id='hmlg'>Ir a los nuevos homologados</button></div>");
    });
    $('#altEditor-modal').modal('show');

    $('#bulkUploadBtn').on('click',function(e){upload
      e.preventDefault();
      e.stopPropagation();
      var totalInputs = $('form[name="altEditor-form"] input').length;
      var count = 0;
      $('form[name="altEditor-form"] input').each(function(i){
        var id = $(this).attr('id');
        if($(this).val() == ''){
          $(this).addClass('empty');
          var message = '<div class="message alert alert-danger" role="alert"><strong>ALERTA!</strong> No puede haber campos vacíos.</div>';
          $('#altEditor-modal .modal-body').append(message);
        }else{
          count = count+1;
        }
      });
      $('.form-control').keyup(function(){
        if ($.trim($(this).val()).length){
          $(this).removeClass('empty');
        }else{
          $(this).addClass('empty');
        }
        $('#altEditor-modal .modal-body .message').hide();
      });
      if(count == totalInputs){
        that._bulkUploadData();
      }
    });
  },
  _bulkUploadData: function(){
    var data = [];
    var bulkId;
    $('form[name="altEditor-form"] input').each(function(i){
      var file2Upload = $(this).val();
      var indexOf = file2Upload.indexOf('id=');
      if(indexOf !== -1){
        bulkId = file2Upload.split('id=')[1];
      }else{
        bulkId = file2Upload;
      }
    });
    $('#bulkUploadBtn, .closeM').fadeOut(300);
    $('#altEditor-modal .modal-body .alert').remove();
    var message = '<div class="alert alert-info" id="notice"><strong>ESPERE!</strong> Estamos procesando la información del archivo. <span id="counter">8</span></div>';
    $('#altEditor-modal .modal-body').append(message);
    var que     = 'bulk&'+bulkId;
    var upload  = getHmlg(que);
    if(undefined != upload || upload == 'ok'){
      var i =7;
      var fade_out = function(){
        $('#altEditor-modal .modal-body .alert').remove();
        $('#bulkUpload').val('');
        var message = '<div class="alert alert-success" role="alert" id="success"><strong>Exito!</strong> Ha subido una estructura homologada nueva.</div>';
        $('#altEditor-modal .modal-body').append(message);
        clearInterval(counter);
      };
      var reload = function(){
        getContent('PG_efan', 'efanInit');
        $('.newHmlg, .closeM').fadeIn(300);
        $('.newHmlg').on('click',function(e){
          e.preventDefault();
          $('#altEditor-modal').modal('hide');
        });
      };
      setTimeout(reload, 5000);
      setTimeout(fade_out, 6000);
      function count(){
        $("#counter").html(i--);
      }
      var counter = setInterval(function(){
        count();
      },900);
    }
  },
/* Modal ALERTA */
_openAlertModal: function(){
  var that = this;
  var dt = this.s.dt;
  var aoColumns = dt.context[0].aoColumns;
  var columnDefs = [];
  for(var i in aoColumns){
    columnDefs.push({ title: dt.context[0].aoColumns[i].sTitle })
  }
  var adata = dt.rows({
    selected: true
  });
  var seltd = adata[0].length-1;
  var table = $('#homologados').DataTable();
  var dtTbl = table.rows().data(); //=> todos los registros de la tabla.
  var dtSel = adata.data();
  var objSel = {};
  for (var i=0; i <= seltd; i++){
    var key = adata[0][i];
    var selected = adata.data()[i];
    if(undefined == objSel[key]){
      objSel[key] = {}
    }
    objSel[key] = selected[0];
  }

  var data = "";
      data += '<div><strong>Alerta!</strong> No es permitido la edición multiple.<br>Tienes seleccionados los siguientes registros:<br><br><ul>';
  for (var e in objSel){
      data += '<li>id: '+e+'. Nombre: '+objSel[e]+'</li>';
  }
      data += "</ul></div>";
  $('#altEditor-modal').on('show.bs.modal', function(){
    $('#altEditor-modal').find('.modal-title').html('Mensaje:');
    $('#altEditor-modal').find('.modal-body').html('<pre class="alert alert-danger">' + data + '</pre>');
    $('#altEditor-modal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-default' data-dismiss='modal'>Close</button><button type='button' class='btn btn-default quitar'>Quitar Seleccionados</button>");
  });
  $('#altEditor-modal').modal('show');
  $('.quitar').on('click',function(e){
    if(true == DB.Efan.functions.table()){
      $('#altEditor-modal').modal('hide');
    }
  });
},
/* Bulk Delete */
_openBulkDellModal: function(){
  var that = this;
  var dt = this.s.dt;
  var adata = dt.rows({
    selected: true
  });
  var seltd = adata[0].length-1;
  var dtSel = adata.data();
  var objSel = {};
  for (var i=0; i <= seltd; i++){
    var key = adata[0][i];
    var selected = adata.data()[i];
    if(undefined == objSel[key]){
      objSel[key] = {}
    }
    objSel[key] = selected[0];
  }

  var data = "";
      data += '<div><strong>Alerta!</strong> Borrado multiple de los siguientes registros seleccionados:<br><br><ul>';
  for (var e in objSel){
      data += '<li>id: '+e+'. Nombre: '+objSel[e]+'</li>';
  }
      data += "</ul></div>";
  $('#altEditor-modal').on('show.bs.modal', function(){
    $('#altEditor-modal').find('.modal-title').html('Borrado en bloque:');
    $('#altEditor-modal').find('.modal-body').html('<pre class="alert alert-danger">' + data + '</pre>');
    $('#altEditor-modal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-default' data-dismiss='modal'>Close</button><button type='button' class='btn btn-default bulkDelete'>Borrar Seleccionados</button>");
  });
  $('#altEditor-modal').modal('show');
  $('.bulkDelete').on('click',function(e){
    for (var i=0; i <= seltd; i++){
      dt.row({ selected:true }).remove();
    }
    dt.draw(true);
    $('#altEditor-modal').modal('hide');
  });
},
/* Modal para Editar un row seleccionado: */
  _openEditModal: function(){
    var that = this;
    var dt = this.s.dt;
    var aoColumns = dt.context[0].aoColumns;
    var columnDefs = [];
    for(var i in aoColumns){
      columnDefs.push({ title: dt.context[0].aoColumns[i].sTitle })
    }
    var adata = dt.rows({
      selected: true
    });
    var data = "";
        data += '<form name="altEditor-form" role="form" id="altEditor">';
    for (var j in columnDefs){
      if(columnDefs[j].title == 'Nombre' || columnDefs[j].title == 'Creación'){
        data+= '<div class="form-group '+columnDefs[j].title+'"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="'+columnDefs[j].title+'">'+ columnDefs[j].title+' :</label></div><div class="col-sm-9 col-md-9 col-lg-9"><input type="text" id="'+columnDefs[j].title +'" name="'+columnDefs[j].title+'" placeholder="'+columnDefs[j].title+'" style="overflow:hidden"  class="form-control  form-control-sm" value="'+adata.data()[0][j]+'" disabled></div><div style="clear:both;"></div></div>';
      }else if(columnDefs[j].title == 'Modificado'){
        data+= '<div class="form-group '+columnDefs[j].title+'" style="display:none;"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="'+columnDefs[j].title+'">'+ columnDefs[j].title+' :</label></div><div class="col-sm-9 col-md-9 col-lg-9"><input type="text" id="'+columnDefs[j].title +'" name="'+columnDefs[j].title+'" placeholder="'+columnDefs[j].title+'" style="overflow:hidden"  class="form-control  form-control-sm" value="'+formatDate(new Date())+'" disabled></div><div style="clear:both;"></div></div>';
      }else{
        data += "<div class='form-group "+columnDefs[j].title+"'><div class='col-sm-3 col-md-3 col-lg-3 text-right' style='padding-top:7px;'><label for='" + columnDefs[j].title + "'>" + columnDefs[j].title + ":</label></div><div class='col-sm-9 col-md-9 col-lg-9'><input type='text'  id='" + columnDefs[j].title + "' name='" + columnDefs[j].title + "' placeholder='" + columnDefs[j].title + "' style='overflow:hidden'  class='form-control  form-control-sm' value='" + adata.data()[0][j] + "'></div><div style='clear:both;'></div></div>";
      }
    }
        data += "</form>";
    $('#altEditor-modal').on('show.bs.modal', function(){
      $('#altEditor-modal').find('.modal-title').html('Editar Registro: <span>'+adata.data()[0][0])+'</span>';
      $('#altEditor-modal').find('.modal-body').html('<pre>' + data + '</pre>');
      $('#altEditor-modal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-default' data-dismiss='modal'>Close</button><button type='button' data-content='remove' class='btn btn-primary' id='editRowBtn'>Guardar Cambios</button>");
    });
    $('#altEditor-modal').modal('show');

    $('#editRowBtn').on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      var totalInputs = $('form[name="altEditor-form"] input').length;
      var count = 0;
      $('form[name="altEditor-form"] input').each(function(i){
        var id = $(this).attr('id');
        if($(this).val() == ''){
          $(this).addClass('empty');
          var message = '<div class="message alert alert-danger" role="alert"><strong>ALERTA!</strong> No puede haber campos vacíos.</div>';
          $('#altEditor-modal .modal-body').append(message);
        }else{
          count = count+1;
        }
      });
      $('.form-control').keyup(function(){
        if ($.trim($(this).val()).length){
          $(this).removeClass('empty');
        }else{
          $(this).addClass('empty');
        }
        $('#altEditor-modal .modal-body .message').hide();
      });
      if(count == totalInputs){
        that._editRowData();
      }
    });
  },
  _editRowData: function(){
    var that = this;
    var dt = this.s.dt;
    var data = [];
    $('form[name="altEditor-form"] input').each(function(i){
      data.push( $(this).val() );
    });
    $('#altEditor-modal .modal-body .alert').remove();
    var message = '<div class="alert alert-success" role="alert"><strong>Exito!</strong> Se ha editado con éxito.</div>';
    $('#altEditor-modal .modal-body').append(message);
    dt.row({ selected:true }).data(data);
  },


/* Modal borrar registro */
  _openDeleteModal: function(){
    var that = this;
    var dt = this.s.dt;
    var aoColumns = dt.context[0].aoColumns;
    var columnDefs = [];
    for(var i in aoColumns){
      columnDefs.push({ title: dt.context[0].aoColumns[i].sTitle })
    }
    var adata = dt.rows({
      selected: true
    });
    var data = "";
        data += '<form name="altEditor-form" role="form">';
    for (var i in columnDefs) {
      data += "<div class='form-group'><label for='" + columnDefs[i].title + "'>" + columnDefs[i].title + " : </label><input  type='hidden'  id='" + columnDefs[i].title + "' name='" + columnDefs[i].title + "' placeholder='" + columnDefs[i].title + "' style='overflow:hidden'  class='form-control' value='" + adata.data()[0][i] + "' >" + adata.data()[0][i] + "</input></div>";
    }
      data += "</form>";
    $('#altEditor-modal').on('show.bs.modal', function() {
      $('#altEditor-modal').find('.modal-title').html('Borrar Registro: '+adata.data()[0][0]);
      $('#altEditor-modal').find('.modal-body').html('<pre>' + data + '</pre>');
      $('#altEditor-modal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-default' data-dismiss='modal'>Cancelar</button><button type='button' data-content='remove' class='btn btn-danger' id='deleteRowBtn'>Borrar</button>");
    });
    $('#altEditor-modal').modal('show');
    $('#deleteRowBtn').on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      if(that._deleteRow() == 'OK'){
        // that._rowRef();
        dt.draw(true);
        DB.Efan.functions.table();
      }
      return false;
    });
    return;
  },
  _deleteRow: function(){
    var that = this;
    var dt = this.s.dt;
    var dlt = dt.row({selected:true});
    var activeTable = DB.Efan.functions.active;
    if(activeTable == 'hmlg'){
      delete DB.jksStrk.epiHomlg[dlt.data()[0]];
    }else if(activeTable == 'efnUsrs'){
      delete DB.who.efan[dlt.data()[0]];
    }
    dlt.remove();
    $('#altEditor-modal .modal-body .alert').remove();
    var message = '<div class="alert alert-success" role="alert"><strong>Success!</strong> El registro fue borrado permanentemente.</div>';
    $('#altEditor-modal .modal-body').append(message);
    $('#homologados_filter input').val('');
    $('#altEditor-modal').modal('hide');
    return('OK');
  },

/* Modal Nuevo */
  _openAddModal: function (addWhat){
    var regs;
    var id;
    var that = this;
    var dt = this.s.dt;
    var aoColumns = dt.context[0].aoColumns;
    var columnDefs = [];
    for(var i in aoColumns){
      columnDefs.push({ title: dt.context[0].aoColumns[i].sTitle })
    }
    var data = "";
        data += '<form name="altEditor-form" role="form" id="altNuevo">';
    for (var j in columnDefs){
      if(columnDefs[j].title == 'Creación'){
        data+= '<div class="form-group '+columnDefs[j].title+'" style="display:none;"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="'+columnDefs[j].title+'">'+ columnDefs[j].title+' :</label></div><div class="col-sm-9 col-md-9 col-lg-9"><input type="text" id="'+columnDefs[j].title +'" name="'+columnDefs[j].title+'" placeholder="'+columnDefs[j].title+'" style="overflow:hidden"  class="form-control  form-control-sm" value="'+formatDate(new Date())+'" disabled></div><div style="clear:both;"></div></div>';
      }else if(columnDefs[j].title == 'Modificado'){
        data+= '<div class="form-group '+columnDefs[j].title+'" style="display:none;"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="'+columnDefs[j].title+'">'+ columnDefs[j].title+' :</label></div><div class="col-sm-9 col-md-9 col-lg-9"><input type="text" id="'+columnDefs[j].title +'" name="'+columnDefs[j].title+'" placeholder="'+columnDefs[j].title+'" style="overflow:hidden"  class="form-control  form-control-sm" value="-" disabled></div><div style="clear:both;"></div></div>';
      }else if(columnDefs[j].title == 'Alias'){
        data+= '<div class="form-group '+columnDefs[j].title+'"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="'+columnDefs[j].title+'">'+ columnDefs[j].title+' :</label></div><div class="col-sm-9 col-md-9 col-lg-9"><span class="label label-danger" id="AliasBadge">10</span><input type="number" max="10" maxlength="10" id="'+columnDefs[j].title +'" name="'+columnDefs[j].title+'" placeholder="'+columnDefs[j].title+'" style="overflow:hidden"  class="form-control  form-control-sm"></div><div style="clear:both;"></div></div>';
      }else if(columnDefs[j].title == 'Id'){
        if(addWhat == 'Nuevo usuario EFAN'){
          regs = Object.keys(DB.who.efan).length;
          id   = regs+1;
        }
        data+= '<div class="form-group '+columnDefs[j].title+'" style="display:none"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="'+columnDefs[j].title+'">'+ columnDefs[j].title+' :</label></div><div class="col-sm-9 col-md-9 col-lg-9"><input type="numbers" id="'+columnDefs[j].title +'" name="'+columnDefs[j].title+'" placeholder="'+columnDefs[j].title+'" style="overflow:hidden"  class="form-control  form-control-sm" value="'+id+'"></div><div style="clear:both;"></div></div>';
      }else if(columnDefs[j].title == 'Mail'){
        data += '<div class="form-group"><div class="col-sm-3 col-md-3 col-lg-3 text-right" style="padding-top:7px;"><label for="'+columnDefs[j].title +'">'+columnDefs[j].title+':</label></div><div class="col-sm-9 col-md-9 col-lg-9 input-group mail"><input type="text"  id="'+columnDefs[j].title+'" name="'+columnDefs[j].title+'" placeholder="'+columnDefs[j].title+'" style="overflow:hidden"  class="form-control  form-control-sm" value=""><span class="input-group-addon" id="basic-addon3">@bbva.com</span></div><div style="clear:both;"></div></div>';
      }else{
        data += "<div class='form-group'><div class='col-sm-3 col-md-3 col-lg-3 text-right' style='padding-top:7px;'><label for='" + columnDefs[j].title + "'>" + columnDefs[j].title + ":</label></div><div class='col-sm-9 col-md-9 col-lg-9'><input type='text'  id='" + columnDefs[j].title + "' name='" + columnDefs[j].title + "' placeholder='" + columnDefs[j].title + "' style='overflow:hidden'  class='form-control  form-control-sm' value=''></div><div style='clear:both;'></div></div>";
      }
    }
        data += "</form>";
    $('#altEditor-modal').on('show.bs.modal', function(){
      $('#altEditor-modal').find('.modal-title').html('Agregar un: '+addWhat);
      $('#altEditor-modal').find('.modal-body').html('<pre>' + data + '</pre><div class="alertMessage"></div>');
      var total_nums = 10;
      $('#Alias').attr("max", total_nums).addClass('empty');
      $('#danger').html("10");
      $('#Alias').keyup(function() {
        var longitud = $(this).val().length;
        var resto = total_nums - longitud;
        $('#AliasBadge').html(resto);
        if(resto === 0){
          $('#AliasBadge').html('OK').removeClass('label-danger').addClass('label-success');
          $('#Alias').removeClass('empty').addClass('ok');
          $('#addRowBtn').removeAttr('disabled');
        }else{
          $('#AliasBadge').removeClass('label-success').addClass('label-danger');
          $('#addRowBtn').attr('disabled','disabled');
          $('#Alias').removeClass('ok').addClass('empty');
        }
      });
      $('#altEditor-modal').find('.modal-footer').html("<button type='button' data-content='remove' class='btn btn-default' data-dismiss='modal'>Cerrar</button><button type='button' data-content='remove' class='btn btn-primary' id='addRowBtn'>Agregar Ahora</button>");
      var whatBtn = (addWhat == 'Nuevo epígrafe homologado')? $('#addRowBtn').attr('disabled','disabled') : $('#addRowBtn').removeAttr('disabled');
    });
    $('#altEditor-modal').modal('show');
    $('#addRowBtn').on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      $('#addRowBtn').attr('disabled','disabled');
      var totalInputs = $('form[name="altEditor-form"] input').length;
      var count = 0;
      $('form[name="altEditor-form"] input').each(function(i){
        var id = $(this).attr('id');
        if($(this).val() == ''){
          $(this).addClass('empty');
          var message = '<div class="message alert alert-danger" role="alert"><strong>ALERTA!</strong> No puede haber campos vacíos.</div>';
          $('#altEditor-modal .modal-body .alertMessage').html(message);
        }else{
          var active = that._activeTable();
          if(active == 'hmlg'){
            var find;
            if(id == 'Nombre'){
              // var find = rowExists($(this).val().trim());
              find = that._rowFind($(this).val().trim());
              if(undefined != find && find == 1){
                $(this).addClass('empty');
                $('#altEditor-modal .modal-body .message').remove();
                message = '<div class="message alert alert-danger" role="alert"><strong>ALERTA!</strong> El <b>Nombre</b> YA EXISTE.</div>';
                $('#altEditor-modal .modal-body .alertMessage').html(message);
                count = count-1;
              }
            }else if(id == 'Alias'){
              find = that._rowFind($(this).val().trim());
              var carCount = '';
              if(undefined != find && find == 2){
                $(this).removeClass('ok').addClass('empty');
                message = '<div class="message alert alert-danger" role="alert"><strong>ALERTA!</strong> El <b>Alias</b> YA EXISTE.</div>';
                $('#altEditor-modal .modal-body .alertMessage').append(message);
                count = count-1;
              }
            }else{}
          }
          count = count+1;
        }
      });
      $('.form-control').keyup(function(){
        if ($.trim($(this).val()).length){
          $(this).removeClass('empty');
        }else{
          $(this).addClass('empty');
        }
        $('#altEditor-modal .modal-body .message').hide();
      });
      if(count == totalInputs){
        that._addRowData(addWhat);
      }
    });
  },
  _addRowData: function(addWhat){
    var saveToDB = (addWhat)? addWhat : '';
    var db2Save,keyId;
    var that = this;
    var dt = this.s.dt;
    var data = [];
    $('form[name="altEditor-form"] input').each(function(i){
      data.push( $(this).val());
    });
    switch (true){
      case (saveToDB == 'Nuevo epígrafe homologado'):
        db2Save = DB.jksStrk.epiHomlg;
        var rowId = 'row_'+Object.keys(db2Save).length;
        if(undefined == db2Save[data[0]]){
          db2Save[data[0]] = {};
        }db2Save[data[0]] = {DT_RowId:rowId,alias:data[1],datInit:data[3],datModf:'',desc:data[2],name:data[0]};
        dt.draw(true);
        DB.Efan.functions.table();
        break;
      case (saveToDB == 'Nuevo usuario EFAN'):
        db2Save = DB.who.efan;
        var index = data[0]-1;
        var email  = data[2]+'@bbva.com';
        var edita = data[3].toUpperCase();
        if(undefined == db2Save[index]){
          db2Save[index] = {};
        }db2Save[index] = {edit:edita,id:data[0],mail:email,name:data[1]};
        dt.draw(true);
        DB.Efan.functions.table();
        break;
      default:
        db2Save = '';
    }
    $('#altEditor-modal .modal-body .alert').remove();
    var message = '<div class="alert alert-success" role="alert"><strong>Exito!</strong> Se ha agregado el registro.</div>';
    $('#altEditor-modal .modal-body').append(message);
    // dt.row.add(data).draw(false);
    $.wait( function(){
      $('#altEditor-modal').slideUp('fast', function(){
        $('#altEditor-modal').modal('hide')
      })
    }, 1);
  },
  _getExecutionLocationFolder: function(){
    var fileName = "dataTables.altEditor.js";
    var scriptList = $("script[src]");
    var jsFileObject = $.grep(scriptList, function(el){
      if(el.src.indexOf(fileName) !== -1 ){
        return el;
      }
    });
    var jsFilePath      = jsFileObject[0].src;
    var jsFileDirectory = jsFilePath.substring(0, jsFilePath.lastIndexOf("/") + 1);
    return jsFileDirectory;
  },
  _rowFind: function(find){
    find = find ? find.toLowerCase() : '';
    var that = this;
    var dt = this.s.dt;
    var rows = dt.rows().data();
    var data = DB.jksStrk.epiHomlg;
    var finded;
    for(var e in data){
      var key = e.toLowerCase();
      if(find == key){
        return 1;
      }
      var datos = data[e];
      for(var h in datos){
        var alias = datos['alias'];
        if(find == alias){
          return 2;
        }
      }
    }
    return false;
  },
  _rowRef: function(){
    var that = this;
    var dt = this.s.dt;
    var all_rows;
    dt.rows().draw();
    dt.draw();
    // console.log(dt.rows().draw());
    dt.rows(function(idx, data, node){
      $.fn.dataTable;
      var cls = data[0];
      // console.log(cls);
      all_rows[cls][data[1]] = dt.row(idx);
    });
  }
});

/* altEditor version */
   altEditor.version = '1.3';
   altEditor.defaults = {
     alwaysAsk: false,
     focus: null, // focus, click, hover
     columns: '', // all
     update: null, // false -contesta el editor, true en caso de que update fue clicked. jejeje :D  ANIMO!
     editor: null
   };
/* Classes configurables */
   altEditor.classes = {
       /** @type {String} Class usada por el selector del boton */
       btn: 'btn'
   };
// Listener que escucha la inicialización de la DataTable:
// automáticamente inicializada la dataTable
   $(document).on( 'preInit.dt.altEditor', function (e, settings, json){
     if (e.namespace !== 'dt'){
       return;
     }
     var init     = settings.oInit.altEditor;
     var defaults = DataTable.defaults.altEditor;
     if (init || defaults){
       var opts = $.extend( {}, init, defaults );
       if (init !== false){
         new altEditor( settings, opts  );
       }
     }
   });
// Alias access
   DataTable.altEditor = altEditor;
// Recarga la DataTable despues de borrar un registro
   function rowRef(){
     var repairRowReferences = function(){
       dtable.rows(function(idx, data, node){
         console.log(idx);
         all_rows[data.cls][data.id] = dtable.row(idx);
         return false;
       });
     };
   }
// Quita acentos
  function quitaacentos(s){
    var r=s; //.toLowerCase();
        r = r.replace(new RegExp(/\s/g),"");
        r = r.replace(new RegExp(/[àáâãäå]/g),"a");
        r = r.replace(new RegExp(/[èéêë]/g),"e");
        r = r.replace(new RegExp(/[ìíîï]/g),"i");
        r = r.replace(new RegExp(/ñ/g),"n");
        r = r.replace(new RegExp(/[òóôõö]/g),"o");
        r = r.replace(new RegExp(/[ùúûü]/g),"u");
    return r;
  }
   return altEditor;
}));

$.wait = function( callback, seconds){
  return window.setTimeout( callback, seconds * 1000 );
}
