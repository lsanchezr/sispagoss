$('#btnBusquedaAvanzada').hide();
$.each(DB.indicadores, function (keyGroup, objGroup) {

    var isGroup = false;
    var optgroup = $('<optgroup label="'+keyGroup+'">');
    var option = "";

    $.each(objGroup, function (key, obj) {
      if(key != 'rfp'){
          optgroup.append('<option value="'+key+'">'+key+'</option>');
          isGroup = true;
      }else{
          option = '<option value="'+keyGroup+'">'+keyGroup+'</option>';
      }
    });

    if(isGroup){
      $('#cmbIndicadores').append(optgroup);
      isGroup = false;
    }else{
        $('#cmbIndicadores').append(option);
        option = "";
    }

});

function loadIndicardor(){
   var indicador = $('#cmbIndicadores').val();
   if(indicador != "-1"){
    $('#btnBusquedaAvanzada').show();
   }
   switch(indicador){
     case 'Distribucion de Cajeros - ATM':
        $('#contenedorIndicadores').empty();
        $('#contenedorIndicadores').load("indicadoresATM_V0.2.z2.html");
     break;
     default:
        $('#contenedorIndicadores').empty();
        $('#btnBusquedaAvanzada').hide();
     break;
   }
}
