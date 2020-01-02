function onload() {
    const widgets = getWidgets();
    const form = document.getElementById("form");
    let score = 0;
    let attempts = 0;
    let startTime;
    let totalTime = 0;
    const target = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    let guess = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    let isDrawing = false;
    let allowAttempt = true;

    canvas.addEventListener('mousedown', function(e) {
        mouseDown(canvas, e);
    });
    canvas.addEventListener('mousemove', function(e) {
        mouseMove(canvas, e);
    });
    canvas.addEventListener('mouseup', function(e) {
        mouseUp(canvas, e);
    });
    form.addEventListener('submit', submit);
    form.addEventListener('reset', next);

    doIt();

    function submit(e) {
        e.preventDefault();
        if (!equalLines(guess, target)) {
            console.log(target, guess);
            drawLine(widgets, target, "gray");
            score = 0;
            setProgress(widgets, score);
            return false;
        }
        target.flag = true;
        drawWuLine(target, plot);
        widgets.color = "black";
        if (target.flag) {
            widgets.color = "green";
            score++;
        } else {
            widgets.color = "red";
            score = 0;
        }
        drawGrid(widgets);
        drawLine(widgets, target, widgets.color);
        setProgress(widgets, score);
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
        setProgress(widgets, score);
        widgets.color = "black";
        if (score >= 10) {
            reportResults(widgets, totalTime, attempts);            
        } else {
            setupGrid(widgets);
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
            const point = getMouseLocation(canvas, event, widgets);
            guess.start.x = Math.floor((point.x + 25) / 50) / 2;
            guess.start.y = Math.floor((point.y + 25) / 50) / 2;
            isDrawing = true;
        }
    }

    function mouseMove(canvas, event) {
        if (!event.shiftKey && isDrawing) {
            const point = getMouseLocation(canvas, event, widgets);
            guess.end.x = Math.floor((point.x + 25) / 50) / 2;
            guess.end.y = Math.floor((point.y + 25) / 50) / 2;
            drawGrid(widgets);
            drawLine(widgets, guess, "blue");
        }
    }

    function mouseUp(canvas, event) {
        const point = getMouseLocation(canvas, event, widgets);
        if (!event.shiftKey) {
            guess.end.x = Math.floor((point.x + 25) / 50) / 2;
            guess.end.y = Math.floor((point.y + 25) / 50) / 2;
            isDrawing = false;
        } else {
            const x = Math.floor(point.x / 100);
            const y = Math.floor(point.y / 100);
            let fill = widgets.pixels[y + 4][x + 4];
            fill = (fill + 25) % 125;   // percent coverage
            widgets.pixels[y + 4][x + 4] = fill;
            drawGrid(widgets);
        }
        if (equalLines(guess, target)) {
            drawLine(widgets, guess, "green");
            document.getElementById("submit").disabled = false;
        } else {
            drawLine(widgets, guess, "red");
            document.getElementById("next").disabled = false;
        }
    }
}
