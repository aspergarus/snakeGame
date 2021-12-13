let size = 20;
let width = 30;
let height = 20;

let snake = {
	size: size,
	x: 0,
	y: 0,
	length: 1,
	colorHead: '#ff0000',
	colorTail: '#6f3f3f',
	direction: undefined,
	body: [],
	isDead: false,

	eatFood() {
		return this.x === food.x && this.y === food.y;
	},
	isOut() {
		return this.x < 0 || this.x >= width || this.y < 0 || this.y >= height;
	},
	occupiedCoord(x, y) {
		return this.x === x || this.y === y;
	},
	fillAllField() {
		// Check if snake has all cells of field
		return this.length === width * height;
	},
	eatSelf() {
		for (let pos of this.body) {
			if (pos.x === this.x && pos.y === this.y) {
				return true;
			}
		}
		return false;
	}
};

let food = {
	x: 0,
	y: 0,
	color: '#005500'
};

let game = {
	end: false,
	win: false,
	tick: 0,
	tickRate: 250,
};

let ctx;
let touch;

function initkeyBoard() {
	const keyMap = {
		37: "left",
		52: "left",
		38: "up",
		56: "up",
		40: "down",
		50: "down",
		39: "right",
		54: "right"
	};

	// document.addEventListener("touchmove", function(e) { console.log(e);});
	document.addEventListener("touchstart", function(e) {
		touch = e.changedTouches[0];
	});
	document.addEventListener("touchend", function(e) {
		const prevDirection = snake.direction;

		let endTouch = e.changedTouches[0];
		const diffX = endTouch.clientX - touch.clientX;
		const diffY = endTouch.clientY - touch.clientY;

		if (Math.abs(diffX) > Math.abs(diffY)) {
			if (diffX > 0) {
				snake.direction = 'right';
			} else {
				snake.direction = 'left';
			}
		} else {
			if (diffY > 0) {
				snake.direction = 'down';
			} else {
				snake.direction = 'up';
			}
		}

		fixDirection(prevDirection);
	});

	document.addEventListener("keydown", function(e) {
		const prevDirection = snake.direction;
		snake.direction = keyMap[e.which];

		fixDirection(prevDirection);
	});
}

function fixDirection(prevDirection) {
	if (prevDirection === 'left' && snake.direction === 'right') {
		snake.direction = 'left';
	}
	if (prevDirection === 'right' && snake.direction === 'left') {
		snake.direction = 'right';
	}
	if (prevDirection === 'up' && snake.direction === 'down') {
		snake.direction = 'up';
	}
	if (prevDirection === 'down' && snake.direction === 'up') {
		snake.direction = 'down';
	}
}

function initConfig() {
	let canvas = document.getElementById("game");
	canvas.width = width * snake.size;
	canvas.height = height * snake.size;

	ctx = canvas.getContext('2d');
	ctx.width = canvas.width;
	ctx.height = canvas.height;

	document.getElementById("config_btn").addEventListener("click", function() {
		snake.size = +document.getElementById("snake_size").value;
		snake.colorHead = document.getElementById("color_head").value;
		snake.colorTail = document.getElementById("color_tail").value;
		snake.direction = undefined;

		food.color = document.getElementById("color_food").value;
		width = +document.getElementById("width").value;
		height = +document.getElementById("height").value;

		canvas.width = width * snake.size;
		canvas.height = height * snake.size;
		ctx = canvas.getContext('2d');
		ctx.width = canvas.width;
		ctx.height = canvas.height;
		clearInterval(game.tick);

		startGame();
	});
}

function makeFood() {
	const unOccupiedField = getUnOccupiedField(snake);
	food.x = unOccupiedField.x;
	food.y = unOccupiedField.y;
}

function initField() {
	snake.x = getRandomInt(width);
	snake.y = getRandomInt(height);
	makeFood();
}

function makeMove() {
	let prevPos = {x: snake.x, y: snake.y};

	if (snake.direction == 'left') {
		snake.x--;
	}
	if (snake.direction == 'right') {
		snake.x++;
	}
	if (snake.direction == 'up') {
		snake.y--;
	}
	if (snake.direction == 'down') {
		snake.y++;
	}

	let newPos = {x: snake.x, y: snake.y};

	if (snake.eatFood()) {
		snake.body.push(prevPos);
		makeFood();
		snake.length++;
	} else {
		snake.body.push(prevPos);
		snake.body.splice(0, 1);
	}

	if (snake.isOut() || snake.eatSelf()) {
		snake.isDead = true;
	}
}

function checkEndGame() {
	game.end = false;
	if (snake.isDead) {
		game.end = true;
		game.win = false;
	}

	if (snake.fillAllField()) {
		game.end = true;
		game.win = true;	
	}

	if (game.end) {
		snake.isDead = false;
		snake.direction = '';
		snake.body = [];
		clearInterval(game.tick);
		startGame();
	}
}

function startGame() {
	initField();

	game.tick = setInterval(function () {
		ctx.clearRect(0, 0, ctx.width, ctx.height);
		makeMove();
		checkEndGame();
		draw();
	}, game.tickRate);
}

function draw() {
	// Draw the head
	ctx.fillStyle = snake.colorHead;
	ctx.fillRect(snake.x * snake.size, snake.y * snake.size, snake.size, snake.size);

	// Draw the tail
	for (let snakeEl of snake.body) {
		ctx.fillStyle = snake.colorTail;
		ctx.fillRect(snakeEl.x * snake.size, snakeEl.y * snake.size, snake.size, snake.size);		
	}

	// Draw food
	ctx.fillStyle = food.color;
	ctx.fillRect(food.x * snake.size, food.y * snake.size, snake.size, snake.size);
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function getUnOccupiedField(snake) {
	let field = [];

	for (let x = 0; x < width; x++) {
		let row = [];
		for (let y = 0; y < height; y++) {
			if (!snake.occupiedCoord(x, y)) {
				row.push(0);
			}
		}
		field.push(row);
	}

	const x = getRandomInt(field.length);
	const y = getRandomInt(field[x].length);

	return {x, y};
}

document.addEventListener("DOMContentLoaded", function() {
	initkeyBoard();
	initConfig();
	initField();

	startGame();
});
