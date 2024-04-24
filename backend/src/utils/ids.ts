function generateRandomString(length: number): string {
    return Math.random()
        .toString(36)
        .substring(2, length + 2);
}

export function createId<T extends string>(prefix: T): `${T}_${string}` {
    const id = generateRandomString(10);
    return `${prefix}_${id}`;
}
