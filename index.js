"use strict";

const Express = require("express");

let App = Express();

App.listen(3000, () => {
	console.log("Listening at port 3000");
});

App.get("/", (req, res) => {
	res.send("Hello world");
});
