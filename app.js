// Local data.
var currentUserId = null,
	gameData = null,
	oldGameData = null,
	baseURL = "",
	serverURL = "http://localhost:3000/",
	timer = null;

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
				})
				.fail(function(error) {
					// show error msg
				})
		} else {
			domNode.text(seconds);
			seconds--;
		}
	}, 1000);
}
function getLockFn() {
	// Make request to get lock.
	$.post(serverURL + gameData.id + "/getlock/" + currentUserId)
		.done(function(data) {
			// Change lock status field
			gameData.lock_status = 1;
			// Change locked to field
			gameData.locked_to = currentUserId;
			// Start timer.
			startTimer(10, $("#timer"));
		})
		.fail(function(error) {
			// Show error msg.
		})
}
function populateBoard() {
	var cells = gameData.cells;

	for (var i = 0; i < cells.length; i++) {
		for (var j = 0; j < cells[i].length; j++) {
			let id = "cell-" + i + "-" + j;

			$("#" + id).attr("class", (cells[i][j] === 0 ? "empty" : (cells[i][j] === 1) ? "user1" : "user2"))
		}
	}
}
function prepareGameBoard() {
	console.log("gameData: ", gameData);
	console.log("currentUserId: ", currentUserId);
	// Showing user name in dom.
	$("#playername").html(gameData.users[currentUserId].name);

	// Showing lock status.
	$("#lockstatus").html((gameData.lock_status === 0) ? "Unlocked" : "Locked");

	// Showing locked to field.
	$("#lockiswith").html((gameData.locked_to) ? gameData.users[gameData.locked_to].name : "No one. Grab it soon");

	// change class for get lock button.
	$("#lockbtn").attr("class", ((gameData.lock_status === 0) ? "active" : "disabled"));

	// prepare share link.
	$("#sharelink").html(baseURL + "?" + gameData.id);

	// Populate board.
	populateBoard();
}

function createGame(e) {
	e.preventDefault();

	// Get value from input dom.
	let name = document.getElementById("username").value;

	$.post(serverURL + "create", {"username": name})
		.done(function(data) {
			// hide form and show the table with username.
			$("#createform").attr("class", "hide");

			// Populating local data.
			gameData = data;
			currentUserId = Object.keys(data.users)[0];

			prepareGameBoard();

			$("#gameboard").toggleClass("hide ");
		})
		.fail(function(err, arg) {
			// Show error msg.
			$("#errormsg").html(err.responseText);
		});

	return false;
};

window.onload = function() {
	baseURL = window.location.href;
	// console.log("loca: ", window.location);
	// if (window.location.search) {
	// 	var gameId = window.location.search.split("?")[1];

	// 	// Hide other pages and show loading screen.
	// 	$("#createform").attr("class", "hide");
	// 	$("#loadingbar").attr("class", "");

	// 	// Make request with gameId.
	// 	$.get("http://127.0.0.1:3000/" + gameId)
	// 		.done(function(data) {
	// 			gameData = data;
	// 			currentUserId = Object.keys(data.users)[0];

	// 			prepareGameBoard();

	// 			$("#gameboard").toggleClass("hide ");
	// 		})
	// 		.fail(function(error) {
	// 			// Show error msg and show create form.
	// 			$("#loadingbar").attr("class", "hide");
	// 			$("#errormsg").html(err.responseText);
	// 			$("#createform").attr("class", "");
	// 		})
	// }
}
