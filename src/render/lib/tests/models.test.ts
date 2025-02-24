import { Player, Team } from '../scripts/models';

var player: Player;
player = new Player();

test('create player', () => {
	expect(player).toBeDefined();
});

test('player is Player', () => {
	expect(player).toBeInstanceOf(Player);
});

test('player has fields', () => {
	expect(player.id).toBe(undefined);
	expect(player.firstName).toBe(undefined);
	expect(player.lastName).toBe(undefined);
	expect(player.age).toBe(undefined);
	expect(player.weight).toBe(undefined);
	expect(player.height).toBe(undefined);
	expect(player.imageFile).toBe(undefined);
	expect(player.teams).toBe(undefined);
});

test('set player id', () => {
	player.id = 1;
	player.firstName = 'John';
	expect(player.id).toBe(1);
	expect(player.firstName).toBe('John');
});

test('import data', () => {
	const data = {
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		age: 25,
		weight: 80,
		height: 180,
	};
	player.deserialize(data);
	expect(player.id).toBe(1);
	expect(player.firstName).toBe('John');
	expect(player.lastName).toBe('Doe');
	expect(player.age).toBe(25);
	expect(player.weight).toBe(80);
	expect(player.height).toBe(180);
});

test('table data', () => {
	const data = {
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		age: 25,
		weight: 80,
		height: 180,
	};
	player.deserialize(data);
	const tableData = player.__tableData;
	expect(tableData).toEqual({
		id: 1,
		firstName: 'John',
		lastName: 'Doe',
		age: 25,
		weight: 80,
		height: 180,
		imageFileId: undefined,
		teams: undefined,
	});
});

test('serialize', () => {
	let team = new Team();
	const data = {
		id: 1,
		name: 'Team 1',
		players: [
			{
				player: 1,
				team: 1,
				amplua: 'Forward',
			},
		],
	};
	team.deserialize(data);
	const serialized = team.serialize();
	// expect(serialized).toEqual(data);
});
