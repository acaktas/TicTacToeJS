const PLAYER_TOKEN = 'X';
const COMPUTER_TOKEN = 'O';

$(document).ready(function () {
    const grid = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];

    function isGameOver(newGrid) {
        // check horizontal
        for (var i = 0; i < 3; i++) {
            if (newGrid[i][0] !== ' ' &&
                newGrid[i][0] === newGrid[i][1] &&
                newGrid[i][0] === newGrid[i][2]) {
                return newGrid[i][0];
            }
        }

        // check vertical
        for (var j = 0; j < 3; j++) {
            if (newGrid[0][j] !== ' ' &&
                newGrid[0][j] === newGrid[1][j] &&
                newGrid[0][j] === newGrid[2][j]) {
                return newGrid[0][j];
            }
        }

        // check diagonal - top left bottom right
        if (newGrid[0][0] !== ' ' &&
            newGrid[0][0] === newGrid[1][1] &&
            newGrid[0][0] === newGrid[2][2]) {
            return newGrid[0][0];
        }

        // check diagonal - bottom left top right
        if (newGrid[2][0] !== ' ' &&
            newGrid[2][0] === newGrid[1][1] &&
            newGrid[2][0] === newGrid[0][2]) {
            return newGrid[2][0];
        }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (newGrid[i][j] === ' ') {
                    return false;
                }
            }
        }

        return null;
    };

    function minmax(newGrid, depth, player) {
        const gameState = isGameOver(newGrid);

        if (gameState === false) {
            const values = [];

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    const gridCopy = _.cloneDeep(newGrid);
                    if (gridCopy[i][j] !== ' ') continue;
                    gridCopy[i][j] = player;
                    const value = minmax(gridCopy, depth + 1, (player === PLAYER_TOKEN) ? COMPUTER_TOKEN : PLAYER_TOKEN);
                    values.push({
                        cost: value,
                        cell: {
                            i: i,
                            j: j
                        }
                    });
                }
            }

            if (player === COMPUTER_TOKEN) {
                const max = _.maxBy(values, (v) => {
                    return v.cost;
                });
                if (depth === 0) {
                    return max.cell;
                }
                else {
                    return max.cost;
                }
            }
            else {
                const min = _.minBy(values, (v) => {
                    return v.cost;
                });
                if (depth === 0) {
                    return min.cell;
                }
                else {
                    return min.cost;
                }
            }
        }
        else if (gameState === null) {
            return 0;
        }
        else if (gameState === PLAYER_TOKEN) {
            return depth - 10;
        }
        else if (gameState === COMPUTER_TOKEN) {
            return 10 - depth;
        }
    }

    function moveIA() {
        return minmax(grid, 0, COMPUTER_TOKEN);
    }

    $('.col').click(function () {
        var $this = $(this);
        $this.html(PLAYER_TOKEN);
        const i = $this.data('i');
        const j = $this.data('j');
        grid[i][j] = PLAYER_TOKEN;

        let gameState = isGameOver(grid);
        if (gameState) {
            alert('game over: ' + gameState);
            return;
        }
        else {
            const move = moveIA();
            if (move !== 0) {
                grid[move.i][move.j] = COMPUTER_TOKEN;
                $('.col[data-i=' + move.i + '][data-j=' + move.j + ']').html(COMPUTER_TOKEN);
            };
        }

        gameState = isGameOver(grid);
        if (gameState) {
            alert('game over: ' + gameState);
        }
    });

    $('#restart').click(function () {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                grid[i][j] = ' ';
                $('.col[data-i=' + i + '][data-j=' + j + ']').html('&nbsp');
            }
        }
    });
});