// Dependencies
const express = require("express");

const reviews = express.Router({ mergeParams: true });

const { getBookmark } = require("../queries/bookmarks.js");

// Queries
const {
  getAllReviews,
  getReview,
  newReview,
  deleteReview,
  updateReview,
} = require("../queries/reviews");

// INDEX
reviews.get("/", async (req, res) => {
  const { bookmark_id } = req.params;
  const allReviews = await getAllReviews(bookmark_id);
  const bookmark = await getBookmark(bookmark_id);

  if (bookmark.id) {
    res.status(200).json({ ...bookmark, allReviews });
  } else {
    res.status(500).json({ error: "Bookmark not found or server error" });
  }

  //   if (allReviews[0]) {
  //     res.status(200).json(allReviews);
  //   } else {
  //     res.status(500).json({ error: "server error" });
  //   }
});

// SHOW
reviews.get("/:id", async (req, res) => {
  const { bookmark_id, id } = req.params;
  const review = await getReview(id);
  const bookmark = await getBookmark(bookmark_id);

  if (review) {
    res.json({ ...bookmark, review });
  } else {
    res.status(404).json({ error: "not found" });
  }
});

// UPDATE
reviews.put("/:id", async (req, res) => {
  const { bookmark_id, id } = req.params;
  const updatedReview = await updateReview({id, ...req.body, bookmark_id});
  if (updatedReview.id) {
    res.status(200).json(updatedReview);
  } else {
    res.status(404).json("Review not found");
  }
});

// CREATE

reviews.post("/", async (req, res) => {
  const { bookmark_id } = req.params;
  const review = await newReview({ ...req.body, bookmark_id });
  res.status(200).json(review);
});

// DELETE
reviews.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedReview = await deleteReview(id);
  if (deletedReview.id) {
    res.status(200).json(deletedReview);
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});

// TEST JSON NEW
// {
//     "reviewer":"Lou",
//      "title": "Fryin Better",
//      "content": "With the great tips and tricks I found here",
//      "bookmark_id": "2",
//      "rating": "4"
// }
module.exports = reviews;
