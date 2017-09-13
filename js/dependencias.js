$.each(DB.relacionTablas, function (keyTable, objTable) {
  var rowTable = '';

  rowTable = '<div class="panel panel-default">'
              +'<div class="panel-heading">'
                +'<div data-parent="#listTable" data-toggle="collapse" href="#'+keyTable+'" style="cursor:pointer;">'
                  +'<span class="badge" style="float:right;">0</span>'
                  +'<h4 class="list-group-item-heading">'+keyTable+'</h4>'
                  +'<p class="list-group-item-text">'+objTable.txComentarios+'</p>'
                +'</div>'
              +'</div>'
              +'<div class="panel-collapse collapse" id="'+keyTable+'">'
                +'<ul class="list-group">';
                  $.each(objTable.dependencias, function (index, dependencia) {
                    rowTable += '<a href="#" class="list-group-item" style="padding-left:30px;">'
                                +'<h5 class="list-group-item-heading"><b>'+dependencia+'</b></h5>'
                                +'<p class="list-group-item-text"></p>'
                              +'</a>';
                  });

  rowTable += '</ul></div></div>';

  $('#listTable').append(rowTable);
});
