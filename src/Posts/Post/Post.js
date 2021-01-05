import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import FavoriteBorderSharpIcon from "@material-ui/icons/FavoriteBorderSharp";
import BookmarkBorderSharpIcon from "@material-ui/icons/BookmarkBorderSharp";
import { db } from "../../firebase";
import firebase from "firebase";
const Post = ({ username, caption, image, postId, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post_header flex justify-between">
        <div className="Post__header__right flex item-center">
          <Avatar className="post__avatar hoverable" alt="" src="" />
          <h4 className="post__username">{username}</h4>
        </div>
        <MoreHorizIcon className="hoverable" />
      </div>

      <img className="post_image" src={image} alt="Post" />
      <h4 className="post__text">
        <strong className="post__username">{username}</strong> {caption}⁠
      </h4>
      <div className="commnets-displayBox">
        {comments.map((comment) => (
          <h4>
            <strong>{comment.username} </strong>
            {comment.text}
          </h4>
        ))}
      </div>
      {user && (
        <div className="post__commentBox">
          <form className="flex justify-between item-center">
            <textarea
              className="post__input"
              type="text"
              placeholder="Add a comment... "
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="post__button"
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
