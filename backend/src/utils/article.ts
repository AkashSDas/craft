export function calculateReadTime(text: string) {
    // Average reading speed (words per minute)
    const wordsPerMinute = 200;

    // Calculate words per millisecond
    const wordsPerMillisecond = wordsPerMinute / 60000;

    // Count the number of words in the text
    const wordCount = text
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

    // Calculate read time in milliseconds
    const readTimeMilliseconds = Math.round(wordCount / wordsPerMillisecond);

    return readTimeMilliseconds;
}
