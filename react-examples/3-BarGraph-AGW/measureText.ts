var measurementElem: HTMLSpanElement;

/**
 * Measures the width and height of a plain text string.
 * @param text {string} Text to be measured
 * @param font {string|null} Optional font to use, e.g. 'bold 2em "Verdana", sans-serif'
 *             If null, font is inherited via css (div > span).
 * @param maxWidth {number} Width of containing element (for word wrapping); 
 *             the width is unlimited if this parameter is undefined.
 * @param collapseWhitespace {boolean} if this parameter is false or missing,
 *             whitespace is not collapsed (as in <pre> elements).
 * @param className {string} Class name to attach to the <span>
 * @returns {{width:number,height:number}} Text size in pixels (integers).
 * @description
 * Provides the ability to measure the width and height of a text string,
 * to compensate for the fact that canvas.getContext('2d').measureText(text)
 * cannot measure text height (in some browsers). Supports wrapped text,
 * whitespace and newlines. It works by measuring the size of a <span> 
 * element inside a hidden <div> added as a child of <body>.
 * 
 * "position: absolute" is used in the hope of avoiding whole-document 
 * reflow, and upon return the div is left as a child of document.body
 * and re-used in future calls. The child must be <span> rather than 
 * <div> to get a correct measurement of width. The code does not break 
 * if other code removes the <div> from the document. A quirk I noticed 
 * (in Chrome anyway) is that if the final character of the string is 
 * '\n', it has no effect on height, but if the final character is a 
 * space, it is counted as part of the width.
 * 
 * A quick way to estimate text height without this function is to
 * measure the width of 'LL'. In many fonts the width of 'LL' is slightly
 * larger than the font height and therefore serves as a good choice of 
 * vertical line spacing.
 */
export function measureText(text: string, font?: string, maxWidth?: number, collapseWhitespace?: boolean, className?: string) {
    var el = measurementElem, container: HTMLElement;
    if (el === undefined || el.parentElement === null || (container = el.parentElement).parentNode === null) {
        container = document.createElement('div');
        container.id = 'measureTextContainer';
        let s = container.style;
        s.position = "absolute";
        s.visibility = "hidden";
        s.width = "30000px";
        s.left = '-30000px'; // Prevent scroll bar if text is long
        s.top = '0px';
        s.borderLeft = s.borderTop = s.borderRight = s.borderBottom = '0';
        s.marginLeft = s.marginTop = s.marginRight = s.marginBottom = '0';
        s.paddingLeft = s.paddingTop = s.paddingRight = s.paddingBottom = '0';
        container.appendChild(measurementElem = el = document.createElement('span'));
        document.body.appendChild(container);
    }
    if (collapseWhitespace) {
        container.style.whiteSpace = maxWidth ? "normal" : "nowrap";
    } else {
        container.style.whiteSpace = maxWidth ? "pre-wrap" : "pre";
    }
    el.style.font = font || null;
    el.className = className || "";
    el.textContent = text;
    let result = {width:el.offsetWidth, height:el.offsetHeight};
    el.textContent = "";
    return result;
}
