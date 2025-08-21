let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForNewInput = false;

function updateDisplay() {
    display.value = formatNumber(currentInput);
}

function formatNumber(num) {
    if (num.length > 12) {
        return parseFloat(num).toExponential(6);
    }
    return num;
}

function appendToDisplay(value) {
    createRippleEffect(event.target);

    if (waitingForNewInput) {
        currentInput = '';
        waitingForNewInput = false;
    }

    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }

    updateDisplay();
}

function clearDisplay() {
    createRippleEffect(event.target);
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForNewInput = false;
    updateDisplay();
}

function deleteLast() {
    createRippleEffect(event.target);
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    createRippleEffect(event.target);

    if (operator && previousInput !== null) {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('تقسیم بر صفر امکان‌پذیر نیست!');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        currentInput = result.toString();
        operator = null;
        previousInput = null;
        waitingForNewInput = true;
        updateDisplay();
    } else if (operator) {
        previousInput = currentInput;
        waitingForNewInput = true;
    }
}

function createRippleEffect(button) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');

    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Override operator buttons to handle calculation
document.querySelectorAll('.btn-operator').forEach(btn => {
    btn.addEventListener('click', function() {
        const op = this.onclick.toString().match(/appendToDisplay\('(.+?)'\)/)[1];

        if (operator && !waitingForNewInput) {
            calculate();
        }

        operator = op;
        previousInput = currentInput;
        waitingForNewInput = true;
    });
});

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display
updateDisplay();