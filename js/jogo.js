var canvas = document.getElementById("canvas-jogo"); // Referência ao canvas, o nosso 'papel'
canvas.width = 480; //Largura do canvas
canvas.height = 320; //Altura do canvas
var contexto = canvas.getContext("2d"); //Contexto do canvas, o nosso 'lápis'
contexto.font = '15px serif';
//Para nao ficar aparecendo varios alert
var flag = true;
//Propriedades da Bola
var pontuacao = 0;
var posX = canvas.width/2;
var posY = canvas.height-30;
var dX = 2;
var dY = -2;
var raioBola = 10;
//Propriedades da Base
var baseAltura = 10;
var baseLargura = 75
var baseX = (canvas.width-baseLargura)/2;
//Propriedade Tijolos
var tijoloNumLinhas = 3;
var tijoloNumColunas = 5;
var tijoloLargura = 75;
var tijoloAltura = 20;
var tijoloEspacamento = 10;
var tijoloDistTopo = 30;
var tijoloDistEsquerda = 30;


var tijolos = [];
for(c=0; c<tijoloNumColunas; c++) {
    tijolos[c] = [];
    for(l=0; l<tijoloNumLinhas; l++) {
        tijolos[c][l] = { x: 0, y: 0 ,estado:1};
    }
}

//Movimentos
var teclaEsquerdaPressionada = false;
var teclaDireitaPressionada = false;
//Event Listeners
document.addEventListener("keydown", trataTeclaBaixo, false);
function trataTeclaBaixo(evento){
	if(evento.keyCode == 39){
		teclaDireitaPressionada = true;
	}else if(evento.keyCode == 37){
		teclaEsquerdaPressionada = true;
	}
}
document.addEventListener("keyup", trataTeclaCima, false);
function trataTeclaCima(evento){
    if(evento.keyCode == 39) {
        teclaDireitaPressionada = false;
    }else if(evento.keyCode == 37){
		teclaEsquerdaPressionada = false;
	}
}


function desenha(){
	contexto.clearRect(0,0,canvas.width,canvas.height);
	contexto.fillText("Pontuacao: "+pontuacao,0,10);
	desenhaBorda();
	desenhaBola();
	desenhaBase();
	detectaColisoes();
	desenhaTijolos();
}
function desenhaBorda(){
	//Desenhar borda
	contexto.beginPath();
	contexto.rect(0, 0, 480, 320);
	contexto.strokeStyle = "rgb(0, 0, 255)";
	contexto.stroke();
	contexto.closePath();
	document.getElementById("pts").innerHTML = "<label for='total'>"+pontuacao+"</label> ";
}
function movimentoBola(){
	if(posX + dX < raioBola || posX + dX > canvas.width - raioBola){
		dX = -dX;
	}
	if(posY + dY < raioBola){
		dY = -dY;
	}else if(posY + dY > canvas.height - raioBola){
		if(posX > baseX && posX < baseX + baseLargura){
			dY = -dY;
		}else if(flag){
			flag = false;
			alert("Fim do Jogo! Perdeu!");
			document.location.reload();
		}
	}
	posX += dX;
	posY += dY;
}
function movimentoBase(){
	if(teclaDireitaPressionada && baseX < canvas.width - baseLargura){
        baseX += 5;
	}else if(teclaEsquerdaPressionada && baseX > 0){
        baseX -= 5;
	}
	if(teclaDireitaPressionada && baseX < canvas.width - baseLargura){
        baseX += 5;
	}else if(teclaEsquerdaPressionada && baseX > 0){
        baseX -= 5;
	}
}

function detectaColisoes(){
	for(c=0; c < tijoloNumColunas; c++){
        for(l=0; l < tijoloNumLinhas; l++){
			var tijolo = tijolos[c][l];
			if(posX > tijolo.x && posX < tijolo.x + tijoloLargura && posY > tijolo.y && posY < tijolo.y + tijoloAltura) {
                dY = -dY;
				tijolo.estado = 0;
				pontuacao++;
            }
		}
	}
}

function desenhaBola(){
	contexto.beginPath();
	contexto.arc(posX, posY, raioBola, 0, Math.PI*2);
	contexto.fillStyle = "green";
	contexto.fill();
	contexto.closePath();
	movimentoBola();
}
function desenhaBase() {
	contexto.beginPath();
	contexto.rect(baseX, canvas.height-baseAltura, baseLargura, baseAltura);
	contexto.fillStyle = "#0095DD";
	contexto.fill();
	contexto.closePath();
	movimentoBase();
}
function desenhaTijolos(){
	for(c=0; c < tijoloNumColunas; c++){
        for(l=0; l < tijoloNumLinhas; l++){
            tijolos[c][l].x = 0;
            tijolos[c][l].y = 0;
			if(tijolos[c][l].estado == 1){
				contexto.beginPath();
				var tijoloX = (c*(tijoloLargura+tijoloEspacamento))+tijoloDistEsquerda;
				var tijoloY = (l*(tijoloAltura+tijoloEspacamento))+tijoloDistTopo;
				tijolos[c][l].x = tijoloX;
                tijolos[c][l].y = tijoloY;
				contexto.rect(tijoloX, tijoloY, tijoloLargura, tijoloAltura);
				contexto.fillStyle = "#0095DD";
				contexto.fill();
				contexto.closePath();
			}
        }
    }	
}
setInterval(desenha,10);