/**
 * Created by vlad on 25.03.16.
 */

var N = 0;
var M = 0;

window.onload = function() {
    setMatrixSize(3);
};

function resizeMatrix() {
    var size = document.getElementById("matrixSizeSelect").value;
    setMatrixSize(size);
}

function setMatrixSize(n) {
    N = Number(n);
    M = N + 1;
    
    var matrixBlock = document.getElementById("matrix");
    deleteChildren(matrixBlock);
    deleteChildren(document.getElementById("steps"));

    var matrixA = document.createElement('table');
    for (var i = 0; i < N; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < N; j++) {
            var td = document.createElement('td');
            var input = document.createElement('input');
            input.type = "text";
            input.id = (i + 1) + "." + (j + 1);
            input.className = "matrixCell";
            input.defaultValue = 0;
            td.appendChild(input);
            tr.appendChild(td);
        }
        matrixA.appendChild(tr);
    }
    matrixA.id = "matrixA";
    matrixBlock.appendChild(matrixA);
    
    var vectorB = document.createElement('table');
    for (var i = 0; i < N; i++) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        var input = document.createElement('input');
        input.type = "text";
        input.id = "b" + (i + 1);
        input.className = "matrixCell";
        input.defaultValue = 0;
        td.appendChild(input);
        tr.appendChild(td);
        vectorB.appendChild(tr);
    }
    vectorB.id = "vectorB";
    matrixBlock.appendChild(vectorB);
}

function calculate() {
    var system = readData();
    var answer = gaussianElimination(system);
    printData(answer);
}

function readData() {

    var system = new Array(N);
    for (var i = 0; i < N; i++) {
        system[i] = new Array(N + 1);
    }

    for (var i = 0; i < N; i++)
        for (var j = 0; j < N; j++) {
            var s = (i + 1) + "." + (j + 1);
            system[i][j] = document.getElementById(s).value;
        }
    for (var i = 0; i < N; i++) {
        system[i][M - 1] = document.getElementById("b" + (i + 1)).value;
    }

    return system;
}

function gaussianElimination(matrix){

    if ( checkForDuplicateRows(matrix) )
        return "Duplicate rows in matrix!";

    var steps = new Array(N * 2 - 1);
    for (var i = 0; i < N * 2 - 1; i++) {
        steps[i] = new Array(N);
        for (var j = 0; j < N; j++) {
            steps[i][j] = new Array(M);
        }
    }

    var currentStep = 0;

    for (var i = 0; i < N; i++) {
        var aii = matrix[i][i];

        //here may be checking for correct input

        for (var j = i; j < M; j++) {
            matrix[i][j] = matrix[i][j] / aii;
            // if ( isNaN(matrix[i][j]) )
            //     return "incorrect matrix";
        }
        for (var j = i + 1; j < N; j++) {
            var aji = matrix[j][i];
            for (var k = 0; k < M; k++) {
                matrix[j][k] -= matrix[i][k] * aji;
                // if ( isNaN(matrix[j][k]) )
                //      return "incorrect matrix";
            }
        }

        for (var j = 0; j < N; j++) {
            for (var k = 0; k < M; k++) {
                steps[currentStep][j][k] = matrix[j][k];
            }
        }
        currentStep++;
    }

    for (var i = N - 2; i >= 0; i--) {
        for (var j = i; j >=0; j--) {
            var aji = matrix[j][i + 1];
            for (var k = j + 1; k < M; k++) {
                matrix[j][k] -= matrix[i + 1][k] * aji;
            }
        }
        for (var j = 0; j < N; j++) {
            for (var k = 0; k < M; k++) {
                steps[currentStep][j][k] = matrix[j][k];
            }
        }
        currentStep++;
    }

    return steps;
}

function checkForDuplicateRows(matrix) {
    var stringMatrix = new Array(N);
    for (var i = 0; i < N; i++) {
        stringMatrix[i] = matrix[i].toString();
    }

    for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
            if (stringMatrix[i] == stringMatrix[j])
                return true;
        }
    }

    return false;
}


function printData(data) {

    if ( typeof data == "string") {
        var errorBlock = document.getElementById("steps");
        errorBlock.innerHTML = "<span class = 'errorMessage'>" + data + "</span>";
        return;
    }
    
    var stepsBlock = document.getElementById("steps");
    deleteChildren(stepsBlock);

    for (var i = 0; i < N * 2 - 1; i++) {
        var tableDiv = document.createElement('div');
        tableDiv.className = "tableDiv";
        var stepTable = document.createElement('table');
        stepTable.className = "stepTable";

        for (var j = 0; j < N; j++) {
            var tr = document.createElement('tr');
            for (var k = 0; k < M; k++) {
                tr.innerHTML += "<td>" + data[i][j][k] + "</td>";
            }
            stepTable.appendChild(tr);
        }

        tableDiv.appendChild(stepTable);
        
        stepsBlock.appendChild(tableDiv);
    }
}

function resetMatrix() {
    setMatrixSize(3);

    //bad matrix :(
    // var testMatrix = [
    //     [1, 3, 1, 9],
    //     [1, 1, -1, 1],
    //     [3, 11, 5, 35]
    // ];

    var testMatrix = [
        [2, 1, -1, 8],
        [-3, -1, 2, -11],
        [-2, 1, 2, -3]
    ];

    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            document.getElementById((i + 1) + "." + (j + 1)).value = testMatrix[i][j];
        }
        document.getElementById("b" + (i + 1)).value = testMatrix[i][N];
    }

}

function deleteChildren(parentNode) {
    while (parentNode.firstElementChild) {
        parentNode.removeChild(parentNode.firstElementChild);
    }
}