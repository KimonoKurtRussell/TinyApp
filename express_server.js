 var express = require("express");
 var app = express();
 var PORT = process.env.PORT || 8080;
 var express = require("express");
 var bcrypt = require("bcrypt");
 var cookieSession = require("cookie-session");
 app.use(cookieSession({
  name: "session",
  keys: ["encrypted"]
 }))

 const bodyParser = require("body-parser");
 app.use(bodyParser.urlencoded({ extended: true }));

 app.set("view engine", "ejs");

 //Database for users and user specific urls

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

// Displaying main page with option to redirect to login+register if not logged in
// all other pages have caveat to redirect to login if not logged in

app.get("/urls", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect("/login");
      return;
  }
  let accountUrls = intoObject(req.session.user_id);
  let templateVars = {
    users: users[req.session.user_id],
    urls: accountUrls
  };
   if (Object.keys(accountUrls).length > 0) {
    res.render("urls_index", templateVars);
   } else {
    res.redirect("/urls/new");
   }
});

//displaying a page to create a new tiny url

app.get("/urls/new", (req, res) => {
  let templateVars = {
    users: users[req.session.user_id]
  };
  for (let id in users) {
    if (users[id].id === req.session.user_id) {
    res.render("urls_new", templateVars);
      return;
    }
  }
    res.redirect("/login");
});

//displays page with users urls

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    users: users[req.session.user_id],
    shortURL: req.params.id,
    urls: urlDatabase
  };
    res.render("urls_show", templateVars);
});


// ablity to post a new url to specific user

app.post("/urls", (req, res) => {
  var longURL = req.body.longURL;
  if (!req.body.longURL) {
    res.status(404).send("please enter a Url");
  } else {
    var shortURL = generateRandomString();
    urlDatabase[shortURL] = {
    url: longURL,
    userID: req.session.user_id
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

// displaying a specific url+tiny url to a specific user

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let urls = urlDatabase[shortURL].url;
    if (urls) {
    res.render("urls_show",
    { shortURL: shortURL,
      urls: urls,
      users: users[req.session.user_id]
    });
    } else {
      res.sendStatus(404);
    }
});

// abilty to edit a url to generate a new tiny url for a specific user

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

//ability to delete one url from users database

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  let urls = urlDatabase[shortURL].url;
    if (urls) {
    delete urlDatabase[shortURL];
    }
     res.redirect("/urls");
});

 //displays login page

 app.get("/login", (req, res) => {
   res.render("login");
 });

//ability to login from login page

app.post("/login", (req, res) => {
  var loggedEmail = req.body.email;
  var loggedPass = req.body.password;
    if (!loggedEmail || !loggedPass) {
    res.status(403).send("Please enter a valid email or password");
      return;
   }
    for (let id in users) {
     if (users[id].email === loggedEmail) {
     if (bcrypt.compareSync(loggedPass, users[id].password)) {
     req.session.user_id = id;
     res.cookie("user_id", id);
     res.redirect("/urls");
      return;
     }
     }
    }
    res.status(403).send("Email and/or Password are not registered");
});

 //displays login page

 app.get("/register", (req, res) => {
   res.render("register");
 });


//ability ro create an account on TINYAPP

app.post("/register", (req, res) => {
   var randomId = generateRandomString();
   var userEmail = req.body.email;
   var userPassword = req.body.password;
   const cryptPassword = bcrypt.hashSync(userPassword, 10);
     for (let id in users) {
       if (users[id].email === userEmail) {
       res.status(400).send("Email is taken please try another.");
     return;
       }
         if (!userEmail || !userPassword) {
         res.status(400).send("Please enter a valid email and password");
     return;
         }
       users[randomId] = {
       id: randomId,
       email: req.body.email,
       password: cryptPassword
       };
       req.session.user_id = randomId;
     }
     res.redirect("/urls");
});

//ability to logout of tinyapp with redirection to login page

app.post("/logout", (req, res) => {
   req.session = null
   res.redirect("/urls");
 });

app.listen(PORT, () => {
   console.log(`Example app listening on port ${PORT}!`);
 });


//functions to create random string for a url and to push data into database


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


