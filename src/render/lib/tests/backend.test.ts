import { getPlayer } from '../scripts/endpoints';

test('get player', async () => {
	const player = await getPlayer(1);
	expect(player).toBeDefined();
	expect(player.id).toBe(1);
	expect(player.firstName).toBe('John');
	expect(player.lastName).toBe('Doe');
	expect(player.age).toBe(25);
	expect(player.weight).toBe(80);
	expect(player.height).toBe(180);
});
