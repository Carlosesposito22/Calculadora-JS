class CalculatorController {

    constructor() {
        this.operation = [];

        this.lastOperator = '';
        this.lastNumber = '';

        this.displayElement = document.querySelector("#display");
        this.dateElement = document.querySelector("#data");
        this.timeElement = document.querySelector("#hora");

        this.currentDate;
        this.audioOnOff = false;
        this.audio = new Audio("click.mp3");

        this.initialize();
    }

    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    setLastOperation(value) {
        this.operation[this.operation.length - 1] = value;
    }

    getLastOperation() {
        return this.operation[this.operation.length - 1];
    }

    getLastItem(isOperator = true) {
        let lastItem;

        for (let i = this.operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this.operation[i]) == isOperator) {
                lastItem = this.operation[i];
                break;
            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this.lastOperator : this.lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalculator = lastNumber;
    }

    getResult() {
        try {
            return eval(this.operation.join(""));
        }
        catch(e) {
            setTimeout(() => {
                this.displayCalculator = "Error";
            }, 1);
        }
    }

    calc() {
        let last = '';

        this.lastOperator = this.getLastItem();
        
        if (this.operation.length < 3) {
            let firstItem = this.operation[0];
            this.operation = [firstItem, this.lastOperator, this.lastNumber];
        }

        if (this.operation.length > 3) {
            last = this.operation.pop();

            this.lastNumber = this.getResult();
        } 
        else if (this.operation.length == 3) {
            this.lastNumber = this.getLastOperation();
        }

        let result = this.getResult();

        if (last == '%') {
            result = result / 100;
            this.operation = [result]
        } else {
            this.operation = [result];
            if (last) this.operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    pushOperation(value) {
        this.operation.push(value);

        if (this.operation.length > 3) {
            this.calc();
        }
    }

    addOperation(value) {
        if(isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }

        console.log(this.operation);
    }

    addDot() {
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) {
            return;
        }

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    executeBtn(value) {

        this.playAudio();

        switch (value) {
            case "ac":
                this.operation = [];
                this.lastNumber = '';
                this.lastOperator = '';
                this.setLastNumberToDisplay();
                break;
            case "ce":
                this.operation.pop();
                this.setLastNumberToDisplay();
                break;
            case "soma":
                this.addOperation('+');
                break;
            case "subtracao":
                this.addOperation('-');
                break;
            case "divisao":
                this.addOperation('/');
                break;
            case "multiplicacao":
                this.addOperation('*');
                break;
            case "porcento":
                this.addOperation('%');
                break;
            case "igual":
                this.calc();
                break;
            case "ponto":
                this.addDot('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.displayCalculator = "Error";
                break;
        }
    }
    
    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString("pt-BR");
        this.displayTime = this.currentDate.toLocaleTimeString("pt-BR");
    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    pastFromClipboard() {
        document.addEventListener('paste', event =>{
            let text = event.clipboardData.getData('Text');
            this.displayCalculator = parseFloat(text);
        });
    }

    copyToClipboard() {
        let input = document.createElement('input');
        input.value = this.displayCalculator;

        document.body.appendChild(input);
        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    toggleAudio() {
        this.audioOnOff = !this.audioOnOff;
    }

    playAudio() {
        if (this.audioOnOff) {
            this.audio.currentTime = 0;
            this.audio.play();
        }
    }

    initialize() {
        this.setDisplayDateTime();
        setInterval(() => this.setDisplayDateTime(), 1000);

        this.initButtonsEvents();
        this.initKeyboard();
        this.pastFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', event => {
                this.toggleAudio();
            });
        });
    }

    initKeyboard() {
        document.addEventListener('keyup', event => {

            this.playAudio();

            switch (event.key) {
                case "Escape":
                    this.operation = [];
                    this.lastNumber = '';
                    this.lastOperator = '';
                    this.setLastNumberToDisplay();
                    break;
                case "Backspace":
                    this.operation.pop();
                    this.setLastNumberToDisplay();
                    break;
                case "+":
                case "-":
                case "/":
                case "*":
                case "%":
                    this.addOperation(event.key);
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addDot('.');
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(event.key));
                    break;

                case 'c':
                    if (event.ctrlKey) this.copyToClipboard();
                    break
            }
        });
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach(btn => {
            this.addEventListenerAll(btn, "click drag", fn => {
                this.executeBtn(btn.className.baseVal.replace("btn-", ""));
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }

    get displayCalculator() { return this.displayElement.innerHTML; }

    set displayCalculator(value) { 
        if (value.toString().length > 10) {
            this.displayCalculator = "Error";
            return false;
        }
        this.displayElement.innerHTML = value; 
    }

    get displayTime() { return this.timeElement.innerHTML; }

    set displayTime(value) { this.timeElement.innerHTML = value; }

    get displayDate() { return this.dateElement.innerHTML; }

    set displayDate(value) { return this.dateElement.innerHTML = value; }

    get currentDate() { return new Date(); }
}