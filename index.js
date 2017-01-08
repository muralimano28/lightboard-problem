"use strict";

const Express = require("express");
const BodyParser = require("body-parser");

let App = Express();

// Dataset.
// Note: Using local variable instead of database.
let data = {};

// Loading middlewares.
App.use(BodyParser.urlencoded({ extended: true }));

App.listen(3000, () => {
	console.log("Listening at port 3000");
});

App.get("/:id", (req, res) => {
	console.log("req.params: ", req.params);
	res.send("Creating new game with id " + req.params.id);
});

App.post("/:id/change", (req, res) => {
	console.log("req.params: ", req.params);
	res.send("Changes in game id: " + req.params.id);
});

App.post("/:id/release", (req, res) => {
	console.log("req.params: ", req.params);
	res.send("release lock for game " + req.params.id);
});
