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
app.use(express.static("public"));

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
  const name = req.body.name;
  try {
    const checkexist = await db.query("SELECT * FROM users WHERE email = ($1);",[username]);
    if(checkexist.rows.length > 0){
      res.send("Username already exists. Try logging in.");
    } else {
      const no = await db.query("INSERT INTO users (password, email, username) VALUES ($1, $2, $3);",[password, username, name]);
      res.render("index.ejs");
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
        res.send("Account does not exist"); 
      }
  } catch(err) {
    console.log(err);
  }
});
app.get("/card", (req, res) => {
    res.render("card.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/posts/:id", (req, res) => {
    console.log("hiiiiii");
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
});
app.post("/create",(req,res)=>{
    const newpost = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      Remail: req.body.usermail,
      date: req.body.date,
      time: req.body.date,
    }
    lastId = newid;
    posts.push(newpost);
    res.status(201);
    res.json(newpost);
});

app.patch("/posts/:id", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post not found" });
  
    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;
    if (req.body.author) post.author = req.body.author;
  
    res.json(post);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
