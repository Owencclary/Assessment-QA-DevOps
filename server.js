const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());

app.use(express.static(`${ __dirname}/public`))


var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '71fdf450589f4172a5d3a8bea261a872',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

app.use(rollbar.errorHandler());

app.get("/api/event-1", (req, res) => {
  try {
    throw new Error("Rollbar Event 1");
  } catch (error) {
    rollbar.error(error);
    res.sendStatus(500);
  }
})

app.get("/api/event-2", (req, res) => {
  try {
    throw new Error("Rollbar Event 2");
  } catch (error) {
    rollbar.error(error);
    res.sendStatus(500);
  }
});

app.get("/api/event-3", (req, res) => {
  try {
    setTimeout(() => {
      const asyncError = new Error("Rollbar Event 3");
      rollbar.error(asyncError);
      res.sendStatus(500);
    }, 1000);
  } catch (error) {
    rollbar.error(error);
    res.sendStatus(500);
  }
})

app.get("/api/event-4", (req, res) => {
  try {
    const customError = new Error("Rollbar Event 4");
    rollbar.error(customError);
    res.sendStatus(500);
  } catch (error) {
    rollbar.error(error);
    res.sendStatus(500);
  }
})


// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
