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
      res.render("index.ejs", { name: name});
    }
  } catch(err) {
    console.log(err);
  }
});
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  try{
    const checkexist = await db.query("SELECT * FROM users WHERE email = ($1);",[username]);
      if(checkexist.rows.length > 0){
        const pass = checkexist.rows[0];  
        if(pass.password == password){
          res.render("index.ejs", { name: pass.username});
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

app.post("/create", async (req,res)=>{
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.composername;
    const Remail = req.body.receiveremail;
    const date = req.body.senddate;

    try {
        const no = await db.query("INSERT INTO content (title, message, username, receiver_email, date) VALUES ($1, $2, $3, $4, $5);",[title, content, author, Remail, date]);
        res.render("index.ejs", {name: author});
    } catch(err) {
        console.log(err);
    }
});

/*app.patch("/posts/:id", (req, res) => {
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: "Post not found" });
  
    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;
    if (req.body.author) post.author = req.body.author;
  
    res.json(post);
});*/

app.get("/capsules", async (req, res) => {
    try {
      const dbresponse = await db.query("SELECT title, message, username, receiver_email, date FROM content;");
      let response = dbresponse.rows;
      console.log(response);
      console.log("-----------------------------")
      const check = json(response);
      console.log("-----------------------------")
      console.log(check);
      res.render("collection.ejs", { posts: response.data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
