"use strict";

import React from "react";
import ReactDOM from "react-dom/client";
import { Grid, Paper, Button } from "@mui/material";
import { HashRouter, Route, Routes, useParams } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/Comments";
import {Context} from "./components/Context";

//call on user detail component
function UserDetailRoute() {
  const {userId} = useParams();
  console.log("UserDetailRoute: userId is:", userId);
  return <UserDetail userId={userId} />;
}

// call on user photos component
function UserPhotosRoute() {
  const {userId} = useParams();
  return <UserPhotos userId={userId} />;
}

// call comments component
function CommentsRoute(){
  const {userId} = useParams();
  return <UserComments userId={userId}/>;
}

// app
function PhotoShare() {

  // render display
  return (
    <Context>
      hi
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList/>
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/users/:userId" element={<UserDetailRoute />} />
                <Route path="/comments/:userId" element={<CommentsRoute/>} />
                <Route path="/photos/:userId/*" element={<UserPhotosRoute  />} />
                <Route path="/users" element={(<UserList/>)} />
                <Route
                  path="/"
                  element={<Button href="#users">Navigate to Users</Button>}
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </HashRouter>
    </Context>
  );
}


const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<PhotoShare />);
