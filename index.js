var c = document.createElement("canvas");
var ctx = c.getContext("2d");
document.body.appendChild(c);

//slider1 setup
var slider = document.getElementById("timeRange");
var output = document.getElementById("timeDisplay");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}

//slider2 setup
var slider2 = document.getElementById("sizeRange");
var output2 = document.getElementById("sizeDisplay");
output2.innerHTML = slider2.value;

slider2.oninput = function() {
    output2.innerHTML = this.value;
}

//slider3 setup
var slider3 = document.getElementById("gridSizeRange");
var output3 = document.getElementById("gridSizeDisplay");
output3.innerHTML = slider3.value;

slider3.oninput = function() {
    output3.innerHTML = this.value;
}

//set sizes
c.width = slider3.value;
c.height = slider3.value;
var cellSize = slider2.value;
var xSize = c.width/cellSize;
var ySize = c.height/cellSize;

var adjacent = [
    [1,1],
    [1,0],
    [1,-1],
    [0,1],
    [0,-1],
    [-1,1],
    [-1,0],
    [-1,-1]
];


var templates = [
    //Gosper's glider gun
    [
        [2, 5],[2, 6],[3, 6],[3, 5],[12, 5],[12, 6],[12, 7],[13, 4],[13, 8],[14, 3],
        [15, 3],[14, 9],[15, 9],[16, 6],[17, 4],[17, 8],[18, 7],[18, 6],[18, 5],[19, 6],
        [22, 5],[23, 5],[22, 4],[23, 4],[22, 3],[23, 3],[24, 2],[24, 6],[26, 1],[26, 2],
        [26, 6],[26, 7],[36, 3],[36, 4],[37, 4],[37, 3]
    ],
    //pulsar
    [
        [30, 28],[29, 29],[32, 28],[33, 29],[33, 31],[32, 32],[29, 31],[30, 32],[30, 33],[30, 34],
        [28, 31],[27, 31],[27, 31],[28, 29],[27, 29],[30, 27],[30, 26],[32, 26],[32, 27],[34, 31],
        [35, 29],[35, 31],[32, 33],[32, 34],[33, 36],[34, 36],[35, 36],[37, 32],[37, 33],[34, 29],
        [37, 34],[29, 36],[28, 36],[27, 36],[25, 32],[25, 33],[25, 34],[25, 28],[25, 27],[25, 26],
        [29, 24],[28, 24],[27, 24],[33, 24],[34, 24],[35, 24],[37, 28],[37, 27],[37, 26]
    ],
    [
        [28,29],[28,30],[28,31],[29,29],[27,30]
    ]
]

var option = document.getElementById("templates");

var grid = [];
var temp = [];
var saved = [];

var going = false;


function getMousePos(evt) {
    var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function setTemp() {
    for (var i = 0; i < xSize; i++) {
        for (var j = 0; j < ySize; j++) {
            temp[i][j] = grid[i][j];
        }
    }
}

function setSaved() {
    for (var i = 0; i < xSize; i++) {
        saved[i] = [];
        for (var j = 0; j < ySize; j++) {
            saved[i][j] = grid[i][j];
        }
    }
}

function loadSaved() {
    for (var i = 0; i < xSize; i++) {
        for (var j = 0; j < ySize; j++) {
            grid[i][j] = saved[i][j];
            if (grid[i][j] == 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
}

function mouseEvent(evt) {
    var mousePos = getMousePos(evt);
    var i = Math.floor(mousePos.x/cellSize); 
    var j = Math.floor(mousePos.y/cellSize);
    console.log(i+", "+j);
    if (grid[i][j] == 0) {
        grid[i][j] = 1;
        ctx.fillStyle = 'black';
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
    else {
        grid[i][j] = 0;
        ctx.fillStyle = 'white';
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
}

var timeInterval;

function setup() {
    //draw grid lines
    clearInterval(timeInterval);
    if (going) return;

    //update size
    c.width = slider3.value;
    c.height = slider3.value;
    cellSize = slider2.value;
    xSize = c.width/cellSize;
    ySize = c.height/cellSize;

    //draw grid
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.lineWidth = 0.1;
    for (var i = 0; i < xSize; i++) {
        ctx.moveTo(i * cellSize, 1);
        ctx.lineTo(i * cellSize, c.height);
        ctx.moveTo(1, i * cellSize);
        ctx.lineTo(c.width, i * cellSize);
    }
    ctx.stroke();
    //create grid and temp
    for (var i = 0; i < xSize; i++) {
        grid[i] = [];
        temp[i] = [];
        for (var j = 0; j < ySize; j++) {
            grid[i][j] = 0;
            temp[i][j] = 0;
        }
    }
    c.addEventListener("click", mouseEvent, false);
}

function loop() {
    setSaved();
    timeInterval = setInterval(function() {
        if (!going) return;
        setTemp();
        for (var i = 0; i < xSize; i++) {
            for (var j = 0; j < ySize; j++) {
                //draw current grid (temp)
                if (temp[i][j] == 1) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
                else {
                    ctx.fillStyle = 'white';
                    ctx.clearRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }

                //count number adjacent neighbors that are alive
                var numAlive = 0;
                for (var k = 0; k < 8; k++) {
                    var x = i + adjacent[k][0];
                    var y = j + adjacent[k][1];
                    if (x >= 0 && x < xSize && y >= 0 && y < ySize) {
                        if (temp[x][y] == 1) {
                            numAlive++;
                        }
                    }
                }
                
                if (temp[i][j] == 1) { 
                    if (numAlive < 2 || numAlive > 3) { //death condition
                        grid[i][j] = 0;
                    }
                }
                else { 
                    if (numAlive == 3) { //life condition
                        grid[i][j] = 1;
                    }
                }
            }
        }
    }, slider.value);
}

function loadTemplate(num) {
    document.querySelector("#button1").innerHTML = "Go!";
    going = false;
    setup();
    for (var i = 0; i < templates[num].length; i++) {
        var x = templates[num][i][0];
        var y = templates[num][i][1];
        grid[x][y] = 1;
        ctx.fillStyle = 'black';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
}

function templateButton() {
    loadTemplate(option.value);
}

function clearButton() {
    document.querySelector("#button1").innerHTML = "Go!";
    going = false;
    setup();
}

function goButton() {
    if (!going) { //go!
        going = true;
        c.removeEventListener("click", mouseEvent);
        document.querySelector("#button1").innerHTML = "redraw";
        loop();
    }
    else if (going) { //redraw
        going = false;
        setup();
        loadSaved();
        document.querySelector("#button1").innerHTML = "Go!";
    }
}

setup();