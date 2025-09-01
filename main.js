const numsPad = document.querySelectorAll(".num");
const display = document.querySelector(".display");
const ac = document.querySelector(".btn-ac");
const del = document.querySelector(".btn-del");
const add = document.querySelector(".btn-add");
const subtract = document.querySelector(".btn-sub");
const multiply = document.querySelector(".btn-multi");
const divide = document.querySelector(".btn-divide");
const percent = document.querySelector(".btn-percent");
const equal = document.querySelector(".btn-equal");

const operate = {
    "add": function(num1, num2) {
        return num1 + num2;
    },
    "subtract": function(num1, num2) {
        return num1 - num2;
    },
    "multiply": function(num1, num2) {
        return num1 * num2;
    },
    "divide": function (num1, num2) {
        if (num2 === 0) return "Error";
        return num1 / num2;
    }
}

//Not allow to calculate
let forceStop = false;

let main = null;
let queue = null;
let operator = null;
//Turn the display to show "0"
let renew = true;
let newNum = null;

let focus = "main";

let clickedEqual = false;

function AC() {
    display.textContent = "0";
    main = null;
    queue = null;
    newNum = null;
    forceStop = false;
}

function delF() {
    if (display.textContent.length === 1) {
        display.textContent = "0";
        if (focus === "main") main = 0;
    } else {
        display.textContent = display.textContent.slice(0, -1);
        if (focus === "main") main = Number(main.toString().slice(0, -1));
    }
}

function calculate(num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    if (operator && num1 || num1 === 0 && num2 || num2 === 0) {
        return operate[operator](num1, num2);
    }
}

function addOperantsAndCalculate() {
    //Clicking equal button won't activate forceStop
    if (clickedEqual) forceStop = false;
    //Data in num1 must be empty, 0 is not considered empty
    if (!main && main !== 0) {
        main = display.textContent;
    //Then check queue
    } else if (!queue && queue !== 0) {
        queue = display.textContent;
    //All full, asign to newNum
    } else {
        if (!clickedEqual || (clickedEqual && !renew)) {
            newNum = display.textContent;
        }
    }
    if ((Number(queue) !== Number(newNum))) {
        if (newNum) {
            queue = newNum;
            newNum = null;
        }
    }
    if (!(forceStop)) {
        if (main && queue) {
            display.textContent = calculate(main, queue);
            main = display.textContent;
        }
    }
    //Return the initial state
    forceStop = true;
    clickedEqual = false;
    focus = "main";
}

numsPad.forEach(num => num.addEventListener("click", (e) => {
    if (renew) display.textContent = "0";
    if (e.target.textContent === "." && !(display.textContent.includes("."))) {
        display.textContent += ".";
        renew = false;
        forceStop = false;
    } else if (e.target.textContent === "0" && (display.textContent[0] !== "0")) {
        display.textContent += "0";
        renew = false;
        forceStop = false;
    } else if (e.target.textContent !== "." && e.target.textContent !== "0") {
        if (display.textContent[0] === "0" && display.textContent[1] !== ".") display.textContent = "";
        display.textContent += e.target.textContent;
        renew = false;
        forceStop = false;
    }
    forceStop = false;
    focus = "input";
}));

ac.addEventListener("click", AC );
del.addEventListener("click", delF);

add.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    operator = "add";
    renew = true;
    forceStop = true;
});

subtract.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    operator = "subtract";
    renew = true;
    forceStop = true;
});

multiply.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    operator = "multiply";
    renew = true;
    forceStop = true;
});

divide.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    operator = "divide";
    renew = true;
    forceStop = true;
});

percent.addEventListener("click", (e) => {
    display.textContent = Number(display.textContent)/100;
})

equal.addEventListener("click", (e) => {
    clickedEqual = true;
    addOperantsAndCalculate();
    renew = true;
});