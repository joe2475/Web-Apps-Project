import React, { useState, useEffect, useRef } from "react";
import { Typography, 
  Card,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import useStateContext from "../Context";
import "./styles.css";
import axios from "axios";
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
export function CommentUnit({comment, setDelete, setComId, setPhId, pID, setPhotoFlag}){
  const userInfo = useStateContext();
  const userId = userInfo.user_id;
function handleDelete(event, commentId)
{
  event.preventDefault();
  setComId(commentId);
  setPhId(pID);
  setPhotoFlag(false);
  setDelete(commentId);
}
  return(
    <Card key={comment._id} className="commentCard">
      <Typography variant="body1" className="commentTitle">
        <a href={"#/users/" + comment.user._id}>{comment.user.first_name + " " + comment.user.last_name} </a> 
        {<FormatDatetime input={comment.date_time} />};
      </Typography>
      <Typography>
        {comment.comment}
      </Typography>
      {comment.user._id === userId ? <Button onClick={((e) => {handleDelete(e, comment._id)})}>Delete</Button>  : console.log("")}
    </Card>
  );
}


// component for photo display, with photo, metadata, and comments
export function PhotoUnit({photo, user, setPhotos}){
  const [com, setCom] = useState("");
  const [del, setDelete] = useState("");
  const [photoFlag, setPhotoFlag] = useState(false);
  const [addCom, setAddCom] = useState("");
  const [phId, setPhId] = useState(""); 
  const [like, setLike] = useState(photo.userLiked);
  const [num, setNum] = useState(photo.likes);
  const [comId, setComId] = useState("");
  var didMount = useRef(false);


  // like post
  function likePhoto(){
    console.log("New like status: " + !like);
    axios.post("/likePhoto/"+photo._id, {status: !like}).then(
        (success) => {            
            console.log("Like Photo requested");
            if(like){
              setNum(num - 1);
            }
            else{
              setNum(num + 1);
            }
            setLike(!like);
        },
        (failure) => {
            console.log(failure);  
        }
    );
  }

  const userInfo = useStateContext();
  const userId = userInfo.user_id;
  function handleOnChange(event)
  {
    event.preventDefault();
    setCom(event.target.value);
  }

  useEffect(() => {
    if (didMount.current)
      { 
        var dat;
      const deleteMedia = async data => {
        await axios.delete(`/deletePhoto/${phId}`, {data:data}).then((response) => {
            setPhotoFlag(false);
          })
      }
        if (photoFlag){
          dat = {comId:'NA'};
          console.log("made it to photo flag")
       }

       else {
        dat = {comId:comId};
        console.log("Made it to comment flag")
       }

      deleteMedia(dat);
      axios.get(`/photosOfUser/${user._id}`).then((result) => {
        console.log(result.data);
        setPhotos(result.data);
      });   
      }

      didMount.current = true;
  },[del])
  useEffect(()=>{
    if (didMount.current)
    { 
      const url = `/commentsOfPhoto/${phId}`; 
        const data = {comment:addCom};   
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

 function handleDelete(event, photoId)
 {
 event.preventDefault();
  setPhId(photoId);
  setPhotoFlag(true);
  setDelete(photoId);
 } 
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
    {photo.user_id === userId ? <Button onClick={(e) => {handleDelete(e, photo._id)}}> Delete</Button> : console.log("")}
    <Typography variant="caption">
      {user === "" ? "Loading User..." : ( 
      <>
        posted by <a href={"#users/" + photo.user_id}>{user.first_name + " " + user.last_name}</a> on <FormatDatetime input={photo.date_time} />;
      </>
      )}
    </Typography>
    
    <Grid container spacing={2}>
      <Grid item>
        <Typography variant="h5" color="secondary">
          {num} Likes
        </Typography>
      </Grid>
      <Grid item>
        {like? 
        <Button variant="contained" onClick={likePhoto}>👍</Button>:
        <Button variant="outlined" onClick={likePhoto}>👍</Button>}
      </Grid>
    </Grid>
    {photo.comments? photo.comments.map((elem) => < CommentUnit comment={elem} key={elem._id} setDelete={setDelete} setComId={setComId} setPhId={setPhId} pID = {photo._id} setPhotoFlag={setPhotoFlag}/>) : <br />}
  </div>
  <div>
  <TextField fullWidth label="comment" id="comment" value={com} onChange={(e) => {handleOnChange(e);}}/>
    <Button variant="contained" onClick={(e) => {handleOnSubmit(e, photo._id);}}>Add Comment</Button>
  </div>
</>
  );
}

export default PhotoUnit;