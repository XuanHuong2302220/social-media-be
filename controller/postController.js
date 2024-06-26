import Post from "./../models/post/postModel.js";
import Comment from "../models/post/commentModel.js";
import LikePost from "../models/post/likePostModel.js";
import Follow from "./../models/followModel.js";
import User from "../models/userModel.js";

export const getPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ authorId: userId });

    if (!posts || posts.length === 0)
      return res.status(400).json("Not post created yet");

    const sortPostWithComments = [...posts];
    sortPostWithComments.sort((a, b) => b.createdAt - a.createdAt);

    const postDetails = await Promise.all(
      sortPostWithComments.map(async (post) => {
        const author = await User.findById(post.authorId);

        return {
          _id: post._id,
          authorId: post.authorId,
          title: post.title,
          image: post.image,
          authorName: author.fullName,
          like: post.likePostId,
          comment: post.commentId,
        };
      })
    );

    res.status(200).json({
      posts: postDetails,
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

    // const comments = await Comment.findOne({ postComment: id });

    // if (!comments) return res.status(400).json("Not comment created yet");

    res.status(200).json({
      _id: post._id,
      authorId: post.authorId,
      title: post.title,
      image: post.image,
      like: post.likePostId,
      comment: post.commentId,
    });
  } catch (error) {
    console.log("Error in getPost controller", error.message);
    res.status(500).json("Internal server error");
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, image } = req.body;
    if (!image && !title)
      return res.status(400).json("Please fill all the fields");
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
    const { image, title } = req.body;

    // check value
    if (!id || (!image && !title))
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
      { image, title },
      { new: true }
    );
    if (updatedPost) {
      return res.status(200).json(updatedPost);
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

    const myPosts = await Post.find({ authorId: userId });

    if (!myPosts.length && !followings?.followingId?.length) {
      return res.status(400).json("No posts available.");
    }

    const postsPromises =
      followings?.followingId?.map((following) => {
        return Post.find({ authorId: following });
      }) || [];

    const followingPosts = await Promise.all(postsPromises);

    const allPosts = [...myPosts, ...followingPosts.flat()];

    allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const postDetailsPromises = allPosts.map(async (p) => {
      const author = await User.findById(p.authorId);
      return {
        _id: p._id,
        authorId: p.authorId,
        authorName: author.fullName,
        title: p.title,
        image: p.image,
        like: p.likePostId,
        comment: p.commentId,
      };
    });

    const postDetails = await Promise.all(postDetailsPromises);

    return res.status(200).json({
      posts: postDetails,
    });
  } catch (error) {
    console.log("Error in getPostHome controller", error.message);
    res.status(500).json("Internal server error");
  }
};
