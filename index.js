import { words } from "./words.js";

const guessNumber = 6;
let guessesRemaining = guessNumber;
let currentGuess = [];
let nextLetter = 0;
let foobar = Array.from(words[Math.floor(Math.random() * words.length)])
console.log(foobar.join(''))
generateBoard();
generateKeys();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
document.addEventListener("keyup",(e) =>{
    if(guessesRemaining === 0) return
    let keyPress = String(e.key)
    if(keyPress === "Backspace" && nextLetter !== 0) {delLetter(); return}
    if(keyPress==="Enter") {guess(); return}
    let keyFound = keyPress.match(/[a-z]/i)
    if(!keyFound || keyPress.length > 1) return
    else insert(keyPress)
})

document.getElementById("keys").addEventListener("click",(e)=> {
    if(!e.target.classList.contains("button")) return
    if(e.target.textContent === "backspace") e.target.textContent = "Backspace"
    if(e.target.textContent === "enter") e.target.textContent = "Enter"
    document.dispatchEvent(new KeyboardEvent("keyup", {'key':e.target.textContent}))
})

function insert(x){
    if (currentGuess.length === 5) return
    x = x.toLowerCase()
    let row = document.getElementsByClassName("row")[6-guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = x
    box.classList.add("usedBox")
    currentGuess.push(x)
    nextLetter++
}

function delLetter(){
    let row = document.getElementsByClassName("row")[6-guessesRemaining]
    let box = row.children[nextLetter -1]
    box.textContent = ""
    box.classList.remove("usedBox")
    currentGuess.pop()
    nextLetter--
}

function generateBoard(){
    let board = document.getElementById("board");
    for (let i = 0; i < guessNumber; i++){
        let row = document.createElement("div")
        row.className = "row"
        for (let j = 0; j < 5; j++){
            let box = document.createElement("div")
            box.className = "letter"
            row.appendChild(box)
        }
        board.appendChild(row)
    }
}
function generateKeys(){
    let panel = document.getElementById("keys")
    let rows  = [ Array.from("qwertyuiop"), Array.from("asdfghjkl"), Array.prototype.concat("enter",Array.from("zxcvbnm"),"backspace") ]
    rows.forEach(x => {
        let row = document.createElement("div")
        row.className="keyrow"
        x.forEach(y => {
            let box = document.createElement("div")
            box.className = "button"
            box.textContent = y
            box.id = y
            row.appendChild(box)
        })
        panel.appendChild(row)
    });
}

function guess(){
    let row = document.getElementsByClassName("row")[6 - guessesRemaining]
    let guess = currentGuess.join('')
    if (row.classList.contains("shake")) row.classList.remove("shake")
    if (guess.length != 5 || !words.includes(guess)) { setTimeout(() => {
        row.classList.add("shake");
    }, 1);  return}
    for(let i = 0; i < 5; i++){
        let color = "class"
        if(currentGuess[i] === foobar[i]) color = "animateGreen"
        else if (foobar.includes(currentGuess[i])) color = "animateYellow"
        else color = "animateGrey"
        setTimeout(() => {
            row.children[i].classList.add(color)
        }, 300*i);
    }
    if(guess === foobar.join("")) {
        win(row)
        return
    }
    else{
        guessesRemaining--
        currentGuess = []
        nextLetter = 0
    }
    if(guessesRemaining === 0){
        document.getElementById("h1").textContent=currentGuess.join('')
    }
}
