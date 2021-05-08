const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  // If the `displayValue` does not contain a decimal point
  if (!calculator.displayValue.includes(dot)) {
    // Append the decimal point
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand)  {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand == null) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const currentValue = firstOperand || 0;
    
    const result = fn(currentValue, operator, inputValue);

    calculator.displayValue = result;
    if (result != '???')
        calculator.firstOperand = parseFloat(result);
    else
        calculator.firstOperand = 0;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

function fn(o1, op, o2) {
    var url = "http://localhost:3000/calculator/";
    switch (op) {
        case '+': url += "add/"; break;
        case '-': url += "sub/"; break;
        case '/': url += "div/"; break;
        case '*': url += "mul/"; break;
    }
    url += o1 + "/" + o2;
    var finalAns = '???';
    var xhr = new XMLHttpRequest();
    var d = new Date();
    
    try {
        xhr.open("GET", url, false);
        xhr.send();
        
        if (xhr.responseText != null) {
            var resp = JSON.parse(xhr.responseText);
            if (resp['answer'] != null) {
                if (resp['answer'] == '???') {
                    alert('Attempted illegal operation!');
                    return 0;
                }
                finalAns = parseFloat(resp['answer']);
                document.getElementById('status').style.color = 'lightgreen';
                document.getElementById('status').innerHTML = '<center>Answer fetched in: ' + (new Date() - d) + "ms.</center>";
            }
            else throw new Error('No valid response from server!');
        }
    } catch(err) {
        console.log(err);
        document.getElementById('status').style.color = 'red';
        document.getElementById('status').innerHTML = "<center>Could not fetch answer. Time: " + (new Date() - d) + "ms.<center>";
    }
    return finalAns;
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

function updateDisplay() {
  const display = document.querySelector('.calculator-screen');
  display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) {
    return;
  }

  if (target.classList.contains('operator')) {
    handleOperator(target.value);
		updateDisplay();
    return;
  }

  if (target.classList.contains('decimal')) {
    inputDecimal(target.value);
		updateDisplay();
    return;
  }

  if (target.classList.contains('all-clear')) {
    resetCalculator();
		updateDisplay();
    return;
  }

  inputDigit(target.value);
  updateDisplay();
});