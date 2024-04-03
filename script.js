const movimentos = document.getElementById('conta-movimentos')
const tempo = document.getElementById('tempo')
const botaoComecar = document.getElementById('comecar')
const botaoParar = document.getElementById('parar')
const containerJogo = document.querySelector('.container-jogo')
const resultado = document.getElementById('resultado')
const controle = document.querySelector('.container-controle')
let cartas;
let intervalo;
let primeiraCarta = false;
let segundaCarta = false;

// array dos items
const items = [
  {name: 'abelha', image:'./imgs/abelha.png'},
  {name: 'anaconda', image:'./imgs/anaconda.png'},
  {name: 'calopsita', image:'./imgs/calopsita.png'},
  {name: 'camaleao', image:'./imgs/camaleao.png'},
  {name: 'crocodilo', image:'./imgs/crocodilo.png'},
  {name: 'gorila', image:'./imgs/gorila.png'},
  {name: 'macaco', image:'./imgs/macaco.png'},
  {name: 'passaro', image:'./imgs/passaro.png'},
  {name: 'piranha', image:'./imgs/piranha.png'},
  {name: 'preguica', image:'./imgs/preguica.png'},
  {name: 'tigre', image:'./imgs/tigre.png'},
  {name: 'tucano', image:'./imgs/tucano.png'}
]

//tempo inicial

let segundos = 0, minutos = 0

//movimentos iniciais e vitorias

let contaMovimentos = 0, contaVitorias = 0

//timer

const geradorTempo = () => {
  segundos++
  if (segundos >= 60) {
    minutos++
    segundos = 0
  } 
  // formatar o tempo antes de mostrar
  
  let valorSegundos = segundos < 10 ? `0${segundos}` : segundos
  let valorMinutos = minutos < 10 ? `0${minutos}` : minutos
  tempo.innerHTML = `<span>Tempo:</span>${valorMinutos}:${valorMinutos}`
}

// calcular movimentos

const contadorMovimentos = () => {
  contaMovimentos++
  movimentos.innerHTML = `<span>Movimentos:</span>${contaMovimentos}`
}

// pega objeto aleatorio da array de animais

const gerarAleatorio = (size = 4) => {
  //array temporaria
  let tempArray = [...items]

  let valorCartas = []
  // tamanho deve ser dobrado (4*4 matrix)/2 ja que pares de objetos existiriam
  size = (size*size) / 2
  //selecionar aleatorio
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length)
    valorCartas.push(tempArray[randomIndex])
    // remove o objeto da lista temporaria
    tempArray.splice(randomIndex, 1)
  }
  return valorCartas;
}

const matrixGenerator = (valorCartas, size = 4) => {
  containerJogo.innerHTML = ''
  valorCartas = [...valorCartas, ...valorCartas];

  valorCartas.sort(() => Math.random() - 0.5)
  for (let i = 0; i < size*size; i++ ) {
    // criar cartas 
    // antes == frente (possuir interrogacao)
    // depois == atras (possuir a imagem da carta)
    containerJogo.innerHTML += 
    `<div class='card-container' 
    data-card-value='${valorCartas[i].name}'>
      <div class='card-before'>?</div>
      <div class='card-after'>
        <img src='${valorCartas[i].image}' class='image'>
      </div>
    </div>`
  }
  // grid
  containerJogo.style.gridTemplateColumns = `repeat(${size}, auto)`
}

const iniciar = () => {
  resultado.innerHTML = ''
  contaVitorias = 0
  let valorCartas = gerarAleatorio()
  console.log(valorCartas)
  matrixGenerator(valorCartas)
}

iniciar()
