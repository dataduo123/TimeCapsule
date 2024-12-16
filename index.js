import express, { json } from "express";
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
    const id = checkexist.rows[0].id;
    if(checkexist.rows.length > 0){
      res.send("Username already exists. Try logging in.");
    } else {
      const no = await db.query("INSERT INTO users (password, email, username) VALUES ($1, $2, $3);",[password, username, name]);
      res.render("index.ejs", { name: name, id: id});
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
    const id = checkexist.rows[0].id;
    console.log(id);
      if(checkexist.rows.length > 0){
        const pass = checkexist.rows[0];  
        if(pass.password == password){
          res.render("index.ejs", { name: pass.username, id: id});
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
        const no = await db.query("INSERT INTO content (title, message, username, receiver_email, date) VALUES ($1, $2, $3, $4, $5) RETURNING *;",[title, content, author, Remail, date]);
        const uname = author;
        console.log(uname);
        const checkexist = await db.query("SELECT * FROM users WHERE username = ($1);",[uname]);
        const id = checkexist.rows[0].id;
        console.log(id);
        res.render("index.ejs", {name: author, id: id});
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


app.get("/capsules/:id", async (req, res) => {
    try {
      const postId = req.params.id;
      console.log(postId);
      const checkexist = await db.query("SELECT username FROM users WHERE id = ($1);",[postId]);
      const Username = checkexist.rows[0].username;
      console.log(Username);
      const dbresponse = await db.query("SELECT id, title, message, username, receiver_email, date FROM content WHERE username = ($1);",[Username]);
      const response = dbresponse.rows;
      console.log(response);
      res.render("collection.ejs", { posts: response, ID: postId });
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
});


app.post('/delete/:id/:ID', async (req, res) => {
  const postId = req.params.id;
  const ID = req.params.ID;
  await db.query('DELETE FROM content WHERE id = ($1);', [postId]);
  res.redirect(`/capsules/${ID}`);  // Redirect back to the homepage after deletion
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
