const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const wrapper = document.querySelector(".wrapper")
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let podeClicar = true;

//array dos nomes e imagems das cartinhas
const items = [
  { name: "abelha", image: "./imgs/abelha.png" },
  { name: "anaconda", image: "./imgs/anaconda.png" },
  { name: "calopsita", image: "./imgs/calopsita.png" },
  { name: "camaleao", image: "./imgs/camaleao.png" },
  { name: "crocodilo", image: "./imgs/crocodilo.png" },
  { name: "gorila", image: "./imgs/gorila.png" },
  { name: "macaco", image: "./imgs/macaco.png" },
  { name: "passaro", image: "./imgs/passaro.png" },
  { name: "piranha", image: "./imgs/piranha.png" },
  { name: "preguica", image: "./imgs/preguica.png" },
  { name: "tigre", image: "./imgs/tigre.png" },
  { name: "tucano", image: "./imgs/tucano.png" },
  
];

//tempo inicial
let seconds = 0,
  minutes = 0;
//movimentos e contador de vitorias inicial
let movesCount = 0,
  winCount = 0;

//funcao geradora de tempo
const timeGenerator = () => {
  seconds += 1;
  //a cada 60 segundos se tem um minuto
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //formatacao da minutagem 
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Tempo:</span>${minutesValue}:${secondsValue}`;
};

//calcular movimentos
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Movimentos:</span>${movesCount}`;
};

//pegar objetos aleatorios da array
const generateRandom = (size = 4) => {
  //array temporaria copiando a array de items
  let tempArray = [...items];
  //inicializa a array do valor das cartas
  let cardValues = [];
  //todos os cartoes devem ser duplicados (4*4 matrix)/2 pq os pares dos objetos devem existir
  size = (size * size) / 2;
  //selecionar card aleatorio
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //se selecionado tira o objeto da array (para nao repetir o mesmo elemento)
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Criar os Cards
        before => frente (interrogacao)
        after => back side (imagem);
        data-card-values eh um atributo que guarda o nome das cartas para usar depois
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid (alinhamento das cartas)
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cartas
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //So roda se a carta nao tiver sido selecionado (se ela ja tiver sido clicada eh ignorado)
      if (!card.classList.contains("matched") && !card.classList.contains("flipped") && podeClicar) {
        //gira a carta
        card.classList.add("flipped");
        //se eh a primeira carta (!firstCard pq a firstCard comeca como falsa)
        if (!firstCard) {
          //entao a carta clicada se tornara a firstCard
          firstCard = card;
          //e o nome da carta se torna o firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //incrementa movimentos desde que o usuario selecionou a segunda carta
          movesCounter();
          //segunda carta selecionada e o nome dela
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //se ambas forem selecionadas (acerto), nao dara pra selecionar elas denovo
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //coloca a firstCard como false pq a proxima carta sera a primeira agora
            firstCard = false;
            //winCount incrementa se o usuario encontrar duas iguais
            winCount += 1;
            //se o winCount ter o mesmo valor de metade das cartas (ou seja, todas as cartas foram achadas), o jogo acaba
            if (winCount == Math.floor(cardValues.length / 2)) {
                setTimeout(() => {
                  result.innerHTML = `<h2>Você Venceu!</h2>
                  <h4>Movimentos: ${movesCount}</h4>
                  <h4>Tempo Total: ${minutes}:${seconds}</h4>`;
                  stopGame();
                }, 450)
            }
          } else {
            //se as cartas nao forem iguais, retornar elas pro normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            podeClicar = false
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
              podeClicar = true
            }, 450);
          }
        }
      }
    });
  });
};

//Comecar o jogo
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //visibilidade dos botoes
  wrapper.classList.remove("hide");
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //comecar o timer
  interval = setInterval(timeGenerator, 1000);
  //iniciar movimentos
  moves.innerHTML = `<span>Movimentos:</span> ${movesCount}`;
  initializer();
});

//Parar o jogo
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    wrapper.classList.add("hide");
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//inicializar valores e funcoes
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};