import { readFile, readdir } from "node:fs";

let total = 0;
readdir("./files", (err, files) => {
    if (err) {
        console.error(err);
    }
    console.log(files);
    for (const f of files) {
        readFile("./files/"+f, { encoding: "utf-8" }, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data.length);
            }
            total += data.length;
        });
    }
    console.log(total);
});

readdir("./files", (err, files) => {
    if (err) {
        console.error(err);
    }
    return files;
})
.then((files) => {
    for (const f of files) {
        readFile("./files/"+f, { encoding: "utf-8" }, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data.length);
            }
            total += data.length;
        });
    }
});

