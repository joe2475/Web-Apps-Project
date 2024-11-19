"use strict";

import React, { useState, useEffect, useRef } from "react";
import { Typography, 
  Card,
  Button,
  TextField,
} from "@mui/material";

import "./styles.css";
import axios from "axios";
import useStateContext from "../Context";

// display components for UserPhotos Component
// separated to different file for clarity
// format datetime for display
export function FormatDatetime({input}){
  const dat = new Date(input);
  const op = {month: "long", day: "numeric", year:"numeric"};
  const opt = {hour:"numeric", minute:"numeric"};
  return(dat.toLocaleDateString(undefined, op) + " at " + dat.toLocaleTimeString(undefined, opt));
}

// component for comment display
export function CommentUnit({comment}){
  return(
    <Card key={comment._id} className="commentCard">
      <Typography variant="body1" className="commentTitle">
        <a href={"#/users/" + comment.user._id}>{comment.user.first_name + " " + comment.user.last_name} </a> 
        {<FormatDatetime input={comment.date_time} />};
      </Typography>
      <Typography>
        {comment.comment}
      </Typography>
    </Card>
  );
}


// component for photo display, with photo, metadata, and comments
export function PhotoUnit({photo, user}){
  const [com, setCom] = useState("");
  const [addCom, setAddCom] = useState("");
  const [phId, setPhId] = useState("");
  var didMount = useRef(false); 
  const userInfo = useStateContext();
  const userId = userInfo.user_id;
  function handleOnChange(event)
  {
    event.preventDefault();
    setCom(event.target.value);
  }
  useEffect(()=>{
    //console.log("made it to use effect");
    if (didMount.current)
    { 
      console.log("Test Mount");
      //console.log(`This is the text : ${addCom}`)
      //console.log(`photo id is : ${phId}`);
      setCom("");
      const url = `/commentsOfPhoto/${phId}`; 
        const data = {'comment':addCom, 'user':userId};
        
       // data.append('comment',addCom); 
       // data.append('user', userId);
        console.log(data);
        const config = {
            headers : {
                'content-type': 'application/json'
            },
        };
        axios.post(url, data, config).then((response) => {
            console.log(response.data);
        })
    }
    didMount.current = true;
  },[addCom]);
function handleOnSubmit(event, photoId)
{
  event.preventDefault();
  console.log(com);
 // console.log(photoId);
  setPhId(photoId);
  setAddCom(com); 
}

  // return loading if no contents
  if(photo === undefined || !photo._id){
    return(<h3>Loading Photo...</h3>);
  }

  return(<>
  <div key={photo._id} className="photo">
    <img src={"/images/" + photo.file_name} alt={"User Sumbitted Content"} className="photoImage"/>
    <br />
    <Typography variant="caption">
      {user === "" ? "Loading User..." : ( 
      <>
        posted by <a href={"#users/" + photo.user_id}>{user.first_name + " " + user.last_name}</a> on <FormatDatetime input={photo.date_time} />;
      </>
      )}
    </Typography>
    {photo.comments? photo.comments.map((elem) => < CommentUnit comment={elem} key={elem._id} />) : <br />}
  </div>
  <div>
    <p>{com}</p>
  <TextField fullWidth label="comment" id="comment" onChange={(e) => {handleOnChange(e)}}/>
    <Button  variant="contained" onClick={(e) => {handleOnSubmit(e, photo._id)}}>Add Comment</Button></div>
</>
  );
}

export default PhotoUnit;