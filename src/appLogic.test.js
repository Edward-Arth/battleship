const shipModule = require('./ship');

const gameboardModule = require('./gameboard');

const mockShip = shipModule.mockObject;

test('has length', () => {
  expect(mockShip).toHaveLength(5);
});

test('has hits', () => {
  expect(mockShip.hits).toBe(0);
});

test('has sunk', () => {
  expect(mockShip.sunk).toBe(false);
});

const mockBoard = gameboardModule.mockObject;

test('has squares', () => {
  expect(mockBoard.squares[1][1]).toBe(2);
});

test('has ship', () => {
  expect(mockBoard.squares[3][3]).toHaveProperty('length');
});

test('has missed hit', () => {
  expect(mockBoard.missedHits).toHaveLength(1);
});

test('ship has hit', () => {
  expect(mockBoard.squares[3][3].hits).toBe(1);
});
