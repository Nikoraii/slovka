import { WORDS_5 } from "./words/words_5_letters.js";
import { WORDS_6 } from "./words/words_6_letters.js";
import { WORDS_7 } from "./words/words_7_letters.js";
import { WORDS_8 } from "./words/words_8_letters.js";

console.log("5: " + WORDS_5.length);
console.log("6: " + WORDS_6.length);
console.log("7: " + WORDS_7.length);
console.log("8: " + WORDS_8.length);

let WORD_LENGTH = Number(localStorage.getItem("length"));
let wins = 0;
let NUMBER_OF_GUESSES = WORD_LENGTH;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let WORDS;
let rightGuessString;

if (WORD_LENGTH) {
    start();
}

function start() {
    if (!WORD_LENGTH) {
        return;
    }
    document.getElementById("wins-text").innerHTML = 'Укупан број погодака заредом:';
    document.getElementById("wins").innerHTML = wins;
    resetContinueButtons();
    NUMBER_OF_GUESSES = WORD_LENGTH;
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextLetter = 0;

    if (NUMBER_OF_GUESSES === 5) {
        WORDS = WORDS_5;
    } else if(NUMBER_OF_GUESSES === 6) {
        WORDS = WORDS_6;
    } else if(NUMBER_OF_GUESSES === 7) {
        WORDS = WORDS_7;
    } else {
        WORDS = WORDS_8;
    }

    rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
    rightGuessString = rightGuessString.toLowerCase();
    console.log(rightGuessString);
    resetShadeKeyboard();
    initBoard();
}

function initBoard() {
    let board = document.getElementById("game-board");
    board.innerHTML = "";

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let engFound = pressedKey.match(/./g);
    if (engFound) {
        pressedKey = convertToCyrillic(pressedKey);
    }

    function convertToCyrillic(letter) {
        const mapping = {
          'a': 'а', 'b': 'б', 'c': 'ц', 'd': 'д', 'e': 'е', 'f': 'ф', 'g': 'г',
          'h': 'х', 'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н',
          'o': 'о', 'p': 'п', 'q': 'љ', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
          'v': 'в', 'w': 'њ', 'x': 'џ', 'y': 'з', 'z': 'ѕ', '[': 'ш', ']': 'ђ',
          "\\": 'ж', ';': 'ч', "'": 'ћ', 'š': 'ш', 'đ': 'ђ', 'ž': 'ж', 'č': 'ч',
          'ć': 'ћ'
        };
      
        const lowerCaseLetter = letter.toLowerCase();
        if (mapping.hasOwnProperty(lowerCaseLetter)) {
          return mapping[lowerCaseLetter];
        } else {
          return letter;
        }
      }
      
    let found = pressedKey.match(/[а-яђћџњљј]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

function insertLetter (pressedKey) {
    if (nextLetter === WORD_LENGTH) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[NUMBER_OF_GUESSES - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != WORD_LENGTH) {
        toastr.error("Нисте унели довољно слова!")
        return
    }

    if (!WORDS.filter((str) => str.toLowerCase().includes(guessString.toLowerCase()))) {
        toastr.error("Реч није у листи!")
        return
    }

    
    for (let i = 0; i < WORD_LENGTH; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = '#27272a'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                // green 
                letterColor = '#16a34a'
            } else {
                // yellow
                letterColor = '#fde047'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 350 * i
        setTimeout(()=> {
            animateCSS(box, 'flipInX')
            //shade
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        wins++;
        document.getElementById("wins").innerHTML = wins;
        toastr.success("Тачан погодак! Крај игре!")
        guessesRemaining = 0
        document.getElementById("next").removeAttribute("hidden");
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("Остали сте без покушаја! Крај игре!")
            // toastr.info(`Тачна реч је била: ${rightGuessString.toUpperCase()}`)
            wins = 0;
            document.getElementById("wins").innerHTML = `${rightGuessString.toUpperCase()}`;
            document.getElementById("wins-text").innerHTML = 'Тачна реч је:';
            document.getElementById("next").removeAttribute("hidden");
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === '#16a34a') {
                return
            } 

            if (oldColor === '#fde047' && color !== '#16a34a') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function resetShadeKeyboard() {
    let keys = document.getElementsByClassName("keyboard-button");
    for(let i = 0; i < keys.length; i++) {
        keys[i].style.backgroundColor = null;
    }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Back") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

const animateCSS = (element, animation, prefix = 'animate__') =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});


function resetContinueButtons() {
    let continueButtons = document.getElementsByClassName("continue");
    for (let i = 0; i < continueButtons.length; i++) {
        let continueButtonId = continueButtons[i].id;
        continueButtonId = continueButtonId.slice(-1);
        continueButtonId = Number(continueButtonId);
        if (continueButtonId === WORD_LENGTH) {
            continueButtons[i].setAttribute("hidden", "");
        } else {
            continueButtons[i].removeAttribute("hidden");
        }
    }
}

let next = document.getElementById("next");
next.addEventListener("click", function() {
    this.setAttribute("hidden", "");
    continueGame(WORD_LENGTH);
})


let continueButtons = document.getElementsByClassName("continue");
for (let i = 0; i < continueButtons.length; i++) {
    continueButtons[i].addEventListener("click", function() {
        let continueButtonId = this.id;
        continueButtonId = continueButtonId.slice(-1);
        next.setAttribute("hidden", "");
        continueGame(Number(continueButtonId));
    })
}

function continueGame(word_length) {
    WORD_LENGTH = Number(word_length);
    start();
}