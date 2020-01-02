function onload() {
    const widgets = getWidgets();
    let score = 0;
    let attempts = 0;
    let startTime;
    let totalTime = 0;
    let waitingForClick = true;
    const target = { x: 0, y: 0 };
    canvas.addEventListener('mouseup', function(e) {
        mouseUp(canvas, e);
    });

    doIt();

    function doIt() {
        setProgress(widgets, score);
        if (score >= 10) {
            reportResults(widgets, totalTime, attempts);            
        } else {
            setupGrid(widgets, 50, false);
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
            const point = getMouseLocation(canvas, event, widgets);
            const x = Math.floor(point.x / 100);
            const y = Math.floor(point.y / 100);
            if (x == target.x && y == target.y) {
                widgets.graphics.fillStyle = "#0F0";
                widgets.graphics.fillRect(x * 100 + 1, y * 100 + 1, 99, 99);
                score = score + 1;
                setProgress(widgets, score);
                setTimeout(doIt, 500);
            } else {
                widgets.graphics.fillStyle = "red";
                widgets.graphics.fillRect(x * 100 + 1, y * 100 + 1, 99, 99);
                const matrix = widgets.graphics.getTransform();
                widgets.graphics.translate(x * 100 + 10, y * 100 + 15);
                widgets.graphics.transform(1, 0, 0, matrix.d, 0, 0);
                widgets.graphics.font = '14px sans-serif';
                widgets.graphics.strokeText('(' + x + ', ' + y + ')', 0, 0);
                widgets.graphics.setTransform(matrix);
                score = 0;
                setProgress(widgets, score);
                waitingForClick = true;
            }
            attempts = attempts + 1;
            totalTime = new Date() - startTime + totalTime;
        }
    }
}
