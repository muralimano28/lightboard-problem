// Local data.
var currentUserId = null,
	gameData = null,
	oldGameData = null,
	baseURL = "",
	serverURL = "http://localhost:3000/",
	timer = null;

function ajaxPooling() {
	setInterval(function() {
		$.get(serverURL + gameData.id)
			.done(function(data) {
				gameData = data;
				prepareGameBoard();
			})
			.fail(function(error) {
				showErrorMsg(error.responseText, null, true);
			})
	}, 500);
}
function showErrorMsg(msg, time, dontHide) {
	var errormsgTimer = null;
	$("#errormsg").html(msg);

	if (!dontHide) {
		errormsgTimer = setInterval(function(){
			$("#errormsg").html("");
			clearInterval(errormsgTimer);
		}, (time) ? time : 3000);
	}
}
function changeCell(ev) {
	var id = ev.target.id,
		row = id.split("-")[1],
		col = id.split("-")[2];

	$.post(serverURL + gameData.id + "/change/" + currentUserId, {"row": row, "col": col})
		.done(function() {
			console.log("successfully changed");
		})
		.fail(function(err) {
			showErrorMsg(err.responseText);
		})
}
function startTimer(time, domNode) {
	var seconds = time;
	timer = window.setInterval(function() {
		if(seconds < 0 && timer) {
			clearInterval(timer);

			// Make request to release the lock.
			$.post(serverURL + gameData.id + "/release")
				.done(function(data) {
					// Change lock status field
					gameData.lock_status = 0;
					// Change locked to field
					gameData.locked_to = null;
					// Showing lock status.
					$("#lockstatus").html((gameData.lock_status === 0) ? "Unlocked" : "Locked");
					// Showing locked to field.
					$("#lockiswith").html((gameData.locked_to) ? gameData.users[gameData.locked_to].name : "No one. Grab it soon");
				})
				.fail(function(error) {
					// show error msg
					showErrorMsg(error.responseText);
				})
		} else {
			domNode.text(seconds);
			seconds--;
		}
	}, 1000);
}
function getLockFn() {
	// Clear previous error msg.
	$("#timermsg").html("");

	// Make request to get lock.
	$.post(serverURL + gameData.id + "/getlock/" + currentUserId)
		.done(function(data) {
			// Change lock status field
			gameData.lock_status = 1;
			// Change locked to field
			gameData.locked_to = currentUserId;
			// Start timer.
			startTimer(10, $("#timer"));
			// Showing lock status.
			$("#lockstatus").html((gameData.lock_status === 0) ? "Unlocked" : "Locked");
			// Showing locked to field.
			$("#lockiswith").html((gameData.locked_to) ? gameData.users[gameData.locked_to].name : "No one. Grab it soon");
		})
		.fail(function(error) {
			// Show error msg.
			showErrorMsg(error.responseText);
		})
}
function populateBoard() {
	var cells = gameData.cells;

	for (var i = 0; i < cells.length; i++) {
		for (var j = 0; j < cells[i].length; j++) {
			let id = "cells-" + i + "-" + j;

			$("#" + id).attr("class", (cells[i][j] === 0 ? "empty" : (cells[i][j] === 1) ? "user1" : "user2"))
		}
	}
}
function prepareGameBoard() {
	// Showing user name in dom.
	$("#playername").html(gameData.users[currentUserId].name);

	// Showing lock status.
	$("#lockstatus").html((gameData.lock_status === 0) ? "Unlocked" : "Locked");

	// Showing locked to field.
	$("#lockiswith").html((gameData.locked_to) ? gameData.users[gameData.locked_to].name : "No one. Grab it soon");

	// change class for get lock button.
	$("#lockbtn").attr("class", ((gameData.lock_status === 0) ? "active" : "disabled"));

	// prepare share link.
	if (window.location.search) {
		$("#sharediv").attr("class", "hide");
	} else {
		$("#sharelink").html(baseURL + "?" + gameData.id);
	}

	// Populate board.
	populateBoard();
}

function createGame(e) {
	e.preventDefault();

	// Get value from input dom.
	let name = document.getElementById("username").value,
		url = serverURL,
		data = null;

	if (window.location.search) {
		url = url + window.location.search.split("?")[1] + "/join";
	} else {
		url = url + "create";
	}
	$.post(url, {"username": name})
		.done(function(data) {
			// hide form and show the table with username.
			$("#createform").attr("class", "hide");

			// Populating local data.
			gameData = data;
			currentUserId = (window.location.search) ? Object.keys(data.users)[1] : Object.keys(data.users)[0];

			prepareGameBoard();

			$("#gameboard").toggleClass("hide ");
		})
		.fail(function(err, arg) {
			// Show error msg.
			showErrorMsg(err.responseText, null, true);
		});

	ajaxPooling();

	return false;
};

window.onload = function() {
	baseURL = window.location.href;

	if (window.location.search) {
		$("#submitbtn").text("Join game");
	}
}
