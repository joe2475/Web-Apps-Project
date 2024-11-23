import React, {useState} from "react";
import axios from "axios";
import { Button, Input, Typography, Card} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import useStateContext from "../Context";



function PhotoUpload()
{
    const [photo, setPhoto] = useState();
    const userInfo = useStateContext();
    const navigate = useNavigate();
    const userId = userInfo.user_id;
    function handleChange(event)
    {
        setPhoto(event.target.files[0]); 
    }
    function handleSubmit(event)
    {
        event.preventDefault();
        if (photo !== undefined)
        {
        console.log(photo);
        const url = '/photos/new'; 
        const data = new FormData();
        data.append('uploadedphoto',photo); 
        data.append('filename', photo.name);
        data.append('userId',userId); 
        console.log(photo.name);
        const config = {
            headers : {
                'content-type': 'multipart/form-data'
            },
        };
        axios.post(url, data, config).then((response) => {
            console.log(response.data);
            navigate('/photos/' + userId);
        });
    }
    else //Need to add logic for sending empty file to return a 400 respsone. Don't know why we can't just handle this on the frontend but whatever
    {
        console.log("No File Loaded");
    }
    }
    return(
    <>
      <Typography variant="h5">
        Upload Photo
      </Typography>
      <Card sx={{ p: 2 }}>      
        <Input
            type="file"
            onChange={(event) => {handleChange(event);}}
          />
        <Button
        onClick={(event) => {handleSubmit(event);}}
        variant="contained" color="primary">
            Submit 
        </Button>
      </Card>
    </>
    );
}


export default PhotoUpload;