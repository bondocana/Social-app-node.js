const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../utils/verifyToken.js");
const createError = require("../utils/error.js");

//create a post
router.post("/", verifyToken, async (req, res, next) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    next(err);
  }
});

//update a post
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId || req.body.isAdmin) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (err) {
    next(err);
  }
});

//delete a post
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId || req.body.isAdmin) {
      await post.deleteOne({ $set: req.body });
      res.status(200).json("The post has been deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (err) {
    next(err);
  }
});

//like or dislike a post
router.put("/:id/like", verifyToken, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    next(err);
  }
});

//get a post
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

//get timeline posts
router.get("/timeline/all", async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    next(err);
  }
});

//get user's all posts
router.get("/profile/:username", verifyAdmin, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
