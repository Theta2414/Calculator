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

let forceStop;
let num1;
let num2;
let operator;
let renew;

function AC() {
    display.textContent = "0";
    num1 = null;
    num2 = null;
}

function delF() {
    if (display.textContent.length === 1) {
        display.textContent = "0";
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
}

function calculate(num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    if (operator && num1 || num1 === 0 && num2 || num2 === 0) {
        switch (operator) {
            case "add":
                return num1 + num2;
            case "subtract":
                return num1 - num2;
            case "multiply":
                return num1 * num2;
            case "divide":
                if (num2 === 0) {
                    return "Error"
                }
                return num1 / num2;
        }
    };
}

function addOperantsAndCalculate() {
    if (!(forceStop)) {
        if (!num1 && num1 !== "0") {
            num1 = display.textContent;
        } else {
            num2 = display.textContent;
        };
        if (num1 && num2) {
            display.textContent = calculate(num1, num2);
            num1 = display.textContent;
        }
    }
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
    }
    else if (e.target.textContent !== "." && e.target.textContent !== "0") {
        if (display.textContent[0] === "0" && display.textContent[1] !== ".") display.textContent = "";
        display.textContent += e.target.textContent;
        renew = false;
        forceStop = false;
    }
    forceStop = false;
}));

ac.addEventListener("click", AC );
del.addEventListener("click", delF);

add.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    operator = "add";
    num2 = null;
    renew = true;
    forceStop = true;
});

subtract.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    operator = "subtract";
    num2 = null;
    renew = true;
    forceStop = true;
});

multiply.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    operator = "multiply";
    num2 = null;
    renew = true;
    forceStop = true;
});

divide.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    operator = "divide";
    num2 = null;
    renew = true;
    forceStop = true;
});

percent.addEventListener("click", (e) => {
    display.textContent = Number(display.textContent)/100;
})

equal.addEventListener("click", (e) => {
    addOperantsAndCalculate();
    num2 = null;
    renew = true;
});