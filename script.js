// Get the calculator display elements
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

// Get all calculator buttons
const buttons = document.querySelectorAll("button");

// Variables used by the calculator
let currentInput = "0";
let previousInput = "";
let operator = "";
let waitingForOperand = false;


// ========================================
// UPDATE DISPLAY
// ========================================

function updateDisplay() {

    resultDisplay.textContent = currentInput;

    if (previousInput && operator) {
        expressionDisplay.textContent =
            previousInput + " " + getOperatorSymbol(operator);
    } else {
        expressionDisplay.textContent = "";
    }
}


// ========================================
// OPERATOR SYMBOL
// ========================================

function getOperatorSymbol(op) {

    if (op === "*") {
        return "×";
    }
    else if (op === "/") {
        return "÷";
    }
    else if (op === "-") {
        return "−";
    }
    else {
        return "+";
    }
}


// ========================================
// INPUT NUMBERS
// ========================================

function inputNumber(number) {

    if (waitingForOperand) {

        if (number === ".") {
            currentInput = "0.";
        }
        else {
            currentInput = number;
        }

        waitingForOperand = false;
    }

    else if (number === "." && currentInput.includes(".")) {

        // Don't allow two decimal points

        return;
    }

    else if (currentInput === "0" && number !== ".") {

        currentInput = number;
    }

    else {

        currentInput += number;
    }

    updateDisplay();
}


// ========================================
// CHOOSE OPERATOR
// ========================================

function chooseOperator(selectedOperator) {

    if (operator && !waitingForOperand) {
        calculate();
    }

    previousInput = currentInput;

    operator = selectedOperator;

    waitingForOperand = true;

    updateDisplay();
}


// ========================================
// CALCULATE
// ========================================

function calculate() {

    if (!previousInput || !operator || waitingForOperand) {
        return;
    }

    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);

    let answer;


    // IF / ELSE statements
    // are used to select the operation.

    if (operator === "+") {

        answer = firstNumber + secondNumber;
    }

    else if (operator === "-") {

        answer = firstNumber - secondNumber;
    }

    else if (operator === "*") {

        answer = firstNumber * secondNumber;
    }

    else if (operator === "/") {

        // Prevent division by zero

        if (secondNumber === 0) {

            currentInput = "Cannot divide by 0";

            previousInput = "";

            operator = "";

            waitingForOperand = true;

            updateDisplay();

            return;
        }

        answer = firstNumber / secondNumber;
    }


    // Limit unnecessary decimal digits

    currentInput = String(
        Number(answer.toFixed(10))
    );

    previousInput = "";

    operator = "";

    waitingForOperand = true;

    updateDisplay();
}


// ========================================
// CLEAR CALCULATOR
// ========================================

function clearCalculator() {

    currentInput = "0";

    previousInput = "";

    operator = "";

    waitingForOperand = false;

    updateDisplay();
}


// ========================================
// DELETE LAST CHARACTER
// ========================================

function deleteLast() {

    if (
        waitingForOperand ||
        currentInput === "Cannot divide by 0"
    ) {
        return;
    }

    if (currentInput.length > 1) {

        currentInput =
            currentInput.slice(0, -1);
    }

    else {

        currentInput = "0";
    }

    updateDisplay();
}


// ========================================
// BUTTON EVENT HANDLER
// ========================================

function handleButtonClick(button) {

    const number = button.dataset.number;

    const selectedOperator =
        button.dataset.operator;

    const action =
        button.dataset.action;


    if (number !== undefined) {

        inputNumber(number);
    }

    else if (selectedOperator) {

        chooseOperator(selectedOperator);
    }

    else if (action === "equals") {

        calculate();
    }

    else if (action === "clear") {

        clearCalculator();
    }

    else if (action === "delete") {

        deleteLast();
    }
}


// ========================================
// LOOP + EVENT LISTENERS
// ========================================

// The assignment specifically requires
// event listeners and loops.

for (let i = 0; i < buttons.length; i++) {

    buttons[i].addEventListener(
        "click",
        function () {

            handleButtonClick(buttons[i]);
        }
    );
}


// ========================================
// KEYBOARD SUPPORT
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        if (
            (key >= "0" && key <= "9") ||
            key === "."
        ) {

            inputNumber(key);
        }

        else if (
            ["+", "-", "*", "/"].includes(key)
        ) {

            chooseOperator(key);
        }

        else if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();
        }

        else if (key === "Escape") {

            clearCalculator();
        }

        else if (key === "Backspace") {

            deleteLast();
        }
    }
);


// Start calculator

updateDisplay();