"use strict";

import React from "react";
import {  
  Button,
} from "@mui/material";

import "./styles.css";
import {PhotoUnit} from "./display";

// display component for single photo display ["advanced feature"]
function ExpNav({user, photos, photoId}){
  //console.log(user, photos, photoId);
  //get photo index
  function indexOfPhoto(id){
    for(var i = 0; i < photos.length; i++){
      if(photos[i]._id === id) return i;
    }
    return -1;  // not found, return none
  }
  // index of next photo, or -1 if N/A
  function getNextPhoto(photoIdIndex){
    if (photoIdIndex === -1) return -1;
    if (photoIdIndex + 1 >= photos.length) return -1;
    return photoIdIndex + 1;
  }
  // index of last photo, or -1 or -2 if N/A
  function getLastPhoto(photoIdIndex){
    return photoIdIndex - 1; // -1 is null value
  }

  // gather navigation constants
  const photo = indexOfPhoto(photoId);
  const photoObj = photos[photo];
  const next = getNextPhoto(photo);
  const last = getLastPhoto(photo);

  return(
    <>
      {last < 0? <Button variant="outlined" disabled sx={{ m: 2 }}>Last</Button>
      :<Button variant="outlined" href={"#photos/" + user._id + "/" + photos[last]._id} sx={{ m: 2 }}>Last</Button>}
      {next < 0? <Button variant="outlined" disabled sx={{ m: 2 }}>Next</Button>
      :<Button variant="outlined" href={"#photos/" + user._id + "/" + photos[next]._id} sx={{ m: 2 }}>Next</Button>}
      <PhotoUnit photo={photoObj} user={user} />
    </>
  );
}

export default ExpNav;