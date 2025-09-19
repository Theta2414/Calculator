const numsPad = document.querySelectorAll(".num");
const display = document.querySelector(".display");
const show = document.querySelector(".show");
const input = document.querySelector(".input-field");
const ac = document.querySelector(".btn-ac");
const del = document.querySelector(".btn-del");
const add = document.querySelector(".btn-add");
const subtract = document.querySelector(".btn-sub");
const multiply = document.querySelector(".btn-multi");
const divide = document.querySelector(".btn-divide");
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
    "add": (num1, num2) => num1 + num2,

    "subtract": (num1, num2) => num1 - num2,

    "multiply": (num1, num2) => num1 * num2,
    
    "divide": function (num1, num2) {
        if (num2 === 0) return "Error";
        return num1 / num2;
    }
}

const digit = "0123456789.";

//Not allow to calculate
let forceStop = false;

let main = null;
let queue = null;

let operator = {
    key: null,
    action: null
};

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

    if (arr.length % 3 === 1) {
        i = 1;
    } else if (arr.length % 3 === 2) {
        i = 2;
    } else if (arr.length % 3 === 0) {
        i = 3;
    }

    for (i; i < arr.length; i += 3) {
        arr.splice(i, 0, ",");
        i++;
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
    return number.split(",").join("");
}

function insertDigit(e) {
    if (input.value === "Error") AC();
    if (renew) input.value = "";
    let text = null;
    if (e.target.textContent) {
        text = e.target.textContent;
    } else {
        text = e.key;
    }
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
    operator.key = null;
    operator.action = null;
    focus = "input";
    show.textContent = "";
}

function delF() {
    if (input.value.length === 1 || input.value === `Infinity`) {
        input.value = "0";
        if (focus === "main") {
            main = null;
            queue = null;
            show.textContent = "";
            AC();
        };
    } else {
        input.value = addCommas(removeCommas(input.value.slice(0, -1)));
        if (focus === "main") main = main.toString().slice(0, -1);
    }
    renew = false;
}

function calculate(num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        return "Error";
    }
    return operate[operator.action](num1, num2);
}

function addOperantsAndCalculate() {
    //Clicking equal button won't activate forceStop
    if (clickedEqual) forceStop = false;
    //Data in num1 must be empty, 0 is not considered empty
    if (!main && main !== 0) {
       main = removeCommas(input.value).toString(); 
    //Then check queue
    } else if (!queue && queue !== 0) {
        queue = removeCommas(input.value).toString();
    //All full, asign to newNum
    } else {
        if (!clickedEqual || (clickedEqual && !renew)) {
            newNum = removeCommas(input.value).toString();
        }
    }
    if ((Number(queue) !== Number(newNum))) {
        //newNum is presented as string, "0" returns true
        if (newNum) {
            queue = newNum;
            newNum = null;
        }
    }
    if (!forceStop) {
        //main and queue are presented as string, "0" returns true
        if (main && queue && operator.action) {
            if (calculate(main, queue) !== Infinity)
                input.value = addCommas(calculate(main, queue));
            else {
                input.value = Infinity
            }
            main = removeCommas(input.value);
            if (show.textContent.includes("=")) {
                show.textContent = addCommas(main) + operator.key;
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

add.addEventListener("click", (e) => {
    if (input.value === "Error") AC();
    addOperantsAndCalculate();
    operator.key = " + ";
    operator.action = "add";
    renew = true;
    forceStop = true;
    show.textContent = addCommas(main) + " + ";
    focus = "input";
});

subtract.addEventListener("click", (e) => {
    if (input.value === "Error") AC();
    addOperantsAndCalculate();
    operator.key = " – ";
    operator.action = "subtract";
    renew = true;
    forceStop = true;
    show.textContent = addCommas(main) + " – ";
    focus = "input";
});

multiply.addEventListener("click", (e) => {
    if (input.value === "Error") AC();
    addOperantsAndCalculate();
    operator.key = " × ";
    operator.action = "multiply";
    renew = true;
    forceStop = true;
    show.textContent = addCommas(main) + " × ";
    focus = "input";
});

divide.addEventListener("click", (e) => {
    if (input.value === "Error") AC();
    addOperantsAndCalculate();
    operator.key = " ÷ ";
    operator.action = "divide";
    renew = true;
    forceStop = true;
    show.textContent = addCommas(main) + " ÷ ";
    focus = "input";
});

percent.addEventListener("click", (e) => {
    input.value = input.value/100;
});

equal.addEventListener("click", (e) => {
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
            if (input.value === "Error") AC();
            addOperantsAndCalculate();
            operator.key = " + ";
            operator.action = "add";
            renew = true;
            forceStop = true;
            show.textContent = addCommas(main) + " + ";
            focus = "input";
            break;

        case "-":
            if (input.value === "Error") AC();
            addOperantsAndCalculate();
            operator.key = " – ";
            operator.action = "subtract";
            renew = true;
            forceStop = true;
            show.textContent = addCommas(main) + " – ";
            focus = "input";
            break;

        case "*":
            if (input.value === "Error") AC();
            addOperantsAndCalculate();
            operator.key = " × ";
            operator.action = "multiply";
            renew = true;
            forceStop = true;
            show.textContent = addCommas(main) + " × ";
            focus = "input";
            break;

        case "/":
            if (input.value === "Error") AC();
            addOperantsAndCalculate();
            operator.key = " ÷ ";
            operator.action = "divide";
            renew = true;
            forceStop = true;
            show.textContent = addCommas(main) + " ÷ ";
            focus = "input";
            break;

        case "%":
            input.value = input.value/100;
            break;
        
        case "Delete":
            AC();
            break;

        default:
            if (digit.includes(e.key)) insertDigit(e);
            break;
    }
});

save.addEventListener("click", (e) => {
    board.removeAttribute("hidden");
});

board.addEventListener("click", (e) => {
    board.setAttribute("hidden", "true");
});

innerBoard.addEventListener("click", (e) => {
    e.stopPropagation();
});

close.addEventListener("click", (e) => {
    board.setAttribute("hidden", "true");
});

saveBtns.forEach((btn, index) => btn.addEventListener("click", (e) => {
    vals[index].textContent = input.value;
}));

callBtns.forEach((btn, index) => btn.addEventListener("click", (e) => {
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

delCache.addEventListener("click", (e) => vals.forEach(val => val.textContent = "0"));