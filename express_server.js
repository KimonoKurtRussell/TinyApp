var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var cookieParser = require("cookie-parser")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

var urlDatabase = {
"b2xVn2": "http://www.lighthouselabs.ca",
"9sm5xk": "http://www.google.ca"
};

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
  res.redirect("/urls/" + shortURL)
});

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

app.post("/login", (req, res) => {
  let loginAccount = req.body.username;
  res.cookie("username", loginAccount);
  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  res.clearCookie('username')
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



