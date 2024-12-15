import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "TimeCapsule",
  password: "$$ferrari$$",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("main.css"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const checkexist = await db.query("SELECT * FROM users WHERE email = ($1);",[username]);
    if(checkexist.rows.length > 0){
      res.send("Username already exists. Try logging in.");
    } else {
      const no = await db.query("INSERT INTO users (password, email) VALUES ($1, $2);",[password, username]);
      res.render("secrets.ejs");
    }
  } catch(err) {
    console.log(err);
  }
});
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try{
    const checkexist = await db.query("SELECT * FROM users WHERE email = ($1);",[username]);
      if(checkexist.rows.length > 0){
        const pass = checkexist.rows[0];  
        if(pass.password == password){
          res.render("index.ejs");
        } else {
          res.send("Incorrect Password.")
        }
      } else {
        res.send("Wrong password try again.");
      }
  } catch(err) {
    console.log(err);
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
