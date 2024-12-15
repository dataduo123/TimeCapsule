import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/signin", (req, res) => {
    res.render("partials/signin.ejs");
})
app.post("/submit", (req, res) => {
    res.render("partials/createblog.ejs");
})
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})