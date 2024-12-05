/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the project6 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */
const multer  = require('multer');
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

//var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const fs = require("fs");
mongoose.Promise = require("bluebird");

const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();

const session = require("express-session");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
//const multer = require("multer");

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");
const { ObjectId } = require('mongodb');


// connect to mongo
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// set up sessions
app.use(session({
  secret: "secret",
  //key: "key",
  resave: true,   // save session back to store when edited
  saveUninitialized: true,  // if not fully initialized, then don't save
}));

// use body parser
app.use(bodyParser.json());

// 'is logged in' middleware
function isLoggedIn(request, response, next){
  if (request.session.user) return next();  // if user logged in, go to next middleware
  else{
    // respond with not logged in error
    console.log("Information request: no user found");
    return response.status(401).send("Unauthorized access: Not logged in.");
  } 
}


app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 * 
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", async function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  //console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    try{

      const info = await SchemaInfo.find({});
      if (info.length === 0) {
            // No SchemaInfo found - return 500 error
            return response.status(500).send("Missing SchemaInfo");
      }
      //console.log("SchemaInfo", info[0]);
      return response.json(info[0]); // Use `json()` to send JSON responses
    } catch(err){
      // Handle any errors that occurred during the query
      console.error("Error in /test/info:", err);
      return response.status(500).json(err); // Send the error as JSON
    }

  } else if (param === "counts") {
   // If the request parameter is "counts", we need to return the counts of all collections.
// To achieve this, we perform asynchronous calls to each collection using `Promise.all`.
// We store the collections in an array and use `Promise.all` to execute each `.countDocuments()` query concurrently.
   
    
const collections = [
  { name: "user", collection: User },
  { name: "photo", collection: Photo },
  { name: "schemaInfo", collection: SchemaInfo },
];

try {
  await Promise.all(
    collections.map(async (col) => {
      col.count = await col.collection.countDocuments({});
      return col;
    })
  );

  const obj = {};
  for (let i = 0; i < collections.length; i++) {
    obj[collections[i].name] = collections[i].count;
  }
  return response.end(JSON.stringify(obj));
} catch (err) {
  return response.status(500).send(JSON.stringify(err));
}} else if (param === "users") {

  try{

    const info = await User.find({});
    if (info.length === 0) {
          // No SchemaInfo found - return 500 error
          return response.status(500).send("Missing SchemaInfo");
    }
    //console.log("SchemaInfo", info[0]);
    return response.json(info); // Use `json()` to send JSON responses
  } catch(err){
    // Handle any errors that occurred during the query
    console.error("Error in /test/users:", err);
    return response.status(500).json(err); // Send the error as JSON
  }
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    return response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", isLoggedIn, async function (request, response) {
  //response.status(200).send(models.userListModel());
  try{
    const info = await User.find({},"_id first_name last_name");
    if (info.length === 0) {
          // None found - return 500 error
          return response.status(500).send("Missing UserList");
    }
    //console.log("UserList", info);
    return response.json(info); // Use `json()` to send JSON responses
  } catch(err){
    // Handle any errors that occurred during the query
    console.error("Error in /user/list", err);
    return response.status(500).json(err); // Send the error as JSON
  }
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", isLoggedIn, async function (request, response) {
  try{
    const id = request.params.id;
    if (id.length !== 24){
      console.log("Invalid User " + id);
      return response.status(400).send("Invalid User"); // Send the error as JSON
    }
    try{
      const info = await User.find({_id: id}, "_id first_name last_name location description occupation");
      //console.log(info);
      if (info.length === 0) {
            // None found - return 400 error
            return response.status(400).send("Invalid User");
      }
      //console.log("User with _id:" + id);
      return response.json(info[0]); // Use `json()` to send JSON responses
    } catch(err){
      // Handle any errors that occurred during the query
      console.error("Error in /user/"+id, err);
      return response.status(400).json(err); // Send the error as JSON
    }
  }
  catch(err){
    console.error("Bad param " + request.params, err);
    return response.status(400).json(err); // Send the error as JSON
  }
});


/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", isLoggedIn, asyncHandler(async function (request, response) {

  // validate ID
  const id = request.params.id;
  const userId = request.session.user.userID;
  console.log(typeof userId);
 // console.log(typeof id);
  if (id.length !== 24){
    console.log("Invalid User " + id);
    return response.status(400).send("Invalid User"); // Send the error as JSON
  }

  //fetch info
  Promise.all([
    Photo.find({$and: [{user_id: id}, {allowed: new mongoose.Types.ObjectId(userId) }]}, "_id user_id comments.comment comments.date_time comments._id comments.user_id file_name date_time").exec(),
    User.find({},"_id first_name last_name").exec()
  ]).then((result) => {
    const users = result[1];
    const info = result[0];
   // console.log(JSON.stringify(result[0]));
    // validate informations
    if (users.length === 0) {
          // None found - return 500 error
          return response.status(500).send("Missing UserList");
    }
    if (info.length === 0) {
          // None found - return 500 error
          console.log("No photos");
          return response.status(500).send("Missing UserPhotos");
    }

    // gigachad brute force transformation 
    let obj = [];

    // generate photos
    for(let i = 0; i < info.length; i++){
      let photo = {_id: info[i]._id,
        user_id: info[i].user_id,
        file_name: info[i].file_name,
        date_time: info[i].date_time,
        comments: []};

      // generate comments
      for (let j = 0; j < info[i].comments.length; j++){
        let userId = info[i].comments[j].user_id.toString();
        let user;
        // find user
        for (let k = 0; k < users.length; k++){
          if (userId === users[k]._id.toString()){
            user = users[k];
            break;
          }
        }

        let comment = {
          comment: info[i].comments[j].comment,
          date_time: info[i].comments[j].date_time,
          _id: info[i].comments[j]._id,
          user: {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        };

        // add comment
        photo.comments.push(comment);
      }
      // add photo
      obj.push(photo);
    }

    //console.log("/photosOfUser/"+id, obj);
    return response.json(obj); // Use `json()` to send JSON responses
  });
  return "Unknown Error";}));

/**
 * URL /user-exp/list - Returns the Expanded Information for User List.
 */
app.get("/user-exp/list", isLoggedIn, asyncHandler(async function (request, response) {

  //fetch info
  Promise.all([
    Photo.find({}, "user_id  comments.user_id").exec(),
    User.find({},"_id first_name last_name").exec()
  ]).then((result) => {
    const users = result[1];
    const info = result[0];

    // validate informations
    if (users.length === 0) {
          // None found - return 500 error
          return response.status(500).send("Missing UserList");
    }
    if (info.length === 0) {
          // None found - return 500 error
          return response.status(500).send("Missing UserPhotos");
    }

    // gigachad brute force transformation 
    let obj = [];
    let obj_set = {};

    // generate users
    for(let i = 0; i < users.length; i++){
      let user = {
        _id: users[i]._id,
        first_name: users[i].first_name,
        last_name: users[i].last_name,
        pic_count: 0,
        comment_count: 0,
      };
      obj.push(user);
      obj_set[user._id] = user;
    }

    // generate counts
    for(let i = 0; i < info.length; i++){
      // record photo information 
      let user = obj_set[info[i].user_id];
      if (user !== undefined){
        user.pic_count += 1;
      }

      // record comment information
      for(let j = 0; j < info[i].comments.length; j++){
        user = obj_set[info[i].comments[j].user_id];
        if (user !== undefined){
          user.comment_count += 1;
        }
      }
    }

    //console.log("/user-exp/list", obj);
    return response.json(obj); // Use `json()` to send JSON responses
  });
  return "Unknown Error";
}));
//Upload new photos
app.post("/photos/new", isLoggedIn, asyncHandler(async function (request, response) {
  try{
    processFormBody(request, response, function() {
      console.log("Photo upload0");

      if (request.file === undefined || request.file.originalname === undefined)
      {
        return new Error("No File Uploaded");
      }
      //const objectIdArray = stringObjectIdArray.map(s => new mongoose.Types.ObjectId(s));
      console.log(typeof request.body.accessList);
      const access = request.body.accessList.split(',');
      const tempAcc = [];
     access.forEach(function(ac)  {
        tempAcc.push(new mongoose.Types.ObjectId(ac));
      });
      console.log(`Access : ${access}`);
      console.log(`Object Access:  ${tempAcc}`);
      //console.log(request.file)
      //console.log(request.body.userId);
      const timestamp = new Date().valueOf();
      let tempFileName = request.file.originalname;
      const filename = 'U' +  String(timestamp) + tempFileName.replaceAll(" ","");
      const photoObj = {
        file_name: filename, 
        user_id: request.session.user.userID,
      allowed: tempAcc}; 
      console.log(JSON.stringify(photoObj));
      fs.writeFile("./images/" + filename, request.file.buffer, function() {
        Photo.insertMany(photoObj);
      });
      // return on success
      //return response.json(photoObj);
      return response.status(200).send("Photo Successfully Uploaded");
  });
  return true; //response.status(200).send("Photo Successfully Uploaded");
  }
  catch(err){
    return response.status(400).json(err); // Send the error as JSON
  }
}));

app.post("/commentsOfPhoto/:photo_id", isLoggedIn, jsonParser, asyncHandler(async function (request, response) {
  try{
  const id = request.params.photo_id; 
  const com = request.body.comment; 

  // get userID
  const userId = request.session.user.userID;

  // log output
  console.log(com);
  console.log(id);
  console.log(userId);

  // validate
  if(id === undefined || com === undefined || userId === undefined){
    return response.status(400).send("Invalid arguments");
  }
  else{
    const phoObj = {comment: com, date_time: new Date(Date.now()), user_id:userId};
    Photo.updateOne(
      {_id : id},
      {$addToSet: {comments: phoObj}}
    ).exec();
    return response.send("Added Comment");
  }}
  catch(err){
    return response.status(400).json(err); // Send the error as JSON
  }
}));

/**
 * URL /user-exp/:id - Returns the Expanded Information for User of id.
 */
app.get("/user-exp/:id", isLoggedIn, asyncHandler(async function (request, response) {

  // validate id
  const id = request.params.id;
  if (id.length !== 24){
    console.log("Invalid User " + id);
    return response.status(400).send("Invalid User"); // Send the error as JSON
  }

  //fetch info
  Promise.all([
    Photo.find({}, "_id user_id comments.comment comments.user_id file_name").exec(),
    User.find({_id: id},"_id first_name last_name").exec()
  ]).then((result) => {
    const users = result[1];
    const info = result[0];

    // validate informations
    if (users.length === 0) {
          // None found - return 500 error
          return response.status(500).send("Missing UserList");
    }
    if (info.length === 0) {
          // None found - return 500 error
          return response.status(500).send("Missing UserPhotos");
    }

    const user = users[0];

    // gigachad brute force transformation 
    let userObj = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      comments: [],
    };

    // generate comments
    for(let i = 0; i < info.length; i++){
      for(let j = 0; j < info[i].comments.length; j++){
        // for each comment, if the comment poster is the user    
        if (userObj._id.toString() === info[i].comments[j].user_id.toString()){
          userObj.comments.push({
            photo_id: info[i]._id,
            photo_user: info[i].user_id,
            file_name: info[i].file_name,
            comment: info[i].comments[j].comment
          });
        }
      }
    }

    //console.log("/user-exp/:id" + id, userObj);
    return response.json(userObj); // Use `json()` to send JSON responses
  });
  return "Unknown Error";
}));


/**
 * URL /login
 */
app.post("/admin/login", express.urlencoded({ extended: false }),
  async function (request, response) {
  try{
   
    // attempt login -----------
    const username = request.body.login_name; // fetch login name
    console.log("Login request: username '" + username + "'");

    //validate login
    const user_info = await User.find({login_name: username}, "_id first_name last_name login_name");
    if (!(user_info.length > 0)){
      return response.status(400).send("Invalid input"); // Send the error as JSON
    }
    const user_id = user_info[0]._id;

    const user_passkey = await User.find({login_name: username}, "password");
    if (user_info.length === 0){
      return response.status(400).send("Invalid input"); // Send the error as JSON
    }

    // validate password
    if (user_passkey[0].password === request.body.password){
      // record login
      request.session.regenerate(function (){
       // if (err) next(err);

        // create session
        request.session.user = {username: username, userID: user_id};

        request.session.save(function (){
        //  if(err) return next(err);
          console.log("Login successful");
          return response.json(user_info[0]); // return json
        });
      });
    }
    // if invalid, return error
    else{
      console.log("password rejected");
      return response.status(400).send("Invalid input"); // Send the error as JSON
    }
    return true; // Send the error as JSON
  }
  catch(err){
    console.error("Bad param " + request.params, err);
    return response.status(400).json(err); // Send the error as JSON
  }
});

/**
 * URL /logout
 */
app.post("/admin/logout", async function (request, response) {
  try{
    //FIXME: require session before allowing

    // remove session
    request.session.user = null;

    // save change to session
    request.session.save(function (){
     // if (err) next(err);

      request.session.regenerate(function (){
       // if (err) next(err);
        response.redirect('/');
      });
    });

    console.log("logout request placed");

    // collect session user
    //response.send(user);
    return true; // Send the error as JSON
  }
  catch(err){
    console.error("Bad param " + request.params, err);
    return response.status(400).json(err); // Send the error as JSON
  }
});

/**
 * URL /user
 */
app.post("/user", express.urlencoded({ extended: false }),
  async function (request, response) {
  try{
   
    console.log(request.body);

    // validate contents -----------
    const login_name_r = request.body.login_name;
    const password_r = request.body.password;
    const first_name_r = request.body.first_name;
    const last_name_r = request.body.last_name;
    const location_r = request.body.location;
    const description_r = request.body.description;
    const occupation_r = request.body.occupation;

    // ensure login name, password, and names exist
    if (!(login_name_r && password_r && first_name_r && last_name_r)){
      console.log("Invalid input");
      return response.status(400).send("Invalid input");
    }

    // ensure login name is new
    const existing_names = await User.find({login_name: login_name_r}, "login_name");
    if (existing_names.length !== 0){
      console.log("User already exists");
      return response.status(400).send("Invalid input"); // Send the error as JSON
    }

    // generate new user
    const userObject = {
      login_name: login_name_r,
      password: password_r,
      first_name: first_name_r,
      last_name: last_name_r,
      location: (location_r), //? location_r: ""
      description: (description_r), //? description_r: ""
      occupation: (occupation_r) //? occupation_r: ""
    };

    const userResponse = await User.create (userObject);
    console.log("New user: " + userResponse);

    // attempt login -----------
    console.log("Login request: username '" + login_name_r + "'");

    //validate login
    const user_info = await User.find({login_name: login_name_r}, "_id first_name last_name login_name");
    if (user_info.length === 0){
      return response.status(400).send("Invalid input"); // Send the error as JSON
    }

    // record login
    request.session.regenerate(function (){
     // if (err) next(err);

      // create session
      request.session.user = {
        username: user_info[0].login_name, 
        userID: user_info[0]._id};


      request.session.save(function (){
     //   if(err) return next(err);
        console.log("Login successful");
        return response.json(user_info[0]); // return json
      });
    });
    return true; // Send the error as JSON
  }
  catch(err){
    console.error("Bad param " + request.params, err);
    return response.status(400).json(err); // Send the error as JSON
  }
});

// request.session.name = "SESSION_TEST";
// request.send("test 1");

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
