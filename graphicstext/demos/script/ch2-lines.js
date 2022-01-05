function onload() {
    const widgets = getWidgets();
    let cellSize = 40;
    const form = document.getElementById("form");
    let score = Math.trunc(score / 2);
    let attempts = 0;
    let startTime;
    let totalTime = 0;
    const target = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    let guess = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    let isDrawing = false;
    let allowAttempt = true;

    canvas.addEventListener('mousedown', function (e) {
        mouseDown(canvas, e);
    });
    canvas.addEventListener('mousemove', function (e) {
        mouseMove(canvas, e);
    });
    canvas.addEventListener('mouseup', function (e) {
        mouseUp(canvas, e);
    });
    form.addEventListener('submit', submit);
    form.addEventListener('reset', next);

    doIt();

    function submit(e) {
        e.preventDefault();
        drawGrid(widgets, cellSize);
        if (equalLines(guess, target)) {
            drawLine(widgets, guess, "#0F0", cellSize);
            score = score + 1;
        } else {
            drawLine(widgets, guess, "#F00", cellSize);
            drawLine(widgets, target, "#AAA", cellSize);
            score = Math.trunc(score / 2);
        }
        setProgress(widgets, score, cellSize);
        document.getElementById("submit").disabled = true;
        document.getElementById("next").disabled = false;
        attempts = attempts + 1;
        totalTime = new Date() - startTime + totalTime;
        allowAttempt = false;
        return false;
    }

    function next(e) {
        e.preventDefault();
        doIt();
        return false;
    }

    function doIt() {
        document.getElementById("submit").disabled = true;
        document.getElementById("next").disabled = true;
        setProgress(widgets, score, cellSize);
        if (score >= 10) {
            reportResults(widgets, totalTime, attempts);
        } else {
            setupGrid(widgets, cellSize);
            do {
                target.start.x = getRandomInt(5) + widgets.offset.x;
                target.start.y = getRandomInt(5) + widgets.offset.y;
                switch (getRandomInt(4)) {
                    case 0: // N
                        target.end.x = target.start.x;
                        target.end.y = target.start.y - 2;
                        break;
                    case 1: // E
                        target.end.x = target.start.x + 2;
                        target.end.y = target.start.y;
                        break;
                    case 2: // S
                        target.end.x = target.start.x;
                        target.end.y = target.start.y + 2;
                        break;
                    case 3: // W
                        target.end.x = target.start.x - 2;
                        target.end.y = target.start.y;
                        break;
                }
                target.end.x = Math.max(target.end.x, widgets.offset.x);
                target.end.x = Math.min(target.end.x, widgets.offset.x + 5);
                target.end.y = Math.max(target.end.y, widgets.offset.y);
                target.end.y = Math.min(target.end.y, widgets.offset.y + 5);
            } while (equalPoints(target.start, target.end));
            prompt(target);
            startTime = new Date();
            allowAttempt = true;
        }
    }

    function prompt(target) {
        widgets.paragraph.textContent = 'Draw a line from ('
            + target.start.x + ', ' + target.start.y + ') to (' + target.end.x + ', ' + target.end.y + ') using ' +
            (widgets.offset.topToBottom ? 'top-to-bottom' : 'bottom-to-top') + ' coordinates. ' +
            '';
    }

    function mouseDown(canvas, event) {
        if (allowAttempt) {
            guess.start = getMousePointLocation(canvas, event, widgets, cellSize);
            isDrawing = true;
        }
    }

    function mouseMove(canvas, event) {
        if (allowAttempt && isDrawing) {
            guess.end = getMousePointLocation(canvas, event, widgets, cellSize);
            drawGrid(widgets, cellSize);
            drawLine(widgets, guess, "#00F", cellSize);
        }
    }

    function mouseUp(canvas, event) {
        if (allowAttempt && isDrawing) {
            guess.end = getMousePointLocation(canvas, event, widgets, cellSize);
            isDrawing = false;
            document.getElementById("submit").disabled = false;
        }
    }
}
