import React, {useState} from "react";
import { Button, Divider, Typography } from "@mui/material";

import "./styles.css";
import axios from "axios";

// user details component
function UserDetail({userId}) {
  // user data constants
  const [user, setuser] = useState("");
  
  // fetch data
  axios.get("/user/"+userId).then(
    function(success){setuser(success.data); },
    (failure) => {console.log(failure); }
  );
  
  // if user isn't loaded, do not display content
  return (
    <div className="userDesc">
      {user === ""? "":( 
        <>
          <Typography variant="h3" className="name">
            {user.first_name + " " + user.last_name}
          </Typography>
          <Typography variant="body1" className="occupation">
            {user.occupation}
          </Typography>
          <Typography variant="body2" className="location">
          <i>{user.location}</i>
          </Typography>
          <br/>
          <Button href={"#photos/" + userId} variant="outlined">User Photos</Button>
          <br/><br/><Divider/><br/>
          <Typography variant="body1" className="description">
            {user.description}
          </Typography>
        </>
      )}
    </div>
  );
}

export default UserDetail;
