import React, {useState, useEffect} from "react";
import {
  Card,
  CardMedia,
  Grid,
  CardActionArea,
  Button
} from "@mui/material";
import "./styles.css";
import axios from "axios";
import useStateContext from "../Context";
// user comment list component
function UserFavorites() {

  const {username, user_id} = useStateContext(); // get flags

  // user model
  const [model, setModel] = useState([]);
  const [delFavFlag, setDelFavFlag] = useState("");
  const [phId, setphId] = useState("");


  function handleDelete(event, pId)
  {
    event.preventDefault();
    setphId(pId);
  }
  // fetch data
  useEffect(()=>{
    axios.get("/favorites").then(
      function(success){setModel(success.data); 
        console.log(success.data);
      },
      (failure) => {
        console.log(failure);
        setModel({});
      }
    );
  },[username, delFavFlag]);

  useEffect(()=>{
    const data = {phID: phId};
    axios.delete(`/deleteFave/${user_id}`, {data:data}).then((response) => {
      console.log(response);
      setDelFavFlag(phId);
    },
      (failure) => {
        console.log(failure);
      }
    );
  },[phId]);

  // content display
  // displays a list of favorite cards from fetched data
  return (
  <div>
      {model.map( (item, key) => {
        return (
          <div key={key}>
            <Card sx={{ m: 2 }}>
              <CardActionArea>
                <Grid container spacing={2}>
                  <Grid item sm={3}>
                    <CardMedia
                      component="img"
                      sx={{ height: 100 }}
                      image={"/images/" + item.file_name}
                      alt={"image id " + item.photo_id}
                    />
                  </Grid>
                </Grid>
                {<Button onClick={(e) => {handleDelete(e, item.photo_id);}}> Remove Favorite</Button>}
              </CardActionArea>
            </Card>
          </div>
        );
      })}
  </div>
  );
}

export default UserFavorites;
