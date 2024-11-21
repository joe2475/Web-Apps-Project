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
export function PhotoUnit({photo, user, setPhotos}){
  const [com, setCom] = useState("");
  const [addCom, setAddCom] = useState("");
  const [phId, setPhId] = useState(""); 
  const userInfo = useStateContext();
  const userId = userInfo.user_id;
  var didMount = useRef(false);
  function handleOnChange(event)
  {
    event.preventDefault();
    setCom(event.target.value);
  }
  useEffect(()=>{
    if (didMount.current)
    { 
      const url = `/commentsOfPhoto/${phId}`; 
        const data = {comment:addCom, user:userId};   
        const config = {
            headers : {
                'content-type': 'application/json'
            },
        };
        axios.post(url, data, config).then((response) => {
         //   console.log(JSON.stringify(response.data)); 
            console.log(response.data);
        });
        axios.get(`/photosOfUser/${user._id}`).then((result) => {
          setCom("");
          setPhotos(result.data);
        });
        
    }
    didMount.current = true;
  },[addCom]);
function handleOnSubmit(event, photoId)
{
  event.preventDefault();
  setPhId(photoId);
  setAddCom(com);  
}

  // return loading if no contents
  if(photo === undefined || !photo._id){
    return(<h3>Loading Photo...</h3>);
  }

  return(
<>
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
  <TextField fullWidth label="comment" id="comment" value={com} onChange={(e) => {handleOnChange(e);}}/>
    <Button variant="contained" onClick={(e) => {handleOnSubmit(e, photo._id);}}>Add Comment</Button>
  </div>
</>
  );
}

export default PhotoUnit;