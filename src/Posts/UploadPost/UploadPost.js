import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import "./UploadPost.css";

const UploadPost = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              image: url,
              username: username,
            });
            setProgress(0);
            setImage(null);
            setCaption("");
            console.log("Upload complete");
          });
      }
    );
  };
  return (
    <div className="postUpload flex flex-col item-center">
      {/* caption */}
      <progress className="progress" value={progress} max="100" />
      <textarea
        className="textarea"
        type="text"
        cols="50"
        rows="3"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="What's on your mind..."
      />
      <hr />
      {/* file picker + progress bar */}

      <div className="footer">
        <input className="filesInput" type="file" onChange={handleChange} />
        {/* Upload button */}
        <Button className="btn" onClick={handleUpload}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadPost;
