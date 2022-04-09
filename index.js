import { words } from "./words.js";

let guessNumber = 6;
let guessesRemaining = guessNumber;
let currentGuess = [];
let nextLetter = 0;
let foobar = Array.from("     ")
menu()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function menu(){
    let board = document.getElementById("menu");
    for (let i = 4; i < 9; i++){
        let box = document.createElement("div")
        box.textContent = i
        box.className = "menuButton"
        board.appendChild(box)
        box.id = i
    }
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

document.getElementById("menu").addEventListener("click",(e)=> {
    if(!e.target.classList.contains("menuButton")) return
    guessNumber = parseInt(e.target.textContent)
    foobar = Array.from(words.filter(x => x.length === guessNumber)[Math.floor(Math.random() * words.filter(x => x.length === guessNumber).length)])
    generateBoard()
    generateKeys()
    document.getElementById("menu").remove()
})

document.getElementById("keys").addEventListener("click",(e)=> {
    if(!e.target.classList.contains("button")) return
    if(e.target.textContent === "backspace") e.target.textContent = "Backspace"
    if(e.target.textContent === "enter") e.target.textContent = "Enter"
    document.dispatchEvent(new KeyboardEvent("keyup", {'key':e.target.textContent}))
})

function insert(x){
    if (currentGuess.length === guessNumber) return
    x = x.toLowerCase()
    let row = document.getElementsByClassName("row")[guessNumber-guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = x
    box.classList.add("usedBox")
    currentGuess.push(x)
    nextLetter++
}

function delLetter(){
    let row = document.getElementsByClassName("row")[guessNumber-guessesRemaining]
    let box = row.children[nextLetter -1]
    box.textContent = ""
    box.classList.remove("usedBox")
    currentGuess.pop()
    nextLetter--
}

function generateBoard(){
    guessesRemaining = guessNumber;
    console.log(foobar)
    let board = document.getElementById("board");
    for (let i = 0; i < 6; i++){
        let row = document.createElement("div")
        row.className = "row"
        for (let j = 0; j < guessNumber; j++){
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
    let row = document.getElementsByClassName("row")[guessNumber - guessesRemaining]
    let guess = currentGuess.join('')
    if (row.classList.contains("shake")) row.classList.remove("shake")
    if (guess.length != guessNumber || !words.includes(guess)) { setTimeout(() => {
        row.classList.add("shake");
    }, 1);  return}
    for(let i = 0; i < guessNumber; i++){
        let color = "class"
        if(currentGuess[i] === foobar[i]) color = "animateGreen"
        else if (foobar.includes(currentGuess[i])) color = "animateYellow"
        else color = "animateGrey"
        setTimeout(() => {
            if(document.getElementById(row.children[i].textContent).classList.contains("animateYellow"))             document.getElementById(row.children[i].textContent).classList.remove("animateYellow")
        }, 300*i);
        setTimeout(() => {
            document.getElementById(row.children[i].textContent).classList.add(color)
            row.children[i].classList.add(color)
        }, 300*i);

        

    }
    if(guess === foobar.join("")) {
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
    removeAllClasses();
}

function removeAllClasses(){
    sleep(500)
    let elems = document.getElementById("keys").children
    for(let j = 0; j < elems.length; j++){
        let row = elems[j].children
        for(let i = 0; i < row.length; i++){
            setTimeout(() => {
                row[i].classList.remove("animateYellow")
            }, 1);

        }
    }

}
