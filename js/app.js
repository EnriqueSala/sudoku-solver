const puzzleBoard = document.querySelector('#sudoku');
const solveButton = document.querySelector('#solve-button');
const validateButton = document.querySelector('#validate-button');
const clearButton = document.querySelector('#clear-button');
const randomButton = document.querySelector('#generate-button')
const ROWS = 9;
const COLUMNS = 9;

//Create the board with attributes and ids
for (let i = 0; i < ROWS; i++) {
    let divRow = document.createElement('div');
    divRow.setAttribute('id', 'row' + i);
    for (let j = 0; j < COLUMNS; j++) {
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'number');
        inputElement.setAttribute('min', 1);
        inputElement.setAttribute('max', 9);


        if(
            ((i==0 ||i==1 ||i==2) && (j<3 || j>5)) ||
            ((i==6 ||i==7 ||i==8) && (j<3 || j>5)) ||
            ((i%9==3 ||i%9==4 ||i%9==5) && (j>2 && j < 6))
            
            ){
                inputElement.classList.add('odd-section');
            }


        divRow.appendChild(inputElement);
    }
    puzzleBoard.appendChild(divRow);

}

function colorElement(element, i){
    
}

const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')

const encodeParams = (params) =>
    Object.keys(params)
        .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
        .join('&');


//Sends the sudoku data to an API to either solve or validate the sudoku
function solveSudoku(action) {
    console.log(action);
    let numbers = getSudokuNumbers();
    const data = { board: numbers };
    fetch('https://sugoku.herokuapp.com/solve', {
        method: 'POST',
        body: encodeParams(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(response => response.json())
    .then(response =>
        fillBoard(response.status == 'solved', response.solution))
    .catch(console.warn)
}
function validateSudoku(action) {
    console.log(action);
    let numbers = getSudokuNumbers();
    const data = { board: numbers };
    fetch('https://sugoku.herokuapp.com/validate', {
        method: 'POST',
        body: encodeParams(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(response => response.json())
    .then(response =>
        window.alert(response.status.toUpperCase()))
    .catch(console.warn)
}

//Gets all the values from the board
function getSudokuNumbers() {
    let rowValues = [[], [], [], [], [], [], [], [], [], []];
    let boardValues = [];
    const divs = document.querySelectorAll('#sudoku div');

    divs.forEach((div, i) => {
        const inputs = div.querySelectorAll('input');
        inputs.forEach((input) => {
            if (input.value) {
                rowValues[i].push(parseInt(input.value));
            } else {
                rowValues[i].push(0);
            }
        })
        boardValues.push(rowValues[i]);

    })
    return boardValues;
}

function fillBoard(isSolvable, solution) {
    const divs = document.querySelectorAll('#sudoku div');
    solution.forEach((row, i) => {
        let inputs = divs[i].querySelectorAll('input');
        row.forEach((value, j) => {
            inputs[j].value = value;
        })
    })
}
function generateSudoku(){
    let difficulty = document.getElementById('dif').value;
    fetch('https://sugoku.herokuapp.com/board?difficulty='+difficulty,{
        method: 'GET'
    }).then(response => response.json())
    .then(response =>
        fillBoard(true,response.board))
}
function clearBoard() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    })
}
solveButton.addEventListener('click',solveSudoku)
validateButton.addEventListener('click',validateSudoku);
clearButton.addEventListener('click', clearBoard);
randomButton.addEventListener('click', generateSudoku);