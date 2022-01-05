function onload() {
    const widgets = getWidgets();
    let cellSize = 40;
    let score = Math.trunc(score / 2);
    let attempts = 0;
    let startTime;
    let totalTime = 0;
    let waitingForClick = true;
    const target = { x: 0, y: 0 };
    canvas.addEventListener('mouseup', function (e) {
        mouseUp(canvas, e);
    });

    doIt();

    function doIt() {
        setProgress(widgets, score, cellSize);
        if (score >= 10) {
            reportResults(widgets, totalTime, attempts);
        } else {
            setupGrid(widgets, cellSize, cellSize / 2, false);
            target.x = getRandomInt(5) + widgets.offset.x;
            target.y = getRandomInt(5) + widgets.offset.y;
            prompt(target);
            waitingForClick = true;
            startTime = new Date();
        }
    }

    function prompt(point) {
        widgets.paragraph.textContent = 'Click on pixel (' + point.x + ', ' + point.y + ') using ' +
            (widgets.offset.topToBottom ? 'top-to-bottom' : 'bottom-to-top') + ' coordinates.';
    }


    function mouseUp(canvas, event) {
        if (waitingForClick) {
            waitingForClick = false;
            const point = getMousePixelLocation(canvas, event, widgets, cellSize);
            const x = Math.floor(point.x);
            const y = Math.floor(point.y);
            if (x == target.x && y == target.y) {
                widgets.graphics.fillStyle = "#0F0";
                widgets.graphics.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 1, cellSize - 1);
                score = score + 1;
                setProgress(widgets, score, cellSize);
                setTimeout(doIt, 1000);
            } else {
                widgets.graphics.fillStyle = "red";
                widgets.graphics.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 1, cellSize - 1);
                score = Math.trunc(score / 2);
                labelAxes(widgets, { x, y }, cellSize, cellSize / 2);
                setProgress(widgets, score, cellSize);
                waitingForClick = true;
            }
            attempts = attempts + 1;
            totalTime = new Date() - startTime + totalTime;
        }
    }
}
