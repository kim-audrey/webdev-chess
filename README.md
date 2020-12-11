# webdev-chess
An online chess gaming platform where you can join your friends in private rooms to play!

## Usage
### Create A New Game
To create your own game room, press the "Make Your Own Game" button on the Login page. You will be given a game code to share with your opponent. 

### Entering a Pre-existing Game
If given a game code, enter the code into the text box after "Enter Game Code Here:" and you will be able to join the game of your opponent. 

### Playing The Game
To move pieces, click your piece and then the square which you'd like your piece to move to.

## How the Code Works
### Selecting Pieces
After selecting a piece, the next tile selected sends a pair of (startposition, endposition) to determine if the move is valid


### Determining if a move is valid
A lottta if statements if a turn can be transmitted at all on that side, if the piece selected is of the side of the client, and if it is a legal move of the piece selected.

### Color assignment
Colors are randomly assigned. 



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
