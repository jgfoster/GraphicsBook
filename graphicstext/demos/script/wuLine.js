/*
 * https://en.wikipedia.org/wiki/Xiaolin_Wu%27s_line_algorithm
 * https://web.archive.org/web/20160408133525/http://freespace.virgin.net/hugo.elias/graphics/x_wuline.htm
 * http://rosettacode.org/wiki/Xiaolin_Wu%27s_line_algorithm#C.2B.2B
 */

function drawWuLine(line, plot) {

    function ipart(x) {         // integer part of x
        return Math.floor(x);
    }
    function round(x) {
        return ipart(x + 0.5);
    }
    function fpart(x) {         // fractional part of x
        return x - Math.floor(x);
    }
    function rfpart(x) {
        return 1 - fpart(x);
    }

 /*   
  * In the conventional Wu Line Algorithm, an integer represents the 
  * CENTER of a pixel. Since we follow the convention that lines are 
  * BETWEEN pixels, we need to make adjustments.
  */  
    let x0 = line.start.x - 0.5;
    let y0 = line.start.y - 0.5;
    let x1 = line.end.x - 0.5;
    let y1 = line.end.y - 0.5;
    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (steep) {
        x0 = [y0, y0 = x0][0];  // https://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript/16201730
        x1 = [y1, y1 = x1][0];
    } 
    if (x0 > x1) {
        x0 = [x1, x1 = x0][0];
        y0 = [y1, y1 = y0][0];
    }
    const dx = x1 - x0;
    const dy = y1 - y0;
    const gradient = (dx == 0) ? 1.0 : (dy / dx);

    // handle first endpoint
    let xpxl1, intery;
    {
        const xend = round(x0);
        const yend = y0 + gradient * (xend - x0);
        const xgap = rfpart(x0 + 0.5);
        xpxl1 = xend; // this will be used in the main loop
        const ypxl1 = ipart(yend);
        if (steep) {
            plot(ypxl1,   xpxl1, rfpart(yend) * xgap);
            plot(ypxl1+1, xpxl1,  fpart(yend) * xgap);
        } else {
            plot(xpxl1, ypxl1  , rfpart(yend) * xgap);
            plot(xpxl1, ypxl1+1,  fpart(yend) * xgap);
        }
        intery = yend + gradient; // first y-intersection for the main loop    
    }
    // handle second endpoint
    let xpxl2;
    {
        const xend = round(x1);
        const yend = y1 + gradient * (xend - x1);
        const xgap = fpart(x1 + 0.5);
        xpxl2 = xend; //this will be used in the main loop
        const ypxl2 = ipart(yend);
        if (steep) {
            plot(ypxl2  , xpxl2, rfpart(yend) * xgap);
            plot(ypxl2+1, xpxl2,  fpart(yend) * xgap);
        } else {
            plot(xpxl2, ypxl2,  rfpart(yend) * xgap);
            plot(xpxl2, ypxl2+1, fpart(yend) * xgap);
        }
    }
    // main loop
    if (steep) {
        for (let x = xpxl1 + 1; x <= xpxl2 - 1; x++) {
            plot(ipart(intery)  , x, rfpart(intery));
            plot(ipart(intery)+1, x,  fpart(intery));
            intery = intery + gradient;
        }
    } else {
        for (let x = xpxl1 + 1; x <= xpxl2 - 1; x++) {
            plot(x, ipart(intery),  rfpart(intery));
            plot(x, ipart(intery)+1, fpart(intery));
            intery = intery + gradient;
        }
    }
}
