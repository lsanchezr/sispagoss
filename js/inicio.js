var fontHeader = {
    size: 20,
    family: "Arial"
}

var fontBody = {
    size: 12,
    family: "Arial"
}

var fontBodyPrincipal = {
    size: 20,
    family: "Arial"
}

var fontFooter = {
    size: 15,
    family: "Arial"
}

var fontFooterPrincipal = {
    size: 20,
    family: "Arial"
}

window.onload = function(){
  var elemento = document.getElementById("clicloRadial");
  var contexto = elemento.getContext('2d');

  var cContenedor = new CirculoContenedor(contexto,200,200,150);

  var cPrincipal = new CirculoPrincipal(contexto,200,200,80);
  cPrincipal.setBody("SISPAGOS","blue",fontBodyPrincipal);
  cPrincipal.setFooter("692 \nIndicador(es)","green",fontFooterPrincipal);

  var c1 = new Circulo(contexto,200,50,40);
  c1.setHeader("1","blue",fontHeader);
  c1.setBody("Cuentas \nde Nivel 4","blue",fontBody);
  c1.setFooter("37","green",fontFooter);

  var c2 = new Circulo(contexto,320,120,40);
  c2.setHeader("2","blue",fontHeader);
  c2.setBody("Tarjetas","blue",fontBody);
  c2.setFooter("513","green",fontFooter);

  var c3 = new Circulo(contexto,340,250,40);
  c3.setHeader("3","blue",fontHeader);
  c3.setBody("Sistema y \nMedios","blue",fontBody);
  c3.setFooter("12","green",fontFooter);

  var c4 = new Circulo(contexto,260,340,40);
  c4.setHeader("4","blue",fontHeader);
  c4.setBody("Medios de \nAcceso","blue",fontBody);
  c4.setFooter("81","green",fontFooter);

  var c5 = new Circulo(contexto,140,340,40);
  c5.setHeader("5","blue",fontHeader);
  c5.setBody("Cheques","blue",fontBody);
  c5.setFooter("10","green",fontFooter);

  var c6 = new Circulo(contexto,60,250,40);
  c6.setHeader("6","blue",fontHeader);
  c6.setBody("Fraude","blue",fontBody);
  c6.setFooter("27","green",fontFooter);

  var c7 = new Circulo(contexto,80,120,40);
  c7.setHeader("7","blue",fontHeader);
  c7.setBody("Operaciones \nen Sucursal","blue",fontBody);
  c7.setFooter("12","green",fontFooter);

}

class Circulo {
  constructor(contexto,x,y,size) {
    this.contexto = contexto;
    this.x = x;
    this.y = y;
    this.size = size;

    this.contexto.fillStyle="#ffffff";
    this.contexto.beginPath();
    this.contexto.arc(x, y, size, 0, Math.PI * 2, true);
    this.contexto.fill();
    this.contexto.lineWidth = 3;
    this.contexto.strokeStyle = "blue";
    this.contexto.stroke();
  }

  setHeader(text,color,font) {
    this.contexto.fillStyle=color;
    this.contexto.font = font.size+'px '+font.family;
    var positionX = (((this.size*2) - this.contexto.measureText(text).width)/2)+(this.x-this.size);
    var positionY = (((this.size*2)/3)+(this.y-this.size))-(((this.size*2)/3)-font.size)/2;
    this.contexto.fillText(text,positionX,positionY);
  }

  setBody(text,color,font) {
    this.contexto.fillStyle=color;
    this.contexto.font = font.size+'px '+font.family;

    var lines = text.split('\n');
    var positionX = 0;
    var positionY = 0;
    for (var i = 0; i<lines.length; i++){
      positionX = (((this.size*2) - this.contexto.measureText(lines[i]).width)/2)+(this.x-this.size);
      positionY = ((((this.size*2)/3)*2)+(this.y-this.size))-(((this.size*2)/3)-((font.size+10)*i))/2;
      this.contexto.fillText(lines[i],positionX,positionY);
    }
  }

  setFooter(text,color,font) {
    this.contexto.fillStyle=color;
    this.contexto.font = font.size+'px '+font.family;

    var lines = text.split('\n');
    var positionX = 0;
    var positionY = 0;
    for (var i = 0; i<lines.length; i++){
      positionX = (((this.size*2) - this.contexto.measureText(lines[i]).width)/2)+(this.x-this.size);
      positionY = ((((this.size*2)/3)*3)+(this.y-this.size))-(((this.size*2)/3)-((font.size+10)*i))/2;
      this.contexto.fillText(lines[i],positionX,positionY);
    }
  }
}

class CirculoContenedor {
  constructor(contexto,x,y,size) {
    this.contexto = contexto;
    this.x = x;
    this.y = y;
    this.size = size;

    contexto.fillStyle="rgba(255,255,0,0)";
    this.contexto.beginPath();
    this.contexto.arc(x, y, size, 0, Math.PI * 2, true);
    this.contexto.fill();
    this.contexto.lineWidth = 15;
    this.contexto.strokeStyle = "#A4A4A4";
    this.contexto.stroke();
  }
}

class CirculoPrincipal {
  constructor(contexto,x,y,size) {
    this.contexto = contexto;
    this.x = x;
    this.y = y;
    this.size = size;

    this.contexto.fillStyle="#ffffff";
    this.contexto.beginPath();
    this.contexto.arc(x, y, size, 0, Math.PI * 2, true);
    this.contexto.fill();
    this.contexto.lineWidth = 3;
    this.contexto.strokeStyle = "blue";
    this.contexto.stroke();
  }

  setBody(text,color,font) {
    this.contexto.fillStyle=color;
    this.contexto.font = font.size+'px '+font.family;

    var lines = text.split('\n');
    var positionX = 0;
    var positionY = 0;
    for (var i = 0; i<lines.length; i++){
      positionX = (((this.size*2) - this.contexto.measureText(lines[i]).width)/2)+(this.x-this.size);
      positionY = ((((this.size*2)/2)*1)+(this.y-this.size))-(((this.size*1)/2)-((font.size+10)*i))/2;
      this.contexto.fillText(lines[i],positionX,positionY);
    }

  }

  setFooter(text,color,font) {
    this.contexto.fillStyle=color;
    this.contexto.font = font.size+'px '+font.family;

    var lines = text.split('\n');
    var positionX = 0;
    var positionY = 0;
    for (var i = 0; i<lines.length; i++){
      positionX = (((this.size*2) - this.contexto.measureText(lines[i]).width)/2)+(this.x-this.size);
      positionY = ((((this.size*2)/2)*2)+(this.y-this.size))-(((this.size*3)/2)-((font.size+10)*i))/2;
      this.contexto.fillText(lines[i],positionX,positionY);
    }
  }

}
