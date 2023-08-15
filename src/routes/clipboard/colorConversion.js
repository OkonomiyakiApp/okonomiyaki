export function hsvToRgb(h, s, v) {
    let r, g, b;
    let i;
    let f, p, q, t;

    if (s === 0) {
        r = g = b = v;
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }

    h /= 60;
    i = Math.floor(h);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default:
            r = v;
            g = p;
            b = q;
            break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
