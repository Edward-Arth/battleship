class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;

    this.hit = function hit() {
      this.hits += 1;
    };

    this.isSunk = function isSunk() {
      if (this.hits === this.length) {
        this.sunk = true;
      }
      return this.sunk;
    };
  }
}

const mockShip = new Ship(5);

exports.class = Ship;
exports.mockObject = mockShip;
