import { createServer } from "node:http";

// creazione di un server http

const user = {
    firstname: "Mario",
    lastname: "Rossi",
    age: 25,
    favouriteColor: "blue"
}

function listener(req, res) {
    const method = req.method;
    const url = req.url;
    console.log(url, method);

    switch (req.url) {
        case "/users":
            manageUsers(req, res);
            break;
        case "/posts":
            managePosts(req, res);
            break;
        default:
            res.write("Not found");
            res.statusCode = 404;
            break;
    }
    res.end();
    console.log("Request ended");
}

function manageUsers(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(user));
}

function managePosts(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ posts: ["mario", "carlo", "giuseppe"] }));
}

const server = createServer(listener);
server.listen(3000, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
}); // il server è in ascolto sulla porta 3000

