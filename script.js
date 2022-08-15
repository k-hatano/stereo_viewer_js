
var canvasWidth = 640;
var canvasHeight = 480;

var leftImage = new Image();
var rightImage = new Image();

onload = function() {
    drawCanvas();
};

function generate() {
    drawCanvas();
}

function loadImage(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = function() {
        let result = splitImageToLeftRight(reader.result);
        leftImage.src = result[0];
        rightImage.src = result[1];
        drawCanvas();
    };
}

function drawCanvas() {
    var canvasLeft = document.getElementById('canvas_left');
    var contextLeft = canvasLeft.getContext('2d');
    contextLeft.clearRect(0, 0, canvasWidth, canvasHeight);
    contextLeft.drawImage(leftImage, 0, 0, canvasWidth, canvasHeight);

    var canvasRight = document.getElementById('canvas_right');
    var contextRight = canvasRight.getContext('2d');
    contextRight.clearRect(0, 0, canvasWidth, canvasHeight);
    contextRight.drawImage(rightImage, 0, 0, canvasWidth, canvasHeight);
}

function splitImageToLeftRight(source) {
    var indexPair = [];
    var depth = 0;
    var startIndex = 0;
    
    console.log(source.length);
    for (var i = 0; i < source.length; i++) {
        // console.log("" + i + " : " + source[i] + " (" + source.charCodeAt(i).toString(16) + ")");

        if (source.charCodeAt(i) == 0xff && source.charCodeAt(i + 1) == 0xd8) {
            if (depth == 0) {
                startIndex = i;
            }
            depth++;
            i++;
        }
        if (source.charCodeAt(i) == 0xff && source.charCodeAt(i + 1) == 0xd9) {
            depth--;
            if (depth == 0) {
                indexPair.push({start:startIndex, end:i + 2});
            }
            i++;
        }
    }

    var result = [];
    for (var i = 0; i < indexPair.length; i++) {
        var image = source.substring(indexPair[i].start, indexPair[i].end);
        var imageUrl = 'data:image/jpeg;base64,' + btoa(image);

        result.push(imageUrl);
    }
    // console.dir(result);
    return result;
}


