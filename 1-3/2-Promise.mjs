const p1 = new Promise((resolve, reject) => {
    //resolve(42); // Success state
    reject(new Error("nyooom")); // rejcet state
})
.then((value) => {
    console.log("success", value);
})
.catch((err) => {
    console.log("reject", err.message);
});

const p2 = new Promise((resolve, reject) => {  
    setTimeout(() => {
        resolve("ciao");
    }, 4000);
});

p2.then((value) => {
    console.log("success", value);
});