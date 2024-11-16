import React, {useState} from "react";
import axios from "axios";
function PhotoUpload()
{
    const [photo, setPhoto] = useState();
    function handleChange(event)
    {
        setPhoto(event.target.files[0]); 
    }
    function handleSubmit(event)
    {
        event.preventDefault();
        const url = '/photos/new'; 
        const data = new FormData();
        data.append('file',photo); 
        data.append('filename', photo.name);
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