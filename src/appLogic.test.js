const shipModule = require('./ship');

const gameboardModule = require('./gameboard');

const playersModule = require('./players');

const mockShip = shipModule.mockObject;

test('has length', () => {
  expect(mockShip).toHaveLength(5);
});

test('has hits', () => {
  expect(mockShip.hits).toBe(0);
});

test('ship has sunk', () => {
  expect(mockShip.sunk).toBe(false);
});

const mockBoard = gameboardModule.mockObject;

test('has squares', () => {
  expect(mockBoard.squares[1][1]).toBe(2);
});

test('has ship', () => {
  expect(mockBoard.squares[4][3]).toHaveProperty('hits');
});

test('has missed hit', () => {
  expect(mockBoard.missedHits).toHaveLength(1);
});

test('ship has hit', () => {
  expect(mockBoard.squares[3][3].hits).toBe(5);
});

test('fleet is sunk', () => {
  expect(mockBoard.checkFleet()).toBe(false);
});

const mockPlayer = playersModule.mockObject;

test('player has board', () => {
  expect(mockPlayer.grid.squares).toHaveLength(10);
});

test('has armadaSpaces', () => {
  expect(mockBoard.armadaSpaces).toHaveLength(7);
});

test('has armada', () => {
  expect(mockBoard.armada).toHaveLength(2);
});

// eslint-disable-next-line prefer-destructuring
const mockComputer = playersModule.mockComputer;

test('computer has miss', () => {
  expect(mockComputer.grid.missedAttacks).toHaveLength(1);
});

test('computer attacks damaged ship', () => {
  expect(mockComputer.computerShipDamage).toHaveLength(0);
});

test('computer empties original hit', () => {
  expect(mockComputer.computerOriginalHit).toHaveLength(0);
});
