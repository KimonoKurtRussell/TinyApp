var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
"b2xVn2": "http://www.lighthouselabs.ca",
"9sm5xk": "http://www.google.ca"
};

app.get("/", (req, res) => {
  res.end("Hello, you handsome devil");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.get("/hello", (req, res) => {
  res.end("<html><body> Hello <b> Again </b></body></html>\n")
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new")
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase };
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


app.post("/urls/:id/delete", (req, res) => {
  let id = req.params.id;
  let url = urlDatabase[id];
  if (url) {
    delete urlDatabase[id];
  }
  res.redirect("/urls")
})

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
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



