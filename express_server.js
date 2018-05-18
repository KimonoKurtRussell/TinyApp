var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var cookieParser = require("cookie-parser")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
"b2xVn2": "http://www.lighthouselabs.ca",
"9sm5xk": "http://www.google.ca"
};

const users  = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.get("/urls", (req, res) => {
  let templateVars = {
    loginAccount: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    loginAccount: req.cookies["username"],
    urls: urlDatabase
  }
  res.render("urls_new", templateVars)
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    loginAccount: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
 let long = req.body.longURL
 let shortURL = generateRandomString();
  urlDatabase[shortURL] = long
  res.redirect("/urls" + shortURL);
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  let generatedId = generateRandomString();
   res.cookie(req.body.naming, generatedId);
  users[generatedId] =({id: generatedId, username: req.body.naming, password: req.body.password});
  console.log(users)
  for (i in users)
    if (users[i].email == req.body.naming) {
    return
    res.status(400);
    res.send("Please try again.")
  } else {
    res.redirect("/urls");
  }
})

app.post("/urls/:id", (req, res) => {
  let id = req.params.id;
  let url = urlDatabase[id];
  if (url) {
    urlDatabase[id] = req.body.url
   res.redirect(`/urls/${id}`)
  } else {
    res.redirect("/urls/:id");
  }
})

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  let id = req.params.id;
  let url = urlDatabase[id];
  if (url) {
    delete urlDatabase[id];
  }
  res.redirect("/urls")
})

app.get("/login", (req, res) =>{
  res.render("login")
})

app.post("/login", (req, res) => {
  for (i in users) {
    if (req.body.email === users[i].username && req.body.password === users[i].password) {
      res.cookie('username', req.body.email)
      // res.cookie('password', req.body.password)
      res.redirect("/urls");
    }
  }
  res.status(403)
  res.send("Email and/or Password are not correct.")
});

app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.clearCookie('password')
  res.clearCookie('user[i].username')
  res.redirect('/urls');
 });

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
})

function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i <=6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}



