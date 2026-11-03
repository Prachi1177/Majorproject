const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

router.get("/", async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
});

router.get("/new", isLoggedIn, (req,res)=>{
  res.render("listings/new.ejs");
});

router.post("/", isLoggedIn, validateListing, async (req,res)=>{
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", filename: "default" };
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
});

router.get("/:id", async (req,res)=>{
  const listing = await Listing.findById(req.params.id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
  if(!listing){ req.flash("error","Not found"); return res.redirect("/listings"); }
  res.render("listings/show.ejs",{listing});
});

router.get("/:id/edit", isLoggedIn, isOwner, async (req,res)=>{
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit.ejs",{listing});
});

router.put("/:id", isLoggedIn, isOwner, validateListing, async (req,res)=>{
  await Listing.findByIdAndUpdate(req.params.id, {...req.body.listing});
  req.flash("success","Updated!");
  res.redirect(`/listings/${req.params.id}`);
});

router.delete("/:id", isLoggedIn, isOwner, async (req,res)=>{
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success","Deleted!");
  res.redirect("/listings");
});

module.exports = router;