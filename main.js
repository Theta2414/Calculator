const numsPad = document.querySelectorAll(".num");
const display = document.querySelector(".display");
const show = document.querySelector(".show");
const input = document.querySelector(".input-field");
const ac = document.querySelector(".btn-ac");
const del = document.querySelector(".btn-del");
const operatorBtns = document.querySelectorAll(".oper");
const percent = document.querySelector(".btn-percent");
const equal = document.querySelector(".btn-equal");
const save = document.querySelector(".btn-save");
const board = document.querySelector(".save-list-container");
const innerBoard = document.querySelector(".save-list");
const close = document.querySelector(".close");
const saveBtns = document.querySelectorAll(".save");
const callBtns = document.querySelectorAll(".call"); 
const vals = document.querySelectorAll(".val");
const delCache = document.querySelector(".del-cache");

const operate = {
    " + ": (num1, num2) => num1 + num2,

    " – ": (num1, num2) => num1 - num2, //This is the subtract sign on the Calculator

    " × ": (num1, num2) => num1 * num2,
    
    " ÷ ": function (num1, num2) {
        if (num2 === 0) return "Error"; //This is the divide sign on the Calculator
        return num1 / num2;
    }
}

const digits = "0123456789.";

//Not allow to calculate
let forceStop = false;

let main = null;
let queue = null;

let operator = null;

let renew = true;
let newNum = null;

let focus = "main";

let clickedEqual = false;

function addCommas(number) {
    let arr;
    let after;
    let negative;
    number = number.toString();

    if (number.includes("-")) {
        negative = true;
        number = number.slice(1);
    };

    if (number === "Infinity" || number === "Error") return number;

    if (number.length <= 3) {
        if (negative) {
            return "-" + number;
        } else {
            return number;
        }
    };

    if (number.includes(".")) {
        arr = number.split(".")[0].split("");
        after = number.split(".")[1];
    } else {
        arr = number.split("");
    }

    i = arr.length % 3;
    if (i === 0) i = 3;

    for (i; i < arr.length; i += 4) {
        arr.splice(i, 0, ",");
    }

    if (number.includes(".")) {
        if (negative) {
            return "-" + arr.join("") + "." + after;
        } else {
            return arr.join("") + "." + after;
        }
    } else {
        if (negative) {
            return "-" + arr.join("");
        } else {
            return arr.join("");
        }
    }
}

function removeCommas(number) {
    number = number.toString();
    return number.split(",").join("");
}

function insertDigit(e) {
    if (input.value === "Error") AC();
    if (renew) input.value = "";
    let text = null;
    text = e.target.textContent || e.key;
    if (text === "." && !(input.value.includes("."))) {
        input.value += ".";
        renew = false;
        forceStop = false;
        focus = "input";
    } else if (text === "0" && (input.value[0] !== "0")) {
        input.value += "0";
        renew = false;
        forceStop = false;
        focus = "input";
        input.value = removeCommas(input.value);
        input.value = addCommas(input.value);
    } else if (text !== "." && text !== "0") {
        if (input.value[0] === "0" && input.value[1] !== ".") input.value = "";
        input.value += text;
        renew = false;
        forceStop = false;
        focus = "input";
        input.value = removeCommas(input.value);
        input.value = addCommas(input.value);
    }
}

function AC() {
    input.value = "0";
    main = null;
    queue = null;
    newNum = null;
    forceStop = false;
    operator = null;
    focus = "input";
    show.textContent = "";
}

function delF() {
    if (input.value.length === 1 || input.value === `Infinity` || input.value === `Error`) {
        input.value = "0";
        if (focus === "main") {
            main = null;
            queue = null;
            show.textContent = "";
            AC();
        };
    } else {
        input.value = addCommas(removeCommas(input.value.slice(0, -1)));
        if (focus === "main") main = main.slice(0, -1);
    }
    renew = false;
}

function calculate(num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        return "Error";
    }
    return operate[operator](num1, num2);
}

function addOperantsAndCalculate() {
    //Clicking equal button won't activate forceStop
    if (clickedEqual) forceStop = false;
    //Data in num1 must be empty, 0 is not considered empty
    if (!main) {
       main = removeCommas(input.value); 
    //Then check queue
    } else if (!queue) {
        queue = removeCommas(input.value);
    //All full, assign to newNum. Also used to handle multiple clicks on equal button
    } else {
        if (!clickedEqual || (clickedEqual && !renew)) { //Clicking equal many times => !renew = false, do not change the value in newNum
            newNum = removeCommas(input.value);
        }
    }
    if (queue !== newNum) {
        //newNum is presented as string, "0" returns true
        if (newNum) {
            queue = newNum;
            newNum = null;
        }
    }
    if (!forceStop) {
        //main and queue are presented as string, "0" returns true
        if (main && queue && operator) {
            input.value = addCommas(calculate(main, queue));
            main = removeCommas(input.value);
            if (show.textContent.includes("=")) {
                show.textContent = addCommas(main) + operator;
            }
            show.textContent += addCommas(queue) + " = ";
        }
    }
    //Change back to the initial state
    forceStop = true;
    clickedEqual = false;
    focus = "main";
}

numsPad.forEach(num => num.addEventListener("click", insertDigit));

ac.addEventListener("click", AC);
del.addEventListener("click", delF);

function click(e) {
    if (input.value === "Error") AC();
    addOperantsAndCalculate();
    operator = `${e.target.textContent}` || `${e.key}`;
    if (operator === "-") operator = "–"; //Change to the standard sign
    if (operator === "*") operator = "×";
    if (operator === "/") operator = "÷";
    operator = ` ${operator} `;
    renew = true;
    forceStop = true;
    show.textContent = addCommas(main) + `${operator}`;
    focus = "input";
}

operatorBtns.forEach(btn => btn.addEventListener("click", e => click(e)));

percent.addEventListener("click", () => {
    input.value = input.value/100;
    if (focus = "main") main = input.value;
});

equal.addEventListener("click", () => {
    clickedEqual = true;
    addOperantsAndCalculate();
    renew = true;
});

input.addEventListener("keydown", (e) => {
    e.preventDefault();
    
    switch (e.key) {
        case "Backspace":
            delF();
            break;

        case "Enter":
            clickedEqual = true;
            addOperantsAndCalculate();
            renew = true;
            break;

        case "+":
        case "-":
        case "*":
        case "/":
            click(e);
            break;

        case "%":
            input.value = input.value/100;
            if (focus = "main") main = input.value;
            break;
        
        case "Delete":
            AC();
            break;

        default:
            if (digits.includes(e.key)) insertDigit(e);
            break;
    }
});

save.addEventListener("click", () => {
    board.removeAttribute("hidden");
});

board.addEventListener("click", () => {
    board.setAttribute("hidden", "true");
});

innerBoard.addEventListener("click", (e) => {
    e.stopPropagation();
});

close.addEventListener("click", () => {
    board.setAttribute("hidden", "true");
});

saveBtns.forEach((btn, index) => btn.addEventListener("click", () => {
    vals[index].textContent = input.value;
}));

callBtns.forEach((btn, index) => btn.addEventListener("click", () => {
    if (focus !== "main") {
        input.value = vals[index].textContent;
        renew = false;
        board.setAttribute("hidden", "true");
    } else {
        AC();
        input.value = vals[index].textContent;
        renew = false;
        board.setAttribute("hidden", "true");
    }
}));

ac.dispatchEvent(new Event("click"));

delCache.addEventListener("click", () => vals.forEach(val => val.textContent = "0"));