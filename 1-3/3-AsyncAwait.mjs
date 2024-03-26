// async e await in js sono come e task in c#.
// restituiscono e gestiscono le promise

import { readdir,readFile } from "node:fs/promises";

async function readBooks() {
    try {
        let total = 0;
        const files = await readdir("./files");
        for (const f of files) {
            const data = await readFile("./files/" + f, { encoding: "utf-8" });
            console.log(f, data.length);
            total += data.length;
        }
        console.log(total);
    } catch (err) {
        console.error(err);
    }
}

readBooks();