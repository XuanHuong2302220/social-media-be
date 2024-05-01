import Post from "./../models/post/postModel.js";
import Comment from "../models/post/commentModel.js";
import LikePost from "../models/post/likePostModel.js";
import Follow from "./../models/followModel.js";

export const getPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ authorId: userId });

    if (!posts || posts.length === 0)
      return res.status(400).json("Not post created yet");

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        return {
          _id: post._id,
          authorId: post.authorId,
          title: post.title,
          image: post.image,
          like: post.likePostId.length,
          comment: post.commentId.length,
        };
      })
    );

    res.status(200).json({
      quantity: posts?.length,
      posts: postsWithComments,
    });
  } catch (error) {
    console.log("Error in getPosts controller", error.message);
    res.status(500).json("Internal server error");
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(400).json("Not post created yet");

    const comments = await Comment.findOne({ postComment: id });

    if (!comments) return res.status(400).json("Not comment created yet");

    res.status(200).json({
      post: {
        _id: post._id,
        authorId: post.authorId,
        title: post.title,
        image: post.image,
        like: post.likePostId.length,
        comment: post.commentId.length,
      },
    });
  } catch (error) {
    console.log("Error in getPost controller", error.message);
    res.status(500).json("Internal server error");
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, image } = req.body;
    if (!image) return res.status(400).json("Please fill all the fields");
    const newPost = await Post.create({
      authorId: req.user._id,
      title,
      image,
    });

    if (newPost)
      res.status(201).json({
        message: "Post created successfully",
        post: newPost,
      });
  } catch (error) {
    console.log("Error in createPost controller", error.message);
    res.status(500).json("Internal server error");
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    // check value
    if (!id || !image)
      return res.status(400).json("Please fill all the fields");

    //check post
    const post = await Post.findById(id);
    if (!post) return res.status(404).json("Post not found");

    // check author
    if (!req.user._id.equals(post.authorId))
      res.status(403).json("You can't edit this post");

    //update post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { image },
      { new: true }
    );
    if (updatedPost) {
      return res.status(200).json("Updated Post successfully");
    }
  } catch (error) {
    console.log("Error in editPost controller", error.message);
    res.status(500).json("Internal server error");
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json("Please fill all the fields");

    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json("Post not found");

    if (!req.user._id.equals(post.authorId))
      return res.status(403).json("You can't delete this post");

    if (post) {
      await Comment.findOneAndDelete({ postComment: id });
      await LikePost.findOneAndDelete({ postLike: id });
    }

    res.status(200).json("Post deleted successfully");
  } catch (error) {
    console.log("Error in deletePost controller", error.message);
    res.status(500).json("Internal server error");
  }
};

export const getPostHome = async (req, res) => {
  try {
    const userId = req.user._id;

    const followings = await Follow.findOne({ authorId: userId });

    const postsPromises = followings.followingId?.map((following) => {
      return Post.find({ authorId: following });
    });

    const posts = await Promise.all(postsPromises);

    const post = await Promise.all(
      posts.map(async (post) => {
        return post.map((p) => {
          return {
            _id: p._id,
            authorId: p.authorId,
            title: p.title,
            image: p.image,
            like: p.likePostId.length,
            comment: p.commentId.length,
          };
        });
      })
    );

    const postArray = post.flat();

    return res.status(200).json({
      quantity: postArray?.length,
      posts: postArray,
    });
  } catch (error) {
    console.log("Error in getPostHome controller", error.message);
    res.status(500).json("Internal server error");
  }
};
