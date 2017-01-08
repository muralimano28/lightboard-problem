# lightboard-problem

This is a javascirpt lightboard-problem I got to know from a friend, who attended [JSFoo2016] in bangalore. This problem was asked by [collective.com]

# Problem statement

The task it to create a simple browser-based Light Board application. There are two users (two different machines or browser) who share a Light board of grid 10x10 with each cell being 50px x 50px. The light boards will follow these rules.

  - Initially all the cells are turned off (while color). When a user clicks on any cell, it turns to a particular color (red for user 1, yellow for user 2).
  - Both the users can click and light the cells on the board at any position.
  - If the user clicks on an already lit cell, it turns off (white color).
  - Only one user can light the cells at a given time. There should be a button to acquire a lock.
  - About the lock:
    - A user is able to light a cell only after they have successfully acquired the lock. The other user has to wait until the lock is released before he can light any cell on the board.
    - As soon as a user lights one cell, the lock is released and either of the user can again acquire the lock to light the cells.
    - The lock has the timeout of 120 seconds. If a user acquires a lock and does no activity, the lock gets auto released in 120 seconds.
  - Soon after a user lights or dims a cell on the board, the changes are reflected in the other user's sceen, without refreshing the page(Hint: you can use Ajax pooling for this)
  
The lightbox should work on both IE and Firefox. You can use any javascript library eg.Prototype, jQuery etc. Local storage can be used for saving preferences.

# Setup
  - Clone the repo
  ```
  $ git clone 
  ```
  - Install necessary libraries from package.json
  ```
  $ npm install
  ```
  - Run backend node-express server
  ```
  $ node index.js
  ```
  - Run http-server for front-end
  ```
  $ http-server
  ```
  - Goto ``` http://localhost:8080 ```
  
# Features yet to complete
  - Beautifying front-end.
  - Configuring rows and columns dynamically (Right now, its fixed 10x10).
  - Any-number-of-player support (Right now only two can play at a time).
  - Feature where each user can select their own colors from color palette.

[JSFoo2016]: <http://jsfoo.in>
[collective.com]: <http://www.collective.com/>
