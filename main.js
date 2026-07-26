const word = ['A','R','B','O','L'];

let guess = ['','','','',''];
let xx = []; //0 -> correct, 1 -> bad position, 2 -> it's not a letter of the word
let currentTry = 0;
let totalTries = 4;

let $divTries = null;
const $blackbg = document.querySelector(".black-background");
const $winModal = document.querySelector(".modal-win");
const $loseModal = document.querySelector(".modal-lose");

window.addEventListener("DOMContentLoaded", ()=>{
    createBoard("NORMAL");
});


function createBoard(difficulty){    
    const board = document.querySelector('.board');
    board.innerHTML = "";
    currentTry = 0;
    setDifficulty(difficulty);

    for(let i = 0; i < totalTries; i++){
        const div = document.createElement("div");
        div.classList.add("try");

        word.forEach((el, index) => {
            const input = document.createElement("input");
            input.type = "text";
            input.setAttribute("guess-position", index);
            div.appendChild(input);
            input.addEventListener("input", (evt)=>typeGuess(evt));
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

function checkGuess(){
    if(!isGuessWordEmpty()){
        for(let i = 0; i < guess.length; i++){
            let found = false;

            for(let x = 0; x < word.length; x++){
                if(guess[i] == word[x] && i == x){
                    found = true;
                    xx.push(0);
                    break;
                }else if(guess[i] == word[x]){
                    found = true;
                    xx.push(1);
                    break;
                }
            }

            if(!found) xx.push(2);
        }

        let isCorrect = true;
        
        xx.forEach(el => {
            if(el == 1 || el == 2) {
                isCorrect = false;
            }
        });

        guessAnimation();

        if(isCorrect) {
            $blackbg.style.display = "flex";
            $winModal.style.display = "flex";
            setTimeout(()=>{
                confetti({
                    count: 250,
                    size: 1,
                    velocity: 200,
                    fade: false
                });
            }, 300);
        }
        guess = ['','','','',''];
        xx = [];
    }
}

function guessAnimation(){
    const $inputs = $divTries[currentTry].querySelectorAll("input");
    const animDuration = 400;
    const ii = xx;

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
            switch(ii[index]){
                case 0: 
                    $inp.classList.add("correct")
                    break;
                case 1: 
                    $inp.classList.add("missplaced") 
                    break;
                case 2: 
                    $inp.classList.add("incorrect")
                    break;
            }
        }, (animDuration - 100) + (index * 250));
        
    });

    $divTries[currentTry].classList.remove("currentTry");
    
    if(currentTry + 1 < totalTries){
        currentTry++;
        $divTries[currentTry].classList.add("currentTry");
    }else{
        $blackbg.style.display = "flex";
        $loseModal.style.display = "flex";
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
    $blackbg.style.display = "none";
    createBoard();
}