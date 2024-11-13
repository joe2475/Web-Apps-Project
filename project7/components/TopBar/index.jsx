"use strict";

import React, {useState, useContext} from "react";
import { AppBar, Toolbar, Typography, Switch, FormGroup, FormControlLabel, Button } from "@mui/material";
import { Route, Routes, useParams, Link } from "react-router-dom";

import "./styles.css";
import axios from "axios";
import useStateContext from ".././Context";

// function for fetching username for display
function getUsername(){
  // setup retrieval
  const {userId} = useParams();
  const [user, setuser] = useState("");

  // fetch data
  axios.get("/user/"+userId).then(
    function(success){setuser(success.data); },
    (failure) => {console.log(failure); }
  );

  // represent result
  if (user === "") return "";
  return user.first_name + " " + user.last_name;
}


// function for fetching version number for display
function getVersion(){
  // setup retrieval
  const [version, setVersion] = useState("");

  // fetch data
  axios.get("/test/info").then(
    function(success){setVersion(success.data); },
    (failure) => {console.log(failure);  }
  );

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
  const {useAdvanced, setUseAdvanced} = useStateContext();

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Jordan Frimpter
        </Typography>
        <FormGroup>
          <FormControlLabel control={<Switch checked={useAdvanced} onChange={(event)=>{setUseAdvanced(event.target.checked);}} color="secondary"/>} label="Enable Advanced Features" />
        </FormGroup>  
        <Typography variant="h5" color="inherit">
          {getText()}
          <Button component={Link} to='/photo/upload' variant="contained" color="primary">Add Photo</Button>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
//<Link to='/photo/upload'>Upload Photo</Link>