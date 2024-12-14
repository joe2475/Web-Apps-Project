import React, {useEffect, useState} from "react";
import axios from "axios";
import { Button, Input, Typography, Card, Select, MenuItem, Checkbox} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import useStateContext from "../Context";

function PhotoUpload()
{
    const [photo, setPhoto] = useState();
    const [select, setSelect] = useState([]);
    const [users, setUsers] = useState({}); 
    const allUsers = []; 
    const [accessFlg, setAccessFlg] = useState(false); 
    const userInfo = useStateContext();
    const navigate = useNavigate();
    const userId = userInfo.user_id;
   // const users = ["Test", "Test1", "Test2"];

   useEffect(() => {
    axios.get("/user/list").then(
        function(success){console.log(success.data); setUsers(success.data); },
        (failure) => {
          console.log(failure);  
          setUsers({});
        },
      );
   }, []);
    function handleMultiple(event)
    {
        const {
            target: { value },
         } = event;
        // console.log(value);
         setSelect(
            typeof value === "string" ? value.split(",") : value
         );
    }
    function handleChange(event)
    {
        setPhoto(event.target.files[0]); 
    }
    function handleSubmit(event)
    {
        event.preventDefault();
        var selected; 
        console.log(select.length);
        users.forEach((u) => {
          allUsers.push(u._id);
        });
        if ( accessFlg === true)
          {
            if (select.length !== 0) {
            selected = [...select, userId];
            }
            else 
            {
              selected = userId;
            }
          }
        
        else
        {
            selected = allUsers;
        }
        if (photo !== undefined)
        {
        console.log(photo);
        const url = '/photos/new'; 
        const data = new FormData();
        data.append('uploadedphoto',photo); 
        data.append('filename', photo.name);
        data.append('userId',userId); 
        if (accessFlg === true){
        data.append('accessList',[selected]);
        }
        else {
          data.append('accessList', [selected]);
        }
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

        {console.log(select)}
        <Button
        onClick={(event) => {handleSubmit(event);}}
        variant="contained" color="primary">
            Submit 
        </Button>
        <Typography>Set Photo Permissions (Leave blank to allow only current user)</Typography>
        <Checkbox onChange={(event) => (event.target.checked ? setAccessFlg(true) :  setAccessFlg(false))} label='access'></Checkbox> 
        {console.log(accessFlg)}
        {accessFlg === true ? 
       ( 
      <Select 
          multiple
          value={select}
          onChange={handleMultiple}>
            {users.length  ?  users.map((u) => (
                     <MenuItem key={u.first_name} value={u._id}>
                        {u._id !== userId ?  `${u.first_name}  ${u.last_name}` : ""}
                     </MenuItem>
                  )) :< MenuItem value='Null'>--</MenuItem> }
      </Select>
        )
        : console.log("No access")}
      </Card>
    </>
    );
}


export default PhotoUpload;