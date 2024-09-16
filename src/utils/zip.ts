export function* zip<T>(...arrays: Array<Array<T>>) {
    for (let i = 0; i < arrays[0].length; i++) {
        yield arrays.map((el) => el[i]);
    }
}
