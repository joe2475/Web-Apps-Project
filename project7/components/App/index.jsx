import React, {useEffect} from "react";
import { Grid, Paper, Button } from "@mui/material";
import { HashRouter, Route, Routes, useParams } from "react-router-dom";

import TopBar from "../TopBar";
import UserDetail from "../UserDetail";
import UserList from "../UserList";
import UserPhotos from "../UserPhotos";
import UserComments from "../Comments";
import useStateContext from "../Context";
import Login from "../Login";
import PhotoUpload from "../PhotoUpload";
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
function App() {

    const {username} = useStateContext();

    useEffect(()=>{}, [username]);

  // render display
  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          {/*if not logged in, display only login prompt*/}
          {username? (
          <>
            <Grid item sm={3}>
              (
                <Paper className="main-grid-item">
                <UserList/>
                </Paper>
              )
            </Grid>
            <Grid item sm={9}>
                <Paper className="main-grid-item">
                <Routes>
                    <Route path="/users/:userId" element={<UserDetailRoute />} />
                    <Route path="/comments/:userId" element={<CommentsRoute/>} />
                    <Route path="/photos/:userId/*" element={<UserPhotosRoute  />} />
                    <Route path="/users" element={(<UserList/>)} />
                    <Route path="/photo/upload" element={<PhotoUpload/>}></Route>
                    <Route
                    path="/"
                    element={<Button href="#users">Navigate to Users</Button>}
                    />
                </Routes>
                </Paper>
            </Grid>
          </>)
          : <Grid item><Login /></Grid> }
        </Grid>
      </div>
    </HashRouter>
  );
}

export default App;