var Game = React.createClass({
    getInitialState: function() {
        if (localStorage["2048"]) {
            var initialState = JSON.parse(localStorage["2048"]);
        } else if (localStorage["2048-best"]) {
            var initialState = {
                tiles: [],
                bestScore: localStorage["2048-best"],
                score: 0,
                turn: 0
            }
            initialState.tiles = initialState.tiles.concat([
                this.getRandomTile(initialState.tiles)
            ])
            initialState.tiles = initialState.tiles.concat([
                this.getRandomTile(initialState.tiles)
            ])
        } else {
            var initialState = {
                tiles: [],
                bestScore: 0,
                score: 0,
                turn: 0
            }
            initialState.tiles = initialState.tiles.concat([
                this.getRandomTile(initialState.tiles)
            ])
            initialState.tiles = initialState.tiles.concat([
                this.getRandomTile(initialState.tiles)
            ])
        }
        return initialState;
    },
    componentDidMount: function() {
        var fired = false;
        var that = this;
        document.onkeydown = function(e) {
            if (!fired) {
                fired = true;
                that.move(e);
            }
        };
        document.onkeyup = function() {
            fired = false;
        };
    },
    getTilesFromColumn: function(column) {
        return this.state.tiles.filter(function(tile) {
            return tile.x === column
        })
    },
    getTilesFromLine: function(line) {
        return this.state.tiles.filter(function(tile) {
            return tile.y === line
        })
    },
    generateNewTile: function(tiles) {
        return tiles = tiles.concat([
            this.getRandomTile(tiles)
        ])
    },
    move: function(event) {
        var that = this;
        var left = 37;
        var up = 38;
        var right = 39;
        var down = 40;
        var moved = false;
        var res;
        if (event.keyCode == down) {
            for (var i = 4; i >= 1; i--) {
                var tiles = that.getTilesFromLine(i)
                tiles.forEach(function(tile) {
                    res = that.moveTileDown(tile)
                    moved = moved || res;
                })
            }
        }
        if (event.keyCode == up) {
            var res;
            for (var i = 1; i <= 4; i++) {
                var tiles = that.getTilesFromLine(i)
                tiles.forEach(function(tile) {
                    res = that.moveTileUp(tile)
                    moved = moved || res;
                })
            }
        }
        if (event.keyCode == right) {
            for (var i = 4; i >= 1; i--) {
                var tiles = that.getTilesFromColumn(i)
                tiles.forEach(function(tile) {
                    res = that.moveTileRight(tile)
                    moved = moved || res;
                })
            }
        }
        if (event.keyCode == left) {
            for (var i = 1; i <= 4; i++) {
                var tiles = that.getTilesFromColumn(i);
                tiles.forEach(function(tile) {
                    res = that.moveTileLeft(tile)
                    moved = moved || res;
                })
            }
        }
        if (moved) {
            that.setState({
               tiles: that.generateNewTile(that.state.tiles),
               turn: that.state.turn + 1 || 0
            })
        }
        that.setState({
            tiles: _.sortBy(that.state.tiles, function(n) {
                return n.num;
            })
        })
        var array = {
            tiles: that.state.tiles,
            bestScore: that.state.bestScore,
            score: that.state.score,
            turn: that.state.turn
        }
        console.log(array);
        localStorage["2048"] = JSON.stringify(array);
        this.checkGameOver();
    },
    moveTileDown: function(tile) {
        if (tile.y != 4) {
            if (this.checkTile(tile.x, tile.y + 1)) {
                if (tile.value == this.getTile(tile.x, tile.y + 1).value) {
                    var res = this.mergeTile(tile, this.getTile(tile.x, tile.y + 1));
                    return {
                        'action': 'merge'
                    }
                }
                return false
            } else {
                tile.y++
                    this.moveTileDown(tile)
                if (tile.value == this.getTile(tile.x, tile.y + 1).value) {
                    var res = this.mergeTile(tile, this.getTile(tile.x, tile.y + 1));
                    return {
                        'action': 'merge'
                    }
                }
                return tile
            }
        }
        return false;
    },
    moveTileUp: function(tile) {
        if (tile.y != 1) {
            if (this.checkTile(tile.x, tile.y - 1)) {
                if (tile.value == this.getTile(tile.x, tile.y - 1).value) {
                    var res = this.mergeTile(tile, this.getTile(tile.x, tile.y - 1));
                    return {
                        'action': 'merge'
                    }
                }
                return false
            } else {
                tile.y--
                    this.moveTileUp(tile)
                if (tile.value == this.getTile(tile.x, tile.y - 1).value) {
                    var res = this.mergeTile(tile, this.getTile(tile.x, tile.y - 1));
                    return {
                        'action': 'merge'
                    }
                }
                return tile
            }
        }
        return false;
    },
    moveTileRight: function(tile) {
        if (tile.x != 4) {
            if (this.checkTile(tile.x + 1, tile.y)) {
                if (tile.value == this.getTile(tile.x + 1, tile.y).value) {
                    var res = this.mergeTile(tile, this.getTile(tile.x + 1, tile.y));
                    return {
                        'action': 'merge'
                    }
                }
                return false
            } else {
                tile.x++
                    this.moveTileRight(tile)
                if (tile.value == this.getTile(tile.x + 1, tile.y).value) {
                    var res = this.mergeTile(tile, this.getTile(tile.x + 1, tile.y));
                    return {
                        'action': 'merge'
                    }
                }
                return tile
            }
        }
        return false;
    },
    moveTileLeft: function(tile) {

        if (tile.x != 1) {
            if (this.checkTile(tile.x - 1, tile.y)) {
                if (tile.value == this.getTile(tile.x - 1, tile.y).value) {
                    var res = this.mergeTile(tile, this.getTile(tile.x - 1, tile.y));
                    return {
                        'action': 'merge'
                    }
                }
                return false
            } else {
                tile.x--
                this.moveTileLeft(tile)
                if (tile.value == this.getTile(tile.x - 1, tile.y).value) {
                    var res = this.mergeTile(tile, this.getTile(tile.x - 1, tile.y));
                    return {
                        'action': 'merge'
                    }
                }
                return tile
            }
        }
        return false;
    },
    mergeTile: function(tile1, tile2) {
        if(tile1.mergedTurn == this.state.turn || tile2.mergedTurn == this.state.turn){
            return;
        }
        var tileValue = tile1.value;
        var newValue = tileValue * 2;
        var newScore = this.state.score + newValue;
        this.setState({
            score: newScore
        });
        if (newScore > this.state.bestScore) {
            this.setState({
                bestScore: newScore
            });
        }
        newValue = newValue.toString();
        this.setState({
            tiles: this.state.tiles.filter(function(tile) {
                if (tile.num == tile1.num || tile.num == tile2.num) {
                    return false
                } else {
                    return true
                }
            })
        })
        var maxTile = _.maxBy(this.state.tiles, function(o) {
            return o.num;
        }) || {
            num: 0
        };
        var mergedTile = {
            'value': newValue,
            num: maxTile.num + 1,
            'x': tile2.x,
            'y': tile2.y,
            merged: true,
            mergedTurn: this.state.turn
        }
        this.setState({
            tiles: this.state.tiles.concat(mergedTile)
        })
    },
    checkTile: function(x, y) {
        for (var i = 0; i < this.state.tiles.length; i++) {
            if (this.state.tiles[i].x == x && this.state.tiles[i].y == y) return true
        }
        return false
    },
    getTile: function(x, y) {
        for (var i = 0; i < this.state.tiles.length; i++) {
            if (this.state.tiles[i].x == x && this.state.tiles[i].y == y) return this.state.tiles[i]
        }
        return false
    },
    getRandomTile: function(tiles) {
        tiles = this.state ? this.state.tiles : tiles;
        var xRand = Math.floor(Math.random() * 4) + 1;
        var yRand = Math.floor(Math.random() * 4) + 1;
        var initial = ['2', '4'];
        var nbRand = initial[Math.floor(Math.random() * (2 - 0) + 0)];
        var filterTile = tiles.filter(function(tile) {
            return xRand === tile.x && yRand === tile.y
        });
        if (filterTile.length > 0) {
            return this.getRandomTile(tiles)
        }
        var maxTile = _.maxBy(tiles, function(o) {
            return o.num;
        }) || {
            num: 0
        };
        return {
            'value': nbRand,
            num: maxTile.num + 1,
            'x': xRand,
            'y': yRand,
            'mergedTurn': false
        }
    },
    getGrid: function() {
        return (
            [0, 1, 2, 3].map(function(x) {
                return ( 
                    <div className = "grid-row" key={ x }> 
                    {
                        [0, 1, 2, 3].map(function(y) {
                            return <div className = "grid-cell" key = { x + "-" + y }></div>
                        })
                    } 
                    </div>
                )
            })
        )
    },
    retry: function() {
        var elems = document.getElementsByClassName("game-message");
        for (var i = 0; i < elems.length; i += 1) {
            elems[i].style.display = 'none';
        }
        localStorage["2048-best"] = this.state.bestScore;
        localStorage.removeItem('2048');
        this.state = null;
        this.setState(this.getInitialState())
    },
    checkGameOver: function() {
        if (!this.movesAvailable()) {
            var elems = document.getElementsByClassName("game-message");
            for (var i = 0; i < elems.length; i += 1) {
                elems[i].style.display = 'block';
            }
        } else {
            return false;
        }
    },
    getVector: function(direction) {
        var map = {
            0: {
                x: 0,
                y: -1
            }, // Up
            1: {
                x: 1,
                y: 0
            }, // Right
            2: {
                x: 0,
                y: 1
            }, // Down
            3: {
                x: -1,
                y: 0
            } // Left
        };
        return map[direction];
    },
    movesAvailable: function() {
        if (this.state.tiles.length >= 16) {
            var tile;
            for (var i = 1; i < 5; i++) {
                for (var j = 1; j < 5; j++) {
                    tile = this.getTile(i, j);
                    if (tile) {
                        for (var direction = 0; direction < 4; direction++) {
                            var vector = this.getVector(direction);
                            var other = this.getTile(i + vector.x, j + vector.y);
                            if (other.value == tile.value) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        } else {
            return true
        }
    },
    render: function() {
        var tilepositions = this.state.tiles.map(function(tile) {
            return tile.x + " " + tile.y;
        })
        if (_.uniq(tilepositions).length !== tilepositions.length) {
            throw new Error("doublon")
        }
        return ( 
            <div> 
                <div className="heading">
                    <div className="scores-container">
                        <div className="score-container"> 
                            { this.state.score } 
                        </div> 
                        <div className = "best-container"> 
                            { this.state.bestScore } 
                        </div>
                    </div> 
                </div> 
                <div className="above-game">
                    <p className="game-intro">Fusionne les cases pour arriver à <strong>2048</strong></p> 
                    <a className="restart-button" onClick= { this.retry }>Rejouer</a>
                </div> 
                <div className="game-container">
                    <div className="game-message game-over">
                        <p>Tu as perdu!</p>
                    <div className="lower">
                        <a className="retry-button" onClick={ this.retry }>Recommence!</a>
                    </div> 
                </div> 
                <div className="grid-container"> 
                    { this.getGrid() }
                </div> 
                <div className="tile-container" key="tile-container"> 
                    {
                        this.state.tiles.map(function(tile, i) {
                            var style = "tile tile-" + tile.value + " tile-position-" + tile.x + "-" + tile.y
                            return ( 
                                <div className={ style } key={ tile.num }> 
                                    <div className="tile-inner">{ tile.value }</div> 
                                </div>
                            )
                        }.bind(this))
                    } 
                    </div>
                </div> 
            </div>
        )
    }
});
ReactDOM.render( < Game / > , document.getElementById('game'));