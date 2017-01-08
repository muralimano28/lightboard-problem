"use strict";

const Express = require("express");
const BodyParser = require("body-parser");

let App = Express();

// Dataset.
// Note: Using local variable instead of database.
let data = {};

// Mock data.
const GAME_DATA = {
	"id": "",
	"users": {},
	"cells": [],
	"lock_status": 0, // [0-means unlocked, 1-means locked]
	"locked_to": ""
};

// Loading middlewares.
App.use(BodyParser.urlencoded({ extended: true }));
App.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

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
	if (!req.body.username) {
		res.status(400).send("Username cannot be empty. Please give a username");
	} else {
		let id = new Date().getTime(),
			userId = new Date().getTime() + 10;

		data[id] = JSON.parse(JSON.stringify(GAME_DATA));
		data[id].id = id;
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

		res.send(data[id]);
	}
});

// Route to handle user joining existing game.
/*
 * req.body = {
 *     "username": "someusername"
 * }
 */
App.post("/:id/join", (req, res) => {
	let id = req.params.id;

	if (data[id]) {
		// Check if users limit has reached.
		let users = data[id].users,
			userLength = Object.keys(users).length;

		if (userLength === 2) {
			res.status(400).send("Sorry, only two people can play this game");
		} else {
			if (!req.body.username) {
				res.status(400).send("Username cannot be empty. Please give a username");
			}
			// Create second user in the game.
			let userId = new Date().getTime();

			data[id].users[userId] = {
				"name": req.body.username
			};

			res.send(data[req.params.id]);
		}
	} else {
		res.status(400).send("Game id doesn't exist. Please create a new game");
	}
});

App.get("/:id", (req, res) => {
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
		col = req.body.col;

	if (data[id]) {
		if (!data[id].users[userId]) {
			res.status(400).send("Invalid user id");
		} else {
			// lock status should be locked and it should be locked to the user who is making the change.
			if (data[id].lock_status === 1 && data[id].locked_to === userId) {
				if ((!row && row !== 0 ) || (!col && col !== 0) || row < -1 || row >= 10 || col < -1 || col >= 10) {
					res.status(400).send("Incorrect row or col value.");
				} else {

					let userValue = Object.keys(data[id].users).indexOf(userId) + 1,
						existingValue = data[id].cells[row][col];

					// If existing value is 0 then make it as userValue.
					// Else reset it to 0.
					if (existingValue === 0) {
						data[req.params.id].cells[row][col] = userValue;
					} else {
						data[req.params.id].cells[row][col] = 0;
					}
					res.send("Successfully changed the value in the cell");
				}
			} else {
				res.status(400).send("You don't have the lock. Please acquire the lock to make changes");
			}
		}
	} else {
		res.status(400).send("Game id doesn't exist. Please create a new game");
	}

});

App.post("/:id/getlock/:userId", (req, res) => {
	let id = req.params.id,
		userId = req.params.userId;

	if (data[id]) {
		if (data[id].users[userId]) {
			// If lock status is 0(ie: unlocked), then lock it to requesting user.
			// Else return error that it cannot be locked.
			if (data[id].lock_status === 0) {
				data[id].lock_status = 1;
				data[id].locked_to = req.params.userId;

				res.status(200).send("Successfully acquired the lock");
			} else {
				res.status(400).send("You can't acquired the lock, since it is already acquired by the other user");
			}
		} else {
			res.status(400).send("Invalid user id.");
		}
	} else {
		res.status(400).send("Invalid game id. Please create a new game");
	}
});

App.post("/:id/release", (req, res) => {
	let id = req.params.id;

	if (data[id]) {
		// If lock status is "locked"(ie: 1) then release the lock.
		if (data[id].lock_status === 1) {
			data[id].lock_status = 0;
			data[id].locked_to = null;

			res.status(200).send("Succssfully released the lock");
		} else {
			res.status(400).send("Lock is already released");
		}
	} else {
		res.status(400).send("Invalid game id. Please create a new game");
	}
});
