
const display = document.getElementById("display");
const previousOperand = document.getElementById("previous-operand");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentInput;
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(12)));
}

function enterNumber(number) {
    if (currentInput === "Error" || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.length < 16) {
        currentInput += number;
    }

    updateDisplay();
}

function enterDecimal() {
    if (currentInput === "Error" || shouldResetDisplay) {
        currentInput = "0";
        shouldResetDisplay = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (currentInput === "Error") return;

    if (operator && !shouldResetDisplay) {
        calculate();
        if (currentInput === "Error") return;
    }

    previousInput = Number(currentInput);
    operator = nextOperator;
    shouldResetDisplay = true;

    previousOperand.textContent =
        `${currentInput} ${getOperatorSymbol(operator)}`;

    updateDisplay();
}

function getOperatorSymbol(op) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[op];
}

function calculate() {
    if (operator === null || previousInput === null) return;

    const first = previousInput;
    const second = Number(currentInput);
    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;
        case "-":
            result = first - second;
            break;
        case "*":
            result = first * second;
            break;
        case "/":
            if (second === 0) {
                currentInput = "Error";
                previousOperand.textContent = "Cannot divide by zero";
                operator = null;
                previousInput = null;
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = first / second;
            break;
        default:
            return;
    }

    previousOperand.textContent =
        `${first} ${getOperatorSymbol(operator)} ${second} =`;

    currentInput = formatNumber(result);
    operator = null;
    previousInput = null;
    shouldResetDisplay = true;

    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    previousInput = null;
    operator = null;
    shouldResetDisplay = false;

    previousOperand.textContent = "";
    updateDisplay();
}

function deleteNumber() {
    if (currentInput === "Error" || shouldResetDisplay) {
        currentInput = "0";
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput.slice(0, -1) || "0";
    }

    updateDisplay();
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearCalculator();
                break;
            case "delete":
                deleteNumber();
                break;
            case "decimal":
                enterDecimal();
                break;
            case "calculate":
                calculate();
                break;
        }
    }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        enterNumber(key);
    } else if (key === ".") {
        enterDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape" || key === "Delete") {
        clearCalculator();
    }
});

updateDisplay();
