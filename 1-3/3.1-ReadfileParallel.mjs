import { readdir,readFile } from "node:fs/promises";

// versione con le Promise
async function readBooksPromises() {
    try {
        let total = 0;
        const files = await readdir("./files");
        const promises = [];
        for (const f of files) {
            const p = readFile("./files/" + f, { encoding: "utf-8" });
            const p2 = p.then(x => x.length);
            promises.push(p2);
        }
        const lengths = await Promise.all(promises);
        lengths.forEach(x => total += x);
        console.log(total);
    } catch (err) {
        console.error(err);
    }
}

readBooksPromises();

async function readBook(file) {
    const content = await readFile("./files/" + file, { encoding: "utf-8" });
    return content.length;
}

async function readBooksAwaits() {
    try {
        const files = await readdir("./files");
        const promises = [];
        // for (const f of files) {
        //     promises.push(readBook(f));
        // }
        files.map(f => promises.push(readBook(f)));
        const lengths = await Promise.all(promises);
        const total = lengths.reduce((acc, x) => acc + x, 0);
        console.log(total);
    } catch (err) {
        console.error(err);
    }
}

readBooksAwaits();