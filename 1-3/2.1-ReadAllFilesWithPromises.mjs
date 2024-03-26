import * as fs from "node:fs";
import { readdir, readFile } from "node:fs/promises";

// posso creare la funzione oppure usare direttamente la promise fornita da fs
// function readdirPromise(path) {
//     return new Promise((resolve, reject) => {
//         fs.readdir(path, (err, files) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(files);
//             }
//         });
//     });
// }

// readdirPromise("./files")
//     .then((files) => {
//         for (const f of files) {
//             fs.readFile("./files/" + f, { encoding: "utf-8" }, (err, data) => {
//                 if (err) {
//                     console.error(err);
//                 } else {
//                     console.log(data);
//                 }
//             });
//         }
//     })
//     .catch((err) => {
//         console.error(err);
//     });

readdir("./files")
    .then((files) => {
        for (const f of files) {
            const p3 = readFile("./files/" + f, { encoding: "utf-8" });
            const p4 = p3.then((data) => data.length);
            p4.then((length) => console.log(f, length));
        }
    })
    .catch((err) => {
        console.error(err);
    });