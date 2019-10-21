//Boa Sorte com o trabalho, deixei o maximo explicativo possivel. Mude o q for possível, tentem deixar bem diferente de todos
//Senão tudo será em vão. Tentem mudar nomes de variáveis, cores usadas, figuras, podem colocar imagens no lugar dos quadrados ou retangulos
//Usem o maximo da inteligencia para não deixar tudo igual. Muito desse codigo tambem achei na internet e modifiquei do meu jeito acrescentando coisas
// principalmente para usar a setinha pra cima para jogar.
// para jogar, só tem o comando usando a setinha para cima. Boa sorte, e até mais =D

let canvas, ctx, altura, largura, frames = 0, maxPulos = 2, velocidade = 6, estadoAtual

let estado = {  
  jogar: 0,
  jogando: 1,
  perdeu: 2
}

let chao = {  // ja sabe né :v
  y: 550,
  altura: 50,
  cor: "#ffdf70",
  desenha: function(){
    ctx.fillStyle = this.cor  //ctx é contexto da coisa, no caso, contexto da cor.
    ctx.fillRect(0, this.y, largura, this.altura) // contexto de dimensão
  }
}
let usuario = {  //personagem jogavel
  x: 50,
  y: 0,
  altura: 50,
  largura: 50,
  cor: "#ffa500",
  gravidade: 1.5,
  velocidade: 0,
  forcaDoPulo: 25,
  qntPulos: 0,

  atualiza: function(){  // atualizando a gravidade e a velocidade do usuario
    this.velocidade += this.gravidade
    this.y += this.velocidade

    if(this.y > chao.y - this.altura){  // fazendo com que o personagem não passe direto do solo.
      this.y = chao.y - this.altura
      this.qntPulos = 0  //trazendo de volta a 0 para poder pular novamente
    }
  },
  pular: function(){
    if(this.qntPulos<maxPulos){ // para pular no maximo a quantidade de maxpulos (tipo doble jump)
      this.velocidade = -this.forcaDoPulo
      this.qntPulos++
    }
  },
  desenha: function(){
    ctx.fillStyle = this.cor
    ctx.fillRect(this.x, this.y, this.largura, this.altura)
  }
}

let obstaculo = {  //nome auto explicativo
  _obs: [],
  cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"], // cores que serão utilizadas aleatoriamente
  tempoInsere: 0,

  inserir: function(){  //aparecer um obstaculo na tela, esse obstaculo começa a fazer parte de um vetor
    this._obs.push({   //desse vetor.
      x: largura,
      largura: 30+Math.floor(21*Math.random()), //largura aleatoria
      altura: 30+Math.floor(120*Math.random()), //altura aleatoria
      cor: this.cores[Math.floor(5 * Math.random())]
    })
  
    this.tempoInsere = 30 + Math.floor(20*Math.random()) //tempo para inserir os obstaculos na tela, para ter espaçamento diferente

  },
  atualiza: function(){   //faz o obstaculo percorrer a tela da direita para esquerda
    if(this.tempoInsere == 0){ 
      this.inserir()
    }
    else{
      this.tempoInsere--
    }

    for(let i = 0, tam = this._obs.length; i<tam; i++){
      let obs = this._obs[i]

      obs.x -= velocidade

      if(usuario.x < obs.x+obs.largura && usuario.x + usuario.largura >= obs.x && usuario.y+usuario.altura >= chao.y-obs.altura){
        estadoAtual = estado.perdeu  // condições para perder.
      }

      else if(obs.x <= -obs.largura){  //retira o obstaculo para nao ocupar infinitamente o array.
        this._obs.splice(i, 1)
        tam --  //para que consiga continuar rodando o vetor mesmo com os indices sumindo
        i--
      }
    }
  },

  limpa: function(){ // limpar o array
    this._obs = []
  },

  desenha: function(){  //visual
    for(let i = 0, tam = this._obs.length; i<tam; i++){
      let obs = this._obs[i]
      ctx.fillStyle = obs.cor
      ctx.fillRect(obs.x, chao.y-obs.altura, obs.largura, obs.altura)
    }
  }
}

function up(event){
  if(event.keyCode == "38"){ // 38 é o keycode para setinha pra cima
    if(estadoAtual == estado.jogando){  //menuzinho
      usuario.pular()
    }
    else if(estadoAtual == estado.jogar){
      estadoAtual = estado.jogando
    }
    else if(estadoAtual == estado.perdeu){
      estadoAtual = estado.jogar
    }
  }
}

function main(){  // principal, onde tem tudo pra rodar
  altura = window.innerHeight //tamanho da tela
  largura = window.innerWidth  // largura
  if(largura >= 500){  
    largura = 600
    altura = 600
  }

  canvas = document.createElement("canvas")  // tela de fundo
  canvas.width = largura
  canvas.height = altura
  canvas.style.border = "1px solid #000"

  ctx = canvas.getContext("2d")  // todos desenhos serão 2d
  document.body.appendChild(canvas)  
  document.addEventListener("keydown", up)  //quando uma tecla for apertada, chama a função up

  estadoAtual = estado.jogar
  roda()
}

function roda(){  //para atualizar os frames e chamar os desenhos
  atualiza()
  desenha()

  window.requestAnimationFrame(roda)
}

function atualiza(){ //atualizar os frames
  frames++
  usuario.atualiza()
  if(estadoAtual == estado.jogando){
    obstaculo.atualiza()
  }
  else if(estadoAtual == estado.perdeu){
    obstaculo.limpa()
  }
}

function desenha(){  // desenha os objetos anteriores
  ctx.fillStyle = "#50beff"
  ctx.fillRect(0, 0, largura, altura)

  if(estadoAtual == estado.jogar){
    ctx.fillStyle = "green"
    ctx.fillRect(largura/2 - 50, altura/2 - 50, 100, 100)
  }
  else if(estadoAtual == estado.perdeu){
    ctx.fillStyle = "red"
    ctx.fillRect(largura/2 - 50, altura/2 - 50, 100, 100)
  }
  else if(estadoAtual == estado.jogando){
    obstaculo.desenha()
  }
  chao.desenha()
  usuario.desenha()
}

main() // chamado da função principal