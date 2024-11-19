import React, {useState} from "react";
import axios from "axios";
import useStateContext from "../Context";
import { makeStyles } from '@mui/styles';
import { Button, Input} from "@mui/material";
//import FileUploadIcon from '@mui/material/Icon';

const useStyles = makeStyles({
    root: {
      '& > *': {
        margin: "auto",
      },
    },
    input: {
     // display: 'none',
    },
    h1:{
        textAlign: "center"
    }
  });
function PhotoUpload()
{
    const classes = useStyles();
    const [photo, setPhoto] = useState();
    const userInfo = useStateContext();
    const userId = userInfo.user_id;
    //console.log(userId); 
    function handleChange(event)
    {
        setPhoto(event.target.files[0]); 
    }
    function handleSubmit(event)
    {
        event.preventDefault();
        if (photo != undefined)
        {
        console.log(photo);
        const url = '/photos/new'; 
        const data = new FormData();
        data.append('file',photo); 
        data.append('filename', photo.name);
        data.append('userId',userId); 
        console.log(photo.name);
        //console.log(data);
        const config = {
            headers : {
                'content-type': 'multipart/form-data'
            },
        };
        axios.post(url, data, config).then((response) => {
            console.log(response.data);
        })
    }
    else //Need to add logic for sending empty file to return a 400 respsone. Don't know why we can't just handle this on the frontend but whatever
    {
        console.log("No File Loaded");
    }
    }
   // console.log("Test");
   //  startIcon={<FileUploadIcon/>}
    return(
    <>
<h1 className={classes.h1}>Upload Photo</h1>
<div>
<Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
>
  Upload files
  <Input
    type="file"
    onChange={(event) => {handleChange(event)}}
  />
</Button>
</div>
<div>
<Button
onClick={(event) => {handleSubmit(event)}}>
    Submit 
</Button>
</div>
    </>
    )
}


export default PhotoUpload;