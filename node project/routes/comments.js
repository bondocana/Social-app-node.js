const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment.js");
const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../utils/verifyToken.js");
const createError = require("../utils/error.js");

//create a comment
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    next(err);
  }
});

//update a comment
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId === req.body.userId || req.body.isAdmin) {
      await comment.updateOne({ $set: req.body });
      res.status(200).json("The comment has been updated");
    } else {
      res.status(403).json("You can update only your comment");
    }
  } catch (err) {
    next(err);
  }
});

//delete a comment
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId === req.body.userId || req.body.isAdmin) {
      await comment.deleteOne({ $set: req.body });
      res.status(200).json("The comment has been deleted");
    } else {
      res.status(403).json("You can delete only your comment");
    }
  } catch (err) {
    next(err);
  }
});

//like or dislike a comment
router.put("/:id/like", verifyToken, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment.likes.includes(req.body.userId)) {
      await comment.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The comment has been liked");
    } else {
      await comment.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The comment has been disliked");
    }
  } catch (err) {
    next(err);
  }
});

//get a comment
router.get("/:id", async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
