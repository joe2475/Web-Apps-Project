import React, {useEffect, useState} from "react";
import { Typography, 
  Divider,
} from "@mui/material";
import { Route, Routes, Navigate, useParams, useLocation } from "react-router-dom";

import "./styles.css";
import axios from "axios";
import {PhotoUnit} from "./display";
import ExpNav from "./experimentalDisplay";
import useStateContext from "../Context";

// generate experimental image view
function CallExperimental({user, photos}){
  // get photo ID
  const {photoId} = useParams();

  //get photo index in current array
  function indexOfPhoto(id){
    for(var i = 0; i < photos.length; i++){
      if(photos[i]._id === id) return i;
    }
    return -1;  // not found, return none
  }

  // determine index
  const ind = indexOfPhoto(photoId);

  // if index does not exist
  if (ind < 0){
    // if there are photos for this user, select the first and display
    if (photos.length){
        return <Navigate to={photos[0]._id} replace="true"/>;
    }
    // otherwise navigate to user page
    return<Navigate to={"/user/" + user._id} replace="true"/>;
  }

  //generate the experimental view
  return( <ExpNav user={user} photos={photos} photoId={photoId}/>) ;
}

// user photos component
// accomidates both ordinary and experimental features
function UserPhotos({userId}) {
  const [photos, setPhotos] = useState(""); // photos of user
  const [user, setuser] = useState(""); // user owner of photos
  const location = useLocation();
  const {useAdvanced, username} = useStateContext(); // get flags
  // regenerate when location changes
  useEffect(() => {}, [location]);

  // fetch data
  useEffect(()=>{
    Promise.all([
      axios.get("/photosOfUser/"+userId),
      axios.get("/user/"+userId)
    ]).then((result) => {
      setPhotos(result[0].data);
      setuser(result[1].data);
      //console.log(photos, "\n", user)
    },
  () => {
    setPhotos("");
    setuser("");
  });
  },[userId, username]);

  //photo navigation for redirection
  function getFirstPhoto(){
    if (photos !== "") return photos[0]._id;
    return "";
  }

  // return statements --------------------------------------------

  // case photos are loading still
  if(photos === "" || user === ""){
    return(
      <div className="photoGroup">
        <Typography variant="h3">Loading...</Typography>
      </div>
    );
  }

  // case no photos
  if(photos.length < 1){
    return(
      <div className="photoGroup">
        <Typography variant="h3">User has no photos.</Typography>
      </div>
    );
  }

  // case experimental conditions are true, and normal photo display
  return(
    <div className="photoGroup">
      {useAdvanced?
      (
      <Routes>
          <Route path="/:photoId" element={<CallExperimental user={user} photos={photos} setPhotos={setPhotos} />} />
          <Route path="/*" element={<Navigate to={getFirstPhoto()}/>}  />
      </Routes>
      ):
      <>{photos.map((photo) => {return( <div key={photo._id}>{<PhotoUnit photo={photo} user={user} setPhotos={setPhotos}/>}<br/><Divider/><br/></div>);})}</>}
    </div>
  );
}

export default UserPhotos;
