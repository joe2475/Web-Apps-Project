import React, {useState} from "react";
import {
  Card,
  CardMedia,
  Grid,
  CardActionArea,
} from "@mui/material";
import "./styles.css";
import axios from "axios";

// user comment list component
function UserComments({flags, userId}) {
  // case: no features - warn that there are no features
  if (flags === undefined || flags.flag === false){
    return(<h2>Enable experimental features to access User Comments page.</h2>);
  }

  // user model
  const [model, setModel] = useState({});

  // fetch data
  axios.get("/user-exp/"+userId).then(
    function(success){setModel(success.data); 
      console.log(success.data);
    },
    (failure) => {
      console.log(failure);
    }
  );

  // content display
  // displays a list of comment cards from fetched data
  return (
    <div>
      {(model.comments && model.comments.length)? model.comments.map( (item, key) => {
        return (
          <div key={key}>
            <Card sx={{ m: 2 }}>
              <CardActionArea href={"#/photos/"+ item.photo_user + "/" + item.photo_id}>
                <Grid container spacing={2}>
                  <Grid item sm={3}>
                    <CardMedia
                      component="img"
                      sx={{ height: 100 }}
                      image={"/images/" + item.file_name}
                      alt={"image id " + item.photo_id}
                    />
                  </Grid>
                  <Grid item sm={6}>
                    {item.comment}  
                  </Grid>
                </Grid>
              </CardActionArea>
            </Card>
          </div>
        );
      }) : <h2>No Comments.</h2>}
    </div>
  );
}

export default UserComments;
