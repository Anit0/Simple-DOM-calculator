const screen = document.getElementById('screen');
const buttons = document.querySelectorAll('.btn');

let expression = '0';

function updateScreen(value) {
  screen.value = value;
}

function clearCalculator() {
  expression = '0';
  updateScreen(expression);
}

function deleteLastCharacter() {
    
  if (expression === '0') {
    return;
  }

  expression = expression.slice(0, -1) || '0';
  updateScreen(expression);
}

function appendNumber(value) {
  if (expression === '0') {
    expression = value;
  } else {
    expression += value;
  }

  updateScreen(expression);
}

function appendDecimal() {
  const lastNumber = expression.split(/[+\-*/]/).pop();

  if (lastNumber.includes('.')) {
    return;
  }

  if (expression === '0' || /[+\-*/]$/.test(expression)) {
    expression += '0.';
  } else {
    expression += '.';
  }

  updateScreen(expression);
}

function appendOperator(operatorValue) {
  if (expression === '0') {
    if (operatorValue === '-') {
      expression = '-';
    }
    updateScreen(expression);
    return;
  }

  if (/[+\-*/]$/.test(expression)) {
    expression = expression.slice(0, -1) + operatorValue;
  } else {
    expression += operatorValue;
  }

  updateScreen(expression);
}

function calculate() {

  if (expression === '0' || expression === '' || /[+\-*/]$/.test(expression)) {
    return;
  }

  const safeExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');

  try {

    const result = Function(`"use strict"; return (${safeExpression});`)();

    if (!Number.isFinite(result)) {
      expression = 'Error';
      updateScreen(expression);
      return;
    }

    expression = Number.isInteger(result)
      ? String(result)
      : String(parseFloat(result.toFixed(10)));

    updateScreen(expression);
  } catch (error) {
    expression = 'Error';
    updateScreen(expression);
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (value !== undefined) {
      if (/[0-9]/.test(value)) {
        appendNumber(value);
      } else if (value === '.') {
        appendDecimal();
      } else {
        appendOperator(value);
      }
      return;
    }

    switch (action) {
      case 'clear':
        clearCalculator();
        break;
      case 'delete':
        deleteLastCharacter();
        break;
      case 'equals':
        calculate();
        break;
      default:
        break;
    }
  });
});
