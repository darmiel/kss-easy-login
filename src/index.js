const express = require("express");

const morgan = require("morgan");
const helmet = require("helmet");

const pm2 = require("@pm2/io");
const uses = pm2.metric({
    name: "Uses"
});

console.log(__dirname);

const app = express();
app.set('trust proxy', true); // behind proxy

app.use(morgan("common"));
app.use(helmet());

app.use((req, res, next) => {
    uses.set(uses.val() + 1);
    next();
});

// Schüler
app.use(express.static(__dirname + "/../public/html"));

// Lehrer
app.use("/lehrer", express.static(__dirname + "/../public/html"));

// Assets
app.use("/assets", express.static(__dirname + "/../public/assets"))

app.listen(1339, '127.0.0.1', (e) => console.log("Done!"));