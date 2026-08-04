let word = ['', '', '', '', ''];

let guess = ['','','','',''];
let statusHistory = [];
let guessStatus = []; //0 -> correct, 1 -> bad position, 2 -> it's not a letter of the word
let currentTry = 0;
let totalTries = 4;
let $divTries = null;
let wordList = [];

const $blackbg = document.querySelector(".black-background");
const $winModal = document.querySelector(".modal-win");
const $loseModal = document.querySelector(".modal-lose");
const $winMsg = document.getElementById("win-msg");
const $loseMsg = document.getElementById("lose-msg");
const $themeIcon = document.getElementById("theme-icon");


window.addEventListener("DOMContentLoaded", ()=>{
    fetch("word_list.json")
    .then(res => res.json())
    .then(data => {
        wordList = data
        .map(p => p.toUpperCase())
        .filter(p => p.length === 5);

        createBoard("NORMAL");
    });

});


function createBoard(difficulty){    
    const board = document.querySelector('.board');
    board.innerHTML = "";
    currentTry = 0;
    setDifficulty(difficulty);
    word = wordList[Math.floor(Math.random() * wordList.length)].split("");    

    for(let i = 0; i < totalTries; i++){
        const div = document.createElement("div");
        div.classList.add("try");

        word.forEach((el, index) => {
            const input = document.createElement("input");
            input.type = "text";
            input.setAttribute("guess-position", index);
            div.appendChild(input);
            input.addEventListener("input", (evt)=>typeGuess(evt));
            input.addEventListener("keydown", (evt)=>{                
                if(evt.key == "Enter"){
                    checkGuess();
                }      
                
                if(evt.key == "Backspace"){
                    deleteLetter(evt);
                }
            });
        });

        board.appendChild(div);
    }

    $divTries = document.querySelectorAll(".try");
    $divTries[currentTry].classList.add("currentTry");
}

function setDifficulty(dif){
    switch(dif){
        case "EASY": 
            totalTries = 6
            break;
        case "NORMAL": 
            totalTries = 4
            break;
        case "IMPOSSIBLE": 
            totalTries = 2
            break;
    }
}

function typeGuess(event){
    
    const input = event.target;
    const position = input.getAttribute("guess-position");
    let letter = event.data ? event.data.toUpperCase() : "";    
    
    if(letter.match(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/)){
        input.value = letter;
        guess[position] = letter; 
        if(position < word.length-1) $divTries[currentTry].querySelectorAll("input")[Number(position)+1].focus();
  
    }else{
        input.value = "";
        guess[position] = letter;                
        return;
    }
    
}

function deleteLetter(event){
    const input = event.target;
    const position = input.getAttribute("guess-position");      
    
    input.value = "";
    guess[position] = "";
    
    setTimeout(()=>{
        if(position > 0) $divTries[currentTry].querySelectorAll("input")[Number(position)-1].focus();
    });       
}

function checkGuess(){
    if(!isGuessWordEmpty()){
        
        for(let i = 0; i < guess.length; i++){
            let found = false;

            for(let x = 0; x < word.length; x++){
                if(guess[i] == word[x] && i == x){
                    found = true;
                    guessStatus[i] = 0;
                    break;
                }else if(guess[i] == word[x]){
                    found = true;
                    guessStatus[i] = 1;
                }
            }

            if(!found) guessStatus[i] = 2;
        }
        
        let isCorrect = true;
        
        guessStatus.forEach(el => {
            if(el == 1 || el == 2) {
                isCorrect = false;
            }
        });        

        guessAnimation();

        $divTries[currentTry].classList.remove("currentTry");
        currentTry++;

        guess = ['','','','',''];
        statusHistory.push(guessStatus);
        guessStatus = [];

        if(isCorrect) {
            $blackbg.style.display = "flex";
            $winModal.style.display = "flex";
            $winMsg.innerHTML = `Enhorabuena! Has adivinado la palabra "${word.join("").toLowerCase()}" en ${currentTry} intento/s`;
            paintStatusHistory($winModal.querySelector(".statusHistory"));
            setTimeout(()=>{
                confetti({
                    count: 250,
                    size: 1,
                    velocity: 200,
                    fade: false
                });
            }, 300);
            return;
        }
        
        if(currentTry < totalTries){
            $divTries[currentTry].classList.add("currentTry");
            $divTries[currentTry].querySelectorAll("input")[0].focus();
        }else{
            $blackbg.style.display = "flex";
            $loseModal.style.display = "flex";
            $loseMsg.innerHTML = `Vaya... la palabra era "${word.join("").toLowerCase()}", inténtalo otra vez. Al reiniciar se cambia la palabra.`;
            paintStatusHistory($loseModal.querySelector(".statusHistory"));
        }
    }
}

function paintStatusHistory(div){
    div.innerHTML = "";
    statusHistory.forEach(g => {
        g.forEach(s =>{
            const span = document.createElement("span");
            setStatusToGuess(s, span);
            div.appendChild(span);
        })
    });
}

function guessAnimation(){
    const $inputs = $divTries[currentTry].querySelectorAll("input");
    const animDuration = 400;
    const guessStatusCopy = guessStatus;

    $inputs.forEach(($inp, index) => {
        $inp.animate(
            [
                { transform: "translateY(0)" },
                { transform: "translateY(-20px)" },
                { transform: "translateY(0)" }
            ],
            {
                ease: "ease-out",
                duration: 400,
                fill: "forwards",
                delay: (index * 250)
            }
        );

        setTimeout(()=>{
            setStatusToGuess(guessStatusCopy[index], $inp);
        }, (animDuration - 100) + (index * 250));
        
    });
}

function setStatusToGuess(param, element){
    switch(param){
        case 0: 
            element.classList.add("correct")
            break;
        case 1: 
            element.classList.add("missplaced") 
            break;
        case 2: 
            element.classList.add("incorrect")
            break;
    }
}

function isGuessWordEmpty(){
    let empty = false;

    guess.forEach(letter => {
        if(letter == ""){
            empty = true;
        }
    });

    return empty;
}

function resetGame(){
    $blackbg.style.display = "none";
    $winModal.style.display = "none";
    $loseModal.style.display = "none";
    statusHistory = [];
    createBoard();    
}

function changeTheme(){
    if(document.documentElement.hasAttribute("data-theme")){
        document.documentElement.removeAttribute("data-theme");
        $themeIcon.classList.remove("ri-sun-line");
        $themeIcon.classList.add("ri-moon-line");
    }else{
        document.documentElement.setAttribute("data-theme", "dark");
        $themeIcon.classList.remove("ri-moon-line");
        $themeIcon.classList.add("ri-sun-line");
    }
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}