function onload() {
    const widgets = getWidgets();
    let score = 0;
    let waitingForClick = true;
    const target = { x: 0, y: 0 };
    let attempts = 0;
    let startTime;
    let totalTime = 0;

    canvas.addEventListener('mouseup', function(e) {
        mouseUp(canvas, e);
    });
    doIt();

    function doIt() {
        setProgress(widgets, score);
        if (score >= 10) {
            reportResults(widgets, totalTime, attempts);            
        } else {
            setupGrid(widgets);
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
            const point = getMouseLocation(canvas, event, widgets);
            const x = Math.floor((point.x + 25) / 50) / 2;
            const y = Math.floor((point.y + 25) / 50) / 2;
            if (x == target.x && y == target.y) {   // success
                widgets.graphics.beginPath();
                widgets.graphics.fillStyle = "#0F0";
                widgets.graphics.arc(x * 100, y * 100, 15, 0, Math.PI * 2);
                widgets.graphics.closePath();
                widgets.graphics.fill();
                labelAxes(widgets, {x, y});
                score = score + 1;
                setProgress(widgets, score);
                setTimeout(doIt, 500);
            } else {                                // failure
                widgets.graphics.beginPath();
                widgets.graphics.fillStyle = "#F00";
                widgets.graphics.arc(x * 100, y * 100, 15, 0, Math.PI * 2);
                widgets.graphics.closePath();
                widgets.graphics.fill();
                labelAxes(widgets, {x, y});
                score = 0;
                setProgress(widgets, score);
                waitingForClick = true;
            }
            attempts = attempts + 1;
            totalTime = new Date() - startTime + totalTime;
        }
    }
}
