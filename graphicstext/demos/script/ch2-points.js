function onload() {
    const widgets = getWidgets();
    let cellSize = 40;
    let score = 0;
    let waitingForClick = true;
    const target = { x: 0, y: 0 };
    let attempts = 0;
    let startTime;
    let totalTime = 0;

    canvas.addEventListener('mouseup', function (e) {
        mouseUp(canvas, e);
    });
    doIt();

    function doIt() {
        setProgress(widgets, score, cellSize);
        if (score >= 10) {
            reportResults(widgets, totalTime, attempts);
        } else {
            setupGrid(widgets, cellSize);
            target.x = getRandomInt(10) / 2 + widgets.offset.x;
            target.y = getRandomInt(10) / 2 + widgets.offset.y;
            prompt(target);
            waitingForClick = true;
            startTime = new Date();
        }
    }

    function prompt(point) {
        widgets.paragraph.textContent = 'Click on point (' + point.x + ', ' + point.y + ') using ' +
            (widgets.offset.topToBottom ? 'top-to-bottom' : 'bottom-to-top') + ' coordinates.';
    }

    function mouseUp(canvas, event) {
        if (waitingForClick) {
            waitingForClick = false;
            const point = getMousePointLocation(canvas, event, widgets, cellSize);
            const x = point.x;
            const y = point.y;
            if (x == target.x && y == target.y) {   // success
                widgets.graphics.beginPath();
                widgets.graphics.fillStyle = "#0F0";
                widgets.graphics.arc(x * cellSize, y * cellSize, (15 * cellSize / 100), 0, Math.PI * 2);
                widgets.graphics.closePath();
                widgets.graphics.fill();
                labelAxes(widgets, { x, y }, cellSize);
                score = score + 1;
                setProgress(widgets, score, cellSize);
                setTimeout(doIt, 1000);
            } else {                                // failure
                widgets.graphics.beginPath();
                widgets.graphics.fillStyle = "#F00";
                widgets.graphics.arc(x * cellSize, y * cellSize, (15 * cellSize / 100), 0, Math.PI * 2);
                widgets.graphics.closePath();
                widgets.graphics.fill();
                labelAxes(widgets, { x, y }, cellSize);
                score = Math.trunc(score / 2);
                setProgress(widgets, score, cellSize);
                waitingForClick = true;
            }
            attempts = attempts + 1;
            totalTime = new Date() - startTime + totalTime;
        }
    }
}
