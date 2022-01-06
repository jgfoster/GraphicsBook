function onload() {
    const widgets = getWidgets();
    let cellSize = 40;
    const form = document.getElementById("form");
    let score = 0;
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
        if (!equalLines(guess, target)) {
            drawLine(widgets, target, "gray", cellSize);
            score = Math.trunc(score / 2);
            setProgress(widgets, score, cellSize);
            return false;
        }
        target.flag = true;
        drawWuLine(target, plot, cellSize);
        widgets.color = "black";
        if (target.flag) {
            widgets.color = "green";
            score++;
        } else {
            widgets.color = "red";
            score = Math.trunc(score / 2);
        }
        drawGrid(widgets, cellSize);
        drawLine(widgets, target, widgets.color, cellSize);
        setProgress(widgets, score, cellSize);
        document.getElementById("submit").disabled = true;
        document.getElementById("next").disabled = false;
        attempts = attempts + 1;
        totalTime = new Date() - startTime + totalTime;
        allowAttempt = false;
        return false;
    }

    function plot(x, y, c) {
        // plot the pixel at (x, y) with brightness c (where 0 ≤ c ≤ 1)
        if (widgets.pixels[y + 4][x + 4] != (c * 100)) {
            widgets.pixels[y + 4][x + 4] = c * 100;
            target.flag = false;
        }
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
        widgets.color = "black";
        if (score >= 10) {
            reportResults(widgets, totalTime, attempts, cellSize);
        } else {
            setupGrid(widgets, cellSize);
            do {
                target.start.x = getRandomInt(8) / 2 + widgets.offset.x + 1;
                target.start.y = getRandomInt(8) / 2 + widgets.offset.y + 1;
                switch (getRandomInt(4)) {
                    case 0: // N
                        target.end.x = target.start.x;
                        target.end.y = target.start.y - 2.5;
                        break;
                    case 1: // E
                        target.end.x = target.start.x + 2.5;
                        target.end.y = target.start.y;
                        break;
                    case 2: // S
                        target.end.x = target.start.x;
                        target.end.y = target.start.y + 2.5;
                        break;
                    case 3: // W
                        target.end.x = target.start.x - 2.5;
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
        widgets.paragraph.textContent = 'Shade a line from ('
            + target.start.x + ', ' + target.start.y + ') to (' + target.end.x + ', ' + target.end.y + ') using ' +
            (widgets.offset.topToBottom ? 'top-to-bottom' : 'bottom-to-top') + ' coordinates. ' +
            '';
    }

    function mouseDown(canvas, event) {
        if (!event.shiftKey) {
            document.getElementById("submit").disabled = true;
            document.getElementById("next").disabled = true;
            guess.start = getMousePointLocation(canvas, event, widgets, cellSize);
            isDrawing = true;
        }
    }

    function mouseMove(canvas, event) {
        if (!event.shiftKey && isDrawing) {
            guess.end = getMousePointLocation(canvas, event, widgets, cellSize);
            drawGrid(widgets, cellSize);
            drawLine(widgets, guess, "#00F", cellSize);
        }
    }

    function mouseUp(canvas, event) {
        if (!event.shiftKey) {
            guess.end = getMousePointLocation(canvas, event, widgets, cellSize);
            isDrawing = false;
        } else {
            const point = getMousePixelLocation(canvas, event, widgets, cellSize);
            const x = point.x;
            const y = point.y;
            let fill = widgets.pixels[y + 4][x + 4];
            fill = (fill + 25) % 125;   // percent coverage
            widgets.pixels[y + 4][x + 4] = fill;
            drawGrid(widgets, cellSize);
        }
        if (equalLines(guess, target)) {
            drawLine(widgets, guess, "#0F0", cellSize);
            document.getElementById("submit").disabled = false;
        } else {
            drawLine(widgets, guess, "#F00", cellSize);
            document.getElementById("next").disabled = false;
        }
    }
}
