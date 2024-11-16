import React, {useState} from "react";
import axios from "axios";
function PhotoUpload()
{
    //Test userId Ian 6734ea8f336943f1ccc4b552
    const [photo, setPhoto] = useState();
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
        data.append('userId','6734ea8f336943f1ccc4b552'); 
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
    return(
    <>

    <div>
        <form onSubmit={handleSubmit}>
        <h1>Upload A Photo</h1>
        <input type="file" onChange={handleChange}/>
        <button type="submit">Upload</button>
        </form>
    </div>
    </>
    )
}


export default PhotoUpload;