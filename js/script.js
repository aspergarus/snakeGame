let field = {
	width: 0,
	height: 0,
	widthElSize: 20,
	background: "#2b2e32"
};

let snake = {
	size: 0,
	x: 0,
	y: 0,
	length: 1,
	colorHead: '#47ffe8',
	colorTail: '#27dfc8',
	direction: undefined,
	body: [],
	isDead: false,

	eatFood() {
		return this.x === food.x && this.y === food.y;
	},
	isOut() {
		return this.x < 0 || this.x >= field.width || this.y < 0 || this.y >= field.height;
	},
	occupiedCoord(x, y) {
		for (let pos of this.body) {
			if (pos.x === x && pos.y === y) {
				return true;
			}
		}

		return this.x === x || this.y === y;
	},
	randomFreeCell() {
		let freeCells = [];

		for (let x = 0; x < field.width; x++) {
			for (let y = 0; y < field.height; y++) {
				if (!snake.occupiedCoord(x, y)) {
					freeCells.push({x, y});
				}
			}
		}

		return freeCells[getRandomInt(freeCells.length)];
	},
	fillAllField() {
		return this.length === field.width * field.height;
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
	color: '#F77F7F'
};

let game = {
	end: false,
	win: false,
	tick: 0,
	tickRate: 200,

	run() {
		clearInterval(this.tick);
		this.tick = setInterval(this.process, this.tickRate);
	},
	process() {
		makeMove();
		checkEndGame();
		draw();
	}
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

	let screenWidth, screenHeight;

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		// Mobile
		screenWidth = screen.availWidth;
		screenHeight = screen.availHeight;
	} else {
		// Desktop
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
	}

	snake.size = Math.floor(screenWidth / field.widthElSize);

	canvas.width = screenWidth - screenWidth % snake.size;
	canvas.height = screenHeight - screenHeight % snake.size;

	field.width = canvas.width / snake.size;
	field.height = canvas.height / snake.size;

	ctx = canvas.getContext('2d');
	ctx.width = canvas.width;
	ctx.height = canvas.height;
	snake.direction = undefined;
}

function makeFood() {
	const freeCell = snake.randomFreeCell();
	food.x = freeCell.x;
	food.y = freeCell.y;
}

function initField() {
	snake.x = getRandomInt(field.width);
	snake.y = getRandomInt(field.height);
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
		debugger;
		snake.isDead = true;
	}
}

function checkEndGame() {
	game.end = false;
	if (snake.isDead) {
		debugger;
		game.end = true;
		game.win = false;
	}

	if (snake.fillAllField()) {
		game.end = true;
		game.win = true;	
	}

	if (game.end) {
		debugger;
		snake.isDead = false;
		snake.direction = '';
		snake.body = [];
		clearInterval(game.tick);
		initField();
		game.run();
	}
}

function draw() {
	ctx.fillStyle = field.background;
	ctx.fillRect(0, 0, ctx.width, ctx.height);

	// Draw the head
	ctx.fillStyle = snake.colorHead;
	ctx.fillRect(snake.x * snake.size + 1, snake.y * snake.size + 1, snake.size - 1, snake.size - 1);

	// Draw the tail
	for (let snakeEl of snake.body) {
		ctx.fillStyle = snake.colorTail;
		ctx.fillRect(snakeEl.x * snake.size + 1, snakeEl.y * snake.size + 1, snake.size - 1, snake.size - 1);
	}

	// Draw food
	ctx.fillStyle = food.color;
	ctx.fillRect(food.x * snake.size + 1, food.y * snake.size + 1, snake.size - 1, snake.size - 1);
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function run() {
	initConfig();
	initField();
	game.run();
}

document.addEventListener("DOMContentLoaded", function() {
	initkeyBoard();
	window.addEventListener("orientationchange", run);
	
	run();
});
