
export interface Tag {
    x: number;
    width: number;
}

function x2of(t:Tag) { return t.x + t.width; }

/**
 * Moves tags as necessary to ensure they don't overlap. The tags must
 * be sorted by x coordinate before this function is called.
 * @param tags List of possibly overlapping tags to be separated
 * @param min Minimum x coordinate of all tags
 * @param max Maximum value of x+width for all tags (max > min)
 */
export function separateTags(tags: Tag[], min: number, max: number) {
    let runs: Tag[] = [];
    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];
        if (tag.x < min)
            tag.x = min;
        runs.push(tag);
        let left: Tag, last: Tag;
        while (runs.length >= 2 && x2of(left = runs[runs.length-2]) >
                                       (last = runs[runs.length-1]).x) {
            runs.pop();
            runs[runs.length-1] = combine(left, last);
        }
    }
    
    function combine(left: Tag, right: Tag): Tag
    {
        let width = left.width + right.width;
        let overlap = x2of(left) - right.x;
        let x = Math.max(left.x - overlap/2, min);
        let combined = { x, width };
        Object.defineProperty(left, 'x', { get: () => combined.x });
        Object.defineProperty(right, 'x', { get: () => combined.x + left.width });
        return combined;
    }
}
