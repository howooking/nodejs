const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/yelpCamp")
  .then(() => {
    console.log("mongo connection open");
  })
  .catch((err) => {
    console.log("mongo error happened");
    console.log(err);
  });

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seeDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      name: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dg1opcrul/image/upload/v1659188600/YelpCamp/irr8bcksjmyngssrazur.png",
          filename: "YelpCamp/irr8bcksjmyngssrazur",
        },
        {
          url: "https://res.cloudinary.com/dg1opcrul/image/upload/v1659188600/YelpCamp/nvf3zmti6ytunjruy3um.png",
          filename: "YelpCamp/nvf3zmti6ytunjruy3um",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat accusantium voluptates dolore nemo distinctio doloremque fugit modi facilis quaerat rerum aliquam reprehenderit ab, architecto incidunt soluta praesentium fugiat quae cupiditate.",
      price: randomPrice,
      author: "62e11b598ba7f15b5527611d",
    });
    await camp.save();
  }
};
seeDB();
