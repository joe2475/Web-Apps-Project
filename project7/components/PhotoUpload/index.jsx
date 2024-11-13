import React from "react";

function PhotoUpload()
{
   // console.log("Test");
    return(
    <>

    <div>
        <form>
        <h1>Upload A Photo</h1>
        <input type="file"/>
        <button type="submit">Upload</button>
        </form>
    </div>
    </>
    )
}


export default PhotoUpload;