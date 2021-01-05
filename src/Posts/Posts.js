import React, { useState, useEffect, useContext } from "react";
import Post from "./Post/Post";
import { db } from "../firebase";
import UploadPost from "./UploadPost/UploadPost";

const Posts = ({ username, user }) => {
  // const allPosts = [
  //   {
  //     username: "Donald Trump",
  //     caption: "WOW what a Post!!!",
  //     image: pic2,
  //   },
  //   {
  //     username: "Barak Obama",
  //     caption: "WOW what a Post!!!",
  //     image: pic3,
  //   },
  //   {
  //     username: "Rock",
  //     caption: "WOW what a Post!!!",
  //     image: pic4,
  //   },
  // ];
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <div className="posts">
      <div className="post__upload">
        {user?.displayName ? (
          <UploadPost username={user.displayName} />
        ) : (
          <h1>You need to login to Upload a Post</h1>
        )}
      </div>

      {posts.map(({ id, post }) => {
        const { username, caption, image } = post;
        return (
          <Post
            key={id}
            postId={id}
            user={user}
            username={username}
            caption={caption}
            image={image}
          />
        );
      })}
    </div>
  );
};

export default Posts;
