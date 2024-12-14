import React, {useState, useEffect} from "react";
import { AppBar, Toolbar, Typography, Switch, FormGroup, FormControlLabel, Button} from "@mui/material";
import { Route, Routes, useParams, Link } from "react-router-dom";

import "./styles.css";
import axios from "axios";
import useStateContext from "../Context";
import {Logout} from "../LoginRegister";


// function for fetching username for display
function getUsername(){
  // setup retrieval
  const {userId} = useParams();
  const [user, setuser] = useState("");

  // fetch data
  useEffect(()=>{
    axios.get("/user/"+userId).then(
      function(success){setuser(success.data); },
      (failure) => {
        console.log(failure); 
        setuser("");
      }
    );
  },[]);

  // represent result
  if (user === "") return "";
  return user.first_name + " " + user.last_name;
}


// function for fetching version number for display
function getVersion(){
  // setup retrieval
  const [version, setVersion] = useState("");

  // fetch data
  useEffect(()=>{
    axios.get("/test/info").then(
      function(success){setVersion(success.data); },
      (failure) => {
        console.log(failure);  
        setVersion("X");
      }
    );
  },[]);

  // represent result
  if (version === "") return "[Loading]";
  return version.__v;
}


// generate text for userpage header
function UserPage(){
  return getUsername();
}


// generate text for user photos header
function UserPhotos(){
  return "Photos of " + getUsername();
}

// generate text for comment view page
function UserComments(){
  return "Comments of " + getUsername();
}


// generate top text (routes determine content)
function getText(){
  return(
    <Routes>
      <Route path="/users/:userId" element={<UserPage />} />
      <Route path="/photos/upload/*" element={"Upload Photo"} />
      <Route path="/photos/:userId/*" element={<UserPhotos />} />
      <Route path="/comments/:userId/*" element={<UserComments />} />
      <Route path="/users" element={"All Users"} />
      <Route path="*" element={"Photos App - Model Version " + getVersion()} />
    </Routes>
  );
}



// topbar component
// if props provided, props are expected to be a flag/setFlag pair object
function TopBar() {
  const {useAdvanced, setUseAdvanced, username, firstname} = useStateContext();

  useEffect(()=>{},[username]);

//    <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
//      Jordan Frimpter
//    </Typography>

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          {username? "Hi " + firstname: "Please Log In"}
        </Typography>
        <FormGroup>
          <FormControlLabel control={<Switch checked={useAdvanced} onChange={(event)=>{setUseAdvanced(event.target.checked);}} color="secondary"/>} label="Enable Advanced Features" />
        </FormGroup>  
        <Typography>
          {username? <Button component={Link} to='/favorites' variant="contained" color="secondary">Favorites</Button> : ""}
        </Typography>
        <Typography variant="h5" color="inherit">
          {getText()}
        </Typography>
          {username? <Button component={Link} to='/photo/upload' variant="contained" color="secondary">Add Photo</Button> : ""}
          {username? <Logout /> : ""}
          {username? <Button component={Link} to='/user/delete_acct' variant="contained" color="secondary">Delete Account</Button> : ""}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
//<Link to='/photo/upload'>Upload Photo</Link>