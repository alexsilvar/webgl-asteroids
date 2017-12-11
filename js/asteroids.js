//Configuracoes iniciais do canvas context 2d
var canvas = document.getElementById("canvas-jogo"); // Referência ao canvas, o nosso 'papel'
canvas.width = 800; //Largura do canvas
canvas.height = 600; //Altura do canvas
var contexto = canvas.getContext("2d"); //Contexto do canvas, o nosso 'lápis'
contexto.font = '15px serif';
contexto.fillStyle = 'white';
//Fim das configuracoes padrão canvas
//Dados da nave
initialScreen();
var gameIsRunning = false;
var nave;
//Controle de Movimentos
var teclaEsquerdaPressionada = false;
var teclaDireitaPressionada = false;
var teclaCimaPressionada = false;
var teclaBaixoPressionada = false;
var teclaSpacePressionada = false;
//Event Listeners
document.addEventListener("keydown", trataTeclaBaixo, false);
function trataTeclaBaixo(evento) {
    if (evento.keyCode == 39) {
        teclaDireitaPressionada = true;
    } else if (evento.keyCode == 37) {
        teclaEsquerdaPressionada = true;
    } else if (evento.keyCode == 40) {
        teclaBaixoPressionada = true;
    } else if (evento.keyCode == 38) {
        teclaCimaPressionada = true;
    } else if (evento.keyCode == 32) {
        teclaSpacePressionada = true;
    }
}
document.addEventListener("keyup", trataTeclaCima, false);
function trataTeclaCima(evento) {
    if (evento.keyCode == 39) {
        teclaDireitaPressionada = false;
    } else if (evento.keyCode == 37) {
        teclaEsquerdaPressionada = false;
    } else if (evento.keyCode == 40) {
        teclaBaixoPressionada = false;
    } else if (evento.keyCode == 38) {
        teclaCimaPressionada = false;
    } else if (evento.keyCode == 32) {
        teclaSpacePressionada = false;
    }
    if (!gameIsRunning) {
        if (evento.keyCode == 13) {
            gameStart();
            gameIsRunning = true;
        }
    }
}


function desenha() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
	desenhaFundo();
    desenhaNave();
    desenhaTiros();
    desenhaAsteroids();
    detectaColisoes();
    desenhaUI();
}
var jogo;
/**
 *Asteroids
 */
//Asteroids que vao aparecer
var asteroids = [];
var nasteroids = 0;
var intervAster = 5000;
function desenhaAsteroids() {
    for (i = 0; i < nasteroids; i++) {
		st = contexto.fillStyle;
		contexto.fillStyle = asteroids[i].cor;
        contexto.beginPath();
		img = new Image();
		if(asteroids[i].radius == 15){
			img.src = "imagens/aster1.png";
		}else if(asteroids[i].radius == 25){
			img.src = "imagens/aster2.png";
		}else{//radius == 35
			img.src = "imagens/aster3.png";
		}
		dx = asteroids[i].centro.x - asteroids[i].radius/2;
		dy = asteroids[i].centro.y - asteroids[i].radius/2;
		//dWidth = asteroids[i].centro.x - asteroids[i].radius/2;
		//dHeight = asteroids[i].centro.y - asteroids[i].radius/2;
		asteroids[i].angular += 2;
		if(asteroids[i].angular>360){
			asteroids[i].angular = 0;
		}
		contexto.translate(asteroids[i].centro.x,asteroids[i].centro.y);
		contexto.rotate(asteroids[i].angular * Math.PI / 180);
		
		//contexto.drawImage(img,211,392,24,8,0,0,24,8);
		contexto.drawImage(img, - asteroids[i].radius/2, - asteroids[i].radius/2);
			
		contexto.setTransform(1, 0, 0, 1, 0, 0);
		contexto.translate(0, 0);
		
		
        //contexto.arc(asteroids[i].centro.x, asteroids[i].centro.y, asteroids[i].radius, 0, 2 * Math.PI);		
		//contexto.drawImage(img, dx, dy);
        contexto.fill();
        contexto.closePath();
		contexto.fillStyle = st;

        //Animando as coisas
        //Transportando a nave para outro lado da cena
        velx = (asteroids[i].centro.x - asteroids[i].frente.x) / (Math.floor((Math.random() * 6) + 6));
        vely = (asteroids[i].centro.y - asteroids[i].frente.y) / (Math.floor((Math.random() * 6) + 6));



        if (asteroids[i].centro.x > canvas.width) {
            asteroids[i].centro.x = 0;
        } else if (asteroids[i].centro.x < 0) {
            asteroids[i].centro.x = canvas.width;
        } else {
            asteroids[i].centro.x += velx;
        }
        if (asteroids[i].centro.y > canvas.height) {
            asteroids[i].centro.y = 0;
        } else if (asteroids[i].centro.y < 0) {
            asteroids[i].centro.y = canvas.height;
        } else {
            asteroids[i].centro.y += vely;
        }
        asteroids[i].frente = {x: asteroids[i].centro.x, y: (asteroids[i].centro.y - 2)};
        asteroids[i].centro = rotate(asteroids[i].centro, asteroids[i].frente, asteroids[i].rotacao);
    }
}
function novoAsteroid() {
    asteroids[nasteroids] = new Object();
    asteroids[nasteroids].centro = {x: 0, y: 0};
    if (Math.random() > 0.5) {
        asteroids[nasteroids].centro.x = Math.floor(Math.random() * canvas.width);
        if (Math.random() > 0.5) {
            asteroids[nasteroids].centro.y = 0;
        } else {
            asteroids[nasteroids].centro.y = canvas.height;
        }
    } else {
        asteroids[nasteroids].centro.y = Math.floor(Math.random() * canvas.height);
        if (Math.random() > 0.5) {
            asteroids[nasteroids].centro.x = 0;
        } else {
            asteroids[nasteroids].centro.x = canvas.width;
        }
    }
    size = Math.random();
    if (size < 0.3333) {
        //asteroide pequeno
        asteroids[nasteroids].radius = 15;
        asteroids[nasteroids].canDivide = false;
    } else if (size < 0.6666) {
        //asteroide medio
        asteroids[nasteroids].radius = 25;
        asteroids[nasteroids].canDivide = true;
    } else {
        //asteroide grande
        asteroids[nasteroids].radius = 35;
        asteroids[nasteroids].canDivide = true;
    }
    asteroids[nasteroids].frente = {x: asteroids[nasteroids].centro.x, y: (asteroids[nasteroids].centro.y - 2)};
    asteroids[nasteroids].rotacao = Math.floor((Math.random() * 360));
    asteroids[nasteroids].frente = rotate(asteroids[nasteroids].centro, asteroids[nasteroids].frente, asteroids[nasteroids].rotacao);
	r = Math.floor(Math.random() * 255);
	g = Math.floor(Math.random() * 255);
	b = Math.floor(Math.random() * 255);
	asteroids[nasteroids].cor = 'rgb('+r+','+g+','+b+')';
	asteroids[nasteroids].angular = Math.floor(Math.random() * 360);
	
    nasteroids++;
}
var criaAsteroids;
/**
 *TIROS
 */
var tiros = [];
var ntiros = 0;
function removePos(vetor, length, indexToRemove) {
    for (i = indexToRemove; i < length - 1; i++) {
        vetor[i] = vetor[i + 1];
    }
}


function desenhaTiros() {
    posTirosFora = [];
    cont = 0;
    for (i = 0; i < ntiros; i++) {
        if (tiros[i].b.x > canvas.width || tiros[i].b.x < 0 || tiros[i].b.y > canvas.height || tiros[i].b.y < 0) {
            posTirosFora[cont] = i;
            cont++;
        }
    }
    for (i = 0; i < cont; i++) {
        removePos(tiros, ntiros, posTirosFora[i]);
        ntiros--;
    }
	st = contexto.lineWidth;
	contexto.lineWidth = 5;
    for (i = 0; i < ntiros; i++) {
        contexto.beginPath();
		
        contexto.moveTo(tiros[i].b.x, tiros[i].b.y);
        contexto.lineTo(tiros[i].a.x, tiros[i].a.y);
		
		
        contexto.stroke();
        contexto.closePath();
        //Andando o tiro
        tiros[i].b = tiros[i].a;
        tiros[i].a = {x: tiros[i].b.x, y: tiros[i].b.y - 7};
        tiros[i].a = rotate(tiros[i].b, tiros[i].a, tiros[i].rotacao);
    }
	contexto.lineWidth = st;
}
function novoTiro() {
    if (teclaSpacePressionada) {
        tiros[ntiros] = new Object();
        tiros[ntiros].b = {x: nave.tri[2].x, y: nave.tri[2].y};
        tiros[ntiros].a = {x: nave.tri[2].x, y: nave.tri[2].y - 7};
        //No momento que um tiro e disparado ele armazena sua direcao
        tiros[ntiros].rotacao = nave.rotacao;
        tiros[ntiros].a = rotate(tiros[ntiros].b, tiros[ntiros].a, tiros[ntiros].rotacao);
        ntiros++;
    }
}
var atirar;
/**
 *Rotaciona B em torno de A em tantos graus
 *tanto a quanto B devem ser estruturas contendo x e y 
 */
function rotate(a, b, graus) {
    rad = graus * Math.PI / 180;
    novox = a.x + (Math.cos(rad) * (b.x - a.x) - Math.sin(rad) * (b.y - a.y));
    novoy = a.y + (Math.sin(rad) * (b.x - a.x) + Math.cos(rad) * (b.y - a.y));
    return {x: novox, y: novoy};
}

function rotacionar(index) {
    //Jamais me esquecerei de que separar as paradas muda o resultado
    rad = nave.rotacao * Math.PI / 180;
    novox = nave.x + (Math.cos(rad) * (nave.tri[index].x - nave.x) - Math.sin(rad) * (nave.tri[index].y - nave.y));
    novoy = nave.y + (Math.sin(rad) * (nave.tri[index].x - nave.x) + Math.cos(rad) * (nave.tri[index].y - nave.y));
    nave.tri[index].x = novox;
    nave.tri[index].y = novoy;
}
/**
 *Nave
 */
function desenhaNave() {
    movimentoNave();
    contexto.beginPath();
    //Descendo para a esquerda
    nave.tri[0].x = nave.x - 10;
    nave.tri[0].y = nave.y + 10;
    rotacionar(0);

    //Descendo para a direita
    nave.tri[1].x = nave.x + 10;
    nave.tri[1].y = nave.y + 10;
    rotacionar(1);

    //Subindo
    nave.tri[2].x = nave.x;
    nave.tri[2].y = nave.y - 10;
    rotacionar(2);
	
	contexto.moveTo(nave.x, nave.y);
	contexto.lineTo(nave.tri[0].x, nave.tri[0].y);
	contexto.lineTo(nave.tri[2].x, nave.tri[2].y);
	contexto.lineTo(nave.tri[1].x, nave.tri[1].y);
	contexto.lineTo(nave.x, nave.y);
	
	contexto.fill();
    contexto.closePath();
	
	img = new Image();
	img.src = "imagens/red.png";
	//34,28
	//42,35
	
	contexto.translate(nave.x,nave.y);
	contexto.rotate(nave.rotacao * Math.PI / 180);
		
	contexto.drawImage(img, -21, -15,40,35);	
	
	contexto.setTransform(1, 0, 0, 1, 0, 0);
	contexto.translate(0, 0);
	
	
}
function movimentoNave() {
    //MOVIMENTACAO
    velx = 0;
    vely = 0;
    if (teclaBaixoPressionada) {
        velx = (nave.x - nave.tri[2].x) / 4;
        vely = (nave.y - nave.tri[2].y) / 4;
    } else if (teclaCimaPressionada) {
        velx = -(nave.x - nave.tri[2].x) / 2;
        vely = -(nave.y - nave.tri[2].y) / 2;
    }

    //Transportando a nave para outro lado da cena
    if (nave.x > canvas.width) {
        nave.x = 0;
    } else if (nave.x < 0) {
        nave.x = canvas.width;
    } else {
        nave.x += velx;
    }
    if (nave.y > canvas.height) {
        nave.y = 0;
    } else if (nave.y < 0) {
        nave.y = canvas.height;
    } else {
        nave.y += vely;
    }


    if (teclaEsquerdaPressionada) {
        if (nave.rotacao > 0) {
            nave.rotacao -= 2;
        } else {
            nave.rotacao = 360;
        }
    }
    if (teclaDireitaPressionada) {
        if (nave.rotacao < 360) {
            nave.rotacao += 2;
        } else {
            nave.rotacao = 0;
        }
    }
}
function divideAsteroid(asteroide) {
    if (asteroide.radius == 15) {
        return null;
    }
    a = [];
    a[0] = new Object();
    a[0].centro = {x: asteroide.centro.x, y: asteroide.centro.y};
    a[0].radius = asteroide.radius - 10;
    a[0].frente = {x: a[0].centro.x, y: (a[0].centro.y - 2)};
    a[0].rotacao = Math.floor((Math.random() * 360));
	r = Math.floor(Math.random() * 255);
	g = Math.floor(Math.random() * 255);
	b = Math.floor(Math.random() * 255);
	a[0].cor = 'rgb('+r+','+g+','+b+')';
    a[0].canDivide = true;
	a[0].angular = Math.floor(Math.random() * 360);

    a[1] = new Object();
    a[1].centro = {x: asteroide.centro.x, y: asteroide.centro.y};
    a[1].radius = asteroide.radius - 10;
    a[1].frente = {x: a[1].centro.x, y: (a[1].centro.y - 2)};
    a[1].rotacao = a[0].rotacao + 90;
    if (a[1].rotacao > 360) {
        a[1].rotacao = a[1].rotacao - 360;
    }
	r = Math.floor(Math.random() * 255);
	g = Math.floor(Math.random() * 255);
	b = Math.floor(Math.random() * 255);
	a[1].cor = 'rgb('+r+','+g+','+b+')';
    a[1].canDivide = true;
	a[1].angular = Math.floor(Math.random() * 360);

    return a;
}
function detectaColisoes() {
    //COlisao tiros com asteroids
    posTiroFora = [];
    contTiros = 0;
    novosAsteroids = [];
    contNovosAster = 0;
    for (i = 0; i < ntiros; i++) {
        x1 = tiros[i].a.x;
        y1 = tiros[i].a.y;
        posAsterFora = [];
        cont = 0;
        for (j = 0; j < nasteroids; j++) {
            x2 = asteroids[j].centro.x;
            y2 = asteroids[j].centro.y;
            dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            if (dist < asteroids[j].radius) {
                if (asteroids[j].canDivide) {
                    a = divideAsteroid(asteroids[j]);
                    if (a != null) {
                        novosAsteroids[contNovosAster++] = a[0];
                        novosAsteroids[contNovosAster++] = a[1];
                    }
                }
                nave.pts+= Math.floor((60/(asteroids[j].radius-5))*5);
                posAsterFora[cont] = j;
                cont++;

                posTiroFora[contTiros] = i;
                contTiros++;
            }
        }
        for (j = 0; j < cont; j++) {
            removePos(asteroids, nasteroids, posAsterFora[j]);
            nasteroids--;
        }
        for (j = 0; j < contTiros; j++) {
            removePos(tiros, ntiros, posTiroFora[j]);
            ntiros--;
        }
        for (j = 0; j < contNovosAster; j++) {
            asteroids[nasteroids++] = novosAsteroids[j];
        }
    }
    //colisao nave com asteroids
    x1 = nave.x;
    y1 = nave.y;
    for (j = 0; j < nasteroids; j++) {
        x2 = asteroids[j].centro.x;
        y2 = asteroids[j].centro.y;
        dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (dist < asteroids[j].radius) {
            if (nave.vidas > 0) {
                nave.vidas--;
                nave.x = canvas.width / 2;
                nave.y = canvas.height / 2;
                nave.rotacao = 0;
                ntiros = 0;
                nasteroids = 0;
            } else {
                gameOver();
            }
        }
    }
}
function initialScreen() {
    contexto.beginPath();
    contexto.clearRect(0, 0, canvas.width, canvas.height);
	desenhaFundo();
    contexto.rect(0, 0, canvas.width, canvas.height);
    contexto.strokeStyle = 'gray';
    contexto.font = '42px serif';
    contexto.fillText("Para Jogar Aperte ENTER", 200, 300);
	contexto.fillText("[Setas]Movimento [Space]Tiros ", 150, 400);
    contexto.font = '15px serif';
    contexto.stroke();
    contexto.closePath();
}
function gameStart() {
    //Inicia a Nave
    nave = new Object();
    nave.x = canvas.width / 2;
    nave.y = canvas.height / 2;
    nave.vidas = 3;
    nave.pts = 0;
    nave.tri = [];
    for (i = 0; i < 3; i++) {
        nave.tri[i] = {x: 0, y: 0};
    }
    nave.rotacao = 0;

    tiros = [];
    ntiros = 0;
    asteroids = [];
    nasteroids = 0;
    jogo = setInterval(desenha, 10);
    atirar = setInterval(novoTiro, 200);
    criaAsteroids = setInterval(novoAsteroid, intervAster);
}
function gameOver() {
    gameIsRunning = false;
	clearInterval(jogo);
    clearInterval(atirar);
    clearInterval(criaAsteroids);
	
	
    contexto.beginPath();
    contexto.clearRect(0, 0, canvas.width, canvas.height);
	desenhaFundo();
    contexto.rect(0, 0, canvas.width, canvas.height);
    contexto.font = '42px serif';
    contexto.fillText("FIM DE JOGO \nPontos:", 200, 300);
	contexto.fillText(nave.pts, canvas.width/2, 360);
    contexto.font = '15px serif';
    
    contexto.stroke();
    contexto.closePath();
    setTimeout(initialScreen,3000);
}

/**
 *User Interface
 */
function desenhaUI() {
    //Desenhar borda
    contexto.beginPath();
    contexto.rect(0, 0, canvas.width, canvas.height);
    contexto.strokeStyle = 'red';
    contexto.stroke();
    contexto.closePath();
    //Vidas
    contexto.fillText("Vidas: " + nave.vidas, 10, 30);
    //Pontuacao
    contexto.fillText("Pontos: " + nave.pts /*+ "    " + nave.rotacao*/, 10, 15);
    //Tiros dados
    contexto.fillText("Tiros: " + ntiros, 10, 45);
    contexto.fillText("Asteroids: " + nasteroids, 10, 75);
}
/**
**Desenha Fundo
**/
function desenhaFundo(){
	img = new Image();
	img.src = "imagens/space.gif";
	contexto.drawImage(img, 0, 0, canvas.width, canvas.height);
}