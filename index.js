"use strict";

const Express = require("express");
const BodyParser = require("body-parser");

let App = Express();

// Dataset.
// Note: Using local variable instead of database.
const GAME_DATA = {
	"users": {},
	"lock_status": 0, // [0-means unlocked, 1-means locked]
	"locked_to": ""
};
let data = {};

// Loading middlewares.
App.use(BodyParser.urlencoded({ extended: true }));

App.listen(3000, () => {
	console.log("Listening at port 3000");
});

// Route to create a new game.
/*
 * req.body = {
 *     "username": "someusername"
 * }
 */
App.post("/create", (req, res) => {
	console.log("creating a new game");
	let id = new Date().getTime(),
		userId = new Date().getTime() + 10;

	data[id] = JSON.parse(JSON.stringify(GAME_DATA));
	data[id].users[userId] = {
		"name": req.body.username
	}

	// Create 10x10 matrix.
	for (let i = 0; i < 10; i++) {
		let eachRow = [];
		for (let j = 0; j < 10; j++) {
			eachRow.push(0);
		}
		data[id].cells.push(eachRow);
	}

	console.log("data[id].cells: ", data[id].cells);
	res.send(data[id]);
});

// Route to handle user joining existing game.
/*
 * req.body = {
 *     "username": "someusername"
 * }
 */
App.post("/:id/join", (req, res) => {
	if (Object.keys(data[req.params.id].users).length === 2) {
		res.status(400).send("Sorry, only two people can play this game.");
	} else {
		// Create second user in the game.
		let userId = new Date().getTime();
		data[req.params.id].users[userId] = {
			"name": req.body.username
		};

		res.send(data[req.params.id]);
	}
});

App.get("/:id", (req, res) => {
	console.log("sending-data");
	if (data[req.params.id]) {
		res.send(data[req.params.id]);
	} else {
		res.status(400).send("Game id doesnt exist. Create a new game");
	}
});

/*
 * req.body = {
 *     "row": 1,
 *     "col": 1
 * }
 */
App.post("/:id/change/:userId", (req, res) => {
	let id = req.params.id,
		userId = req.params.userId,
		row = req.body.row,
		col = req.body.col,
		userValue = Object.keys(data[id].users).indexOf(userId) + 1,
		existingValue = data[id].cells[row][col];

	// If existing value is 0 then make it as userValue.
	// Else reset it to 0.
	if (existingValue === 0) {
		data[req.params.id].cells[row][col] = userValue;
	} else {
		data[req.params.id].cells[row][col] = 0;
	}

	console.log("user: " + userId + " changed value at " + row + " and " + col);
	// Ending the response instead of sending data because, for every 150ms front-end will make a request to get data.
	res.end();
});

App.post("/:id/getlock/:userId", (req, res) => {
	data[req.params.id].lock_status = 1;
	data[req.params.id].locked_to = req.params.userId;

	console.log("locked to " + req.params.userId);
	// Ending the response instead of sending data because, for every 150ms front-end will make a request to get data.
	res.end();
});

App.post("/:id/release", (req, res) => {
	data[req.params.id].lock_status = 0;
	data[req.params.id].locked_to = null;

	console.log("released lock");
	console.log("data: ", data[req.param.id]);
	// Ending the response instead of sending data because, for every 150ms front-end will make a request to get data.
	res.end();
});
