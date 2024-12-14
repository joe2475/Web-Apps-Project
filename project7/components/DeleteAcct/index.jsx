import { Button, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import useStateContext from "../Context";

function DeleteAcct()
{
     // const userInfo = useStateContext();
      //const userId = userInfo.user_id;
      const {username, setUsername, setFirstname, setLastname, user_id, setUser_id} = useStateContext(); 
function logout()
{
    axios.post("/admin/logout").then(
        function(){
            console.log("posted logout"); 
            setUsername(undefined);
            setFirstname(undefined);
            setLastname(undefined);
            setUser_id(undefined);
        },
        (failure) => {console.log(failure);  }
    );
}
    function handleClick(event)
    {
        event.preventDefault();
        axios.delete(`/deleteAccount/${user_id}`).then((response) => {
          })
        logout();

    }
    return (
        <>
        <Typography>Are you sure you want to delete your account? This will remove all picutres you have posted and all comments you have posted. There is no way to undo this.</Typography>
        <Button onClick={(e) => {handleClick(e)}}>Delete Account</Button>
        </>
    )
}


export default DeleteAcct;