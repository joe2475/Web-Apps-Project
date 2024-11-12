import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import { Grid, Paper, Button } from "@mui/material";
import { HashRouter, Route, Routes, useParams } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/Comments";

//call on user detail component
function UserDetailRoute() {
  const {userId} = useParams();
  console.log("UserDetailRoute: userId is:", userId);
  return <UserDetail userId={userId} />;
}

// call on user photos component
function UserPhotosRoute({flag}) {
  const {userId} = useParams();
  if (flag)  return <UserPhotos userId={userId} flags={flag} />;
}

// call comments component
function CommentsRoute({flags}){
  const {userId} = useParams();
  return <UserComments flags={flags} userId={userId}/>;
}

// app
function PhotoShare() {

  // experimental features flags
  const [experimental, setExperimental] = useState(false);
  // function for callback
  function setExperiment(boolean){
    setExperimental(boolean);
  }
  // flags object
  const flags = {
    flag: experimental,
    setFlag: setExperiment,
  };

  // render display
  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar props={flags} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList flags={flags}/>
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/users/:userId" element={<UserDetailRoute />} />
                <Route path="/comments/:userId" element={<CommentsRoute flags={flags}/>} />
                <Route path="/photos/:userId/*" element={<UserPhotosRoute flag={flags} />} />
                <Route path="/users" element={(<UserList flags={flags}/>)} />
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
  );
}


const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<PhotoShare />);
