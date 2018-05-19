 var express = require("express");
 var app = express();
 var PORT = process.env.PORT || 8080;
 var express = require("express");
 var cookieParser = require("cookie-parser");
 app.use(cookieParser());

 const bodyParser = require("body-parser");
 app.use(bodyParser.urlencoded({ extended: true }));

 app.set("view engine", "ejs");

 var urlDatabase = {
   b2xVn2: {
     url: "http://www.lighthouselabs.ca",
     userID: "userRandomID"
   },
   "9sm5xK": {
     url: "http://www.google.com",
     userID: "userRandomID"
   }
 };

 var users = {
   userRandomID: {
     id: "userRandomID",
     email: "user@example.com",
     password: "purple-monkey-dinosaur"
   },
   user2RandomID: {
     id: "user2RandomID",
     email: "user2@example.com",
     password: "dishwasher-funk"
   }
 };

app.get("/urls.json", (req, res) => {
   res.json(urlDatabase);
 });

app.get("/urls", (req, res) => {
  if (!users[req.cookies.user_id]) {
    res.redirect("/login");
      return;
  }
  let accountUrls = intoObject(req.cookies.user_id);
  let templateVars = {
    users: users[req.cookies["user_id"]],
    urls: accountUrls
  };
   if (Object.keys(accountUrls).length > 0) {
    res.render("urls_index", templateVars);
   } else {
    res.redirect("/urls/new");
   }
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    users: users[req.cookies["user_id"]]
  };
  for (let id in users) {
    if (users[id].id === req.cookies["user_id"]) {
    res.render("urls_new", templateVars);
      return;
    }
  }
    res.redirect("/login");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    users: users[req.cookies["user_id"]],
    shortURL: req.params.id,
    urls: urlDatabase
  };
    res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  var longURL = req.body.longURL;
  if (!req.body.longURL) {
    res.Status(404).send("please enter a Url");
  } else {
    var shortURL = generateRandomString();
    urlDatabase[shortURL] = {
    url: longURL,
    userID: req.cookies["user_id"]
    };
     res.redirect(`/urls/${shortURL}`);
  }
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].url;
    if (!longURL) {
    res.status(404);
    }
     res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let urls = urlDatabase[shortURL].url;
    if (urls) {
    res.render("urls_show",
    { shortURL: shortURL,
      urls: urls,
      users: users[req.cookies["user_id"]]
    });
    } else {
      res.sendStatus(404);
    }
});


app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let urls = urlDatabase[shortURL].url;
   if (urls) {
     urlDatabase[shortURL].url = req.body.longURL;
     res.redirect(`/urls/`);
   } else {
     res.redirect("/urls");
   }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  let urls = urlDatabase[shortURL].url;
    if (urls) {
    delete urlDatabase[shortURL];
    }
     res.redirect("/urls");
});

 app.get("/login", (req, res) => {
   res.render("login");
 });

app.post("/login", (req, res) => {
  const loggedEmail = req.body.email;
  const loggedPass = req.body.password;
    if (!loggedEmail || !loggedPass) {
    res.send(403).status("Please enter a valid email or password");
      return;
   }
    for (let id in users) {
     if (users[id].email === loggedEmail) {
     if (users[id].password === loggedPass) {
     res.cookie("user_id", id);
     res.redirect("/urls");
      return;
     }
     }
    }
    res.send(403).staus("Email and/or Password are not registered");
});

 app.get("/register", (req, res) => {
   res.render("register");
 });

app.post("/register", (req, res) => {
   var randomizedID = generateRandomString();
   var userEmail = req.body.email;
   var userPassword = req.body.password;
     for (let id in users) {
       if (users[id].email === userEmail) {
       res.send(400).status("Email is taken please try another.");
     return;
       }
         if (!userEmail || !userPassword) {
         res.send(400).status("Please enter a valid email and password");
     return;
         }
       users[randomId] = {
       id: randomId,
       email: req.body.email,
       password: req.body.password
       };
       res.cookie("user_id", randomId);
     }
     res.redirect("/urls");
});

app.post("/logout", (req, res) => {
   res.clearCookie("user_id");
   res.redirect("/urls");
 });

app.listen(PORT, () => {
   console.log(`Example app listening on port ${PORT}!`);
 });



function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i <=6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

function intoObject(value) {
  newUrlDatabase = {};
  for (var id in urlDatabase) {
    if (urlDatabase[id].userID === value) {
      newUrlDatabase[id] = urlDatabase[id];
    }
  }
  return newUrlDatabase;
}


