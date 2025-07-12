const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

const TITLES = [
  "Lorem Ipsum",
  "Dolor Sit Amet",
  "Consectetur Adipiscing",
  "Sed Do Eiusmod",
  "Ut Labore",
  "Minim Veniam",
  "Nostrud Exercitation",
  "Duis Aute Irure",
  "Cillum Dolore",
  "Fugiat Nulla Pariatur",
];

const PHRASE_STARTS = [
  "Lorem ipsum",
  "Consectetur",
  "Sed do eiusmod",
  "Ut enim",
  "Quis nostrud",
  "Duis aute",
  "Excepteur sint",
  "Ut labore",
  "Velit esse",
  "Cillum dolore",
];

const PHRASE_MIDDLES = [
  "dolor sit amet",
  "adipiscing elit",
  "tempor incididunt",
  "magna aliqua",
  "minim veniam",
  "ullamco laboris",
  "aliquip ex ea",
  "commodo consequat",
  "reprehenderit in voluptate",
  "fugiat nulla pariatur",
];

const PHRASE_ENDS = [
  "ut labore et dolore magna aliqua.",
  "exercitation ullamco laboris nisi.",
  "in reprehenderit in voluptate velit.",
  "eu fugiat nulla pariatur.",
  "ex ea commodo consequat.",
  "cupidatat non proident.",
  "sunt in culpa qui officia.",
  "deserunt mollit anim id est laborum.",
  "velit esse cillum dolore.",
  "occaecat cupidatat non proident.",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

function generateRandomSentence() {
  return `${randomPick(PHRASE_STARTS)} ${randomPick(PHRASE_MIDDLES)} ${randomPick(PHRASE_ENDS)}`;
}

app.get("/api/litipsum/:count", (req, res) => {
  const maxCount = 10;
  const count = Math.max(1, Math.min(Number(req.params.count), maxCount));
  const title = TITLES[getRandomInt(0, TITLES.length - 1)];
  const text = Array.from({ length: count }, generateRandomSentence);
  res.json({
    title,
    text,
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
