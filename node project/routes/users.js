const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../utils/verifyToken.js");
const createError = require("../utils/error.js");

// check auth
router.get("/check/auth", verifyToken, (req, res, next) => {
  res.send("hello user, you are logged in");
});

// check user
router.get("/:id/checkUser", verifyUser, (req, res, next) => {
  res.send("hello user, you are logged in and you can delete");
});

// check admin
router.get("/:id/checkAdmin", verifyAdmin, (req, res, next) => {
  res.send("hello admin, you are logged in and you can delete all");
});

// update user
router.put("/:id", verifyUser, async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        next(err);
      }
    } else {
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account has been updated");
      } catch (err) {
        next(err);
      }
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});

// delete user
router.delete("/:id", verifyUser, async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});

// get a user
router.get("/:id", verifyUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    next(err);
  }
});

//get friends
router.get("/:id/friends", verifyUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    next(err);
  }
});

// follow a user
router.put("/:id/follow", verifyUser, async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("You allready follow this user");
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// unfollow a user
router.put("/:id/unfollow", verifyUser, async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("You can't unfollow this user");
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
