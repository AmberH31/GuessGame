const vocabulary = [
  { word: "different", pic: "./assets/img/1.jpg", song: "", limit: 0 },
  { word: "accident", pic: "./assets/img/2.jpg", song: "", limit: 0 },
  { word: "occupant", pic: "./assets/img/3.jpg", song: "", limit: 0 },
  { word: "gorgeous", pic: "./assets/img/4.jpg", song: "", limit: 0 }
];
const winTimesElem = document.querySelector("#winTimes");
const remainingElem = document.querySelector("#remainingGuesses");
const guessElem = document.querySelector("#guess");
const guessedElem = document.querySelector("#alreadyGuessedLetters");
const picElem = document.querySelector("#pic");
const generateNewWord = () => {
  return vocabulary[Math.floor(vocabulary.length * Math.random())];
};
let winTimes = 0;
let wordToGuess = generateNewWord();
let remainingTimes = {
  times: 12,
  decrease: function() {
    this.times--;
    remainingElem.textContent = this.times;
  }
};
let guessInput = {
  currentState: wordToGuess.word,
  placeHolderArr: [],
  updateHolderArr: function(matchResult) {
    if (matchResult && matchResult.length > 0) {
      matchResult.forEach(entry => {
        this.placeHolderArr[entry.index] = entry.char;
      });
    } else {
      for (let i = 0; i < wordToGuess.word.length; i++) {
        guessInput.placeHolderArr.push("_");
      }
    }
    guessElem.textContent = this.placeHolderArr.join(" ");
  }
};
let guessedInput = {
  inputSet: new Set(),
  updateGuessed: function(char) {
    if (!this.inputSet.has(char)) {
      this.inputSet.add(char);
      guessedElem.textContent += " " + char;
    }
  }
};

const reset = () => {
  wordToGuess = generateNewWord();
  wordToGuess.limit = wordToGuess.word.length;
  remainingTimes.times = 12;
  remainingElem.textContent = remainingTimes.times;
  guessInput.currentState = Object.assign({}, wordToGuess).word;
  guessInput.placeHolderArr = [];
  guessInput.updateHolderArr();
  guessedInput.inputSet = new Set();
  guessedElem.textContent = "";
  winTimesElem.textContent = winTimes;
  picElem.setAttribute("src", wordToGuess.pic);
  console.log(wordToGuess);
};
const matchChar = inputChar => {
  let result = [];
  console.log(inputChar, guessInput.currentState);
  for (let i = 0; i < guessInput.currentState.length; i++) {
    if (guessInput.currentState[i] === inputChar) {
      result.push({ char: inputChar, index: i });
      guessInput.currentState =
        guessInput.currentState.substring(0, i) +
        guessInput.currentState.substring(i);
      console.log(guessInput.currentState);
    }
  }
  return result;
};
reset();
document.onkeyup = key => {
  const matchResult = matchChar(key.key);
  console.log(matchResult);
  if (matchResult.length > 0) {
    guessInput.updateHolderArr(matchResult);
    wordToGuess.limit -= matchResult.length;
    if (wordToGuess.limit === 0) {
      winTimes++;
      winTimesElem.textContent = winTimes;
      reset();
    }
  } else {
    guessedInput.updateGuessed(key.key);
  }
  remainingTimes.decrease();
  if (remainingTimes.times <= 0) {
    reset();
  }
};
