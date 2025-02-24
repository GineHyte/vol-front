import { ApiImpl } from './api';
import { Player, Team, Game, Status, Action, Tech, Subtech, Exercise } from '$lib/scripts/models';
import { Pagination, PaginationProps } from '$lib/scripts/pagination';

const Api = new ApiImpl();

export function getPlayers(
	paginationProps: PaginationProps = new PaginationProps(),
): Promise<Pagination<Player>> {
	return Api.get('/players/', paginationProps).then((data: any) => {
		return new Pagination<Player>(data, Player);
	});
}

export function getPlayer(id: number): Promise<Player> {
	return Api.get(`/players/${id}`).then((data: any) => {
		return new Player().deserialize(data) as Player;
	});
}

export async function createPlayer(player: Player): Promise<Status> {
	return Api.post('/players/', player.serialize()).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function deletePlayer(id: number): Promise<Status> {
	return Api.delete(`/players/${id}`).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function getTeams(
	paginationProps: PaginationProps = new PaginationProps(),
): Promise<Pagination<Team>> {
	return Api.get('/teams/', paginationProps).then((data: any) => {
		return new Pagination<Team>(data, Team);
	});
}

export async function getTeam(id: number): Promise<Team> {
	return Api.get(`/teams/${id}`).then((data: any) => {
		return new Team().deserialize(data) as Team;
	});
}

export async function createTeam(team: Team): Promise<Status> {
	return Api.post('/teams/', team.serialize()).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function deleteTeam(id: number): Promise<Status> {
	return Api.delete(`/teams/${id}`).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function getGames(
	paginationProps: PaginationProps = new PaginationProps(),
	teamId: number | undefined = undefined,
	playerId: number | undefined = undefined,
): Promise<Pagination<Game>> {
	let query = '';
	if (teamId) {
		query += `&team_id=${teamId}`;
	}
	if (playerId) {
		query += `&player_id=${playerId}`;
	}
	return Api.get(`/games/?${query}`, paginationProps).then((data: any) => {
		return new Pagination<Game>(data, Game);
	});
}

export async function getGame(id: number): Promise<Game> {
	return Api.get(`/games/${id}`).then((data: any) => {
		return new Game().deserialize(data) as Game;
	});
}

export async function createGame(game: Game): Promise<Status> {
	return Api.post('/games/', game.serialize()).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function deleteGame(id: number): Promise<Status> {
	return Api.delete(`/games/${id}`).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function getActions(
	gameId: number,
	paginationProps: PaginationProps = new PaginationProps(),
): Promise<Pagination<Action>> {
	return Api.get(`/actions/?game_id=${gameId}`, paginationProps).then((data: any) => {
		return new Pagination<Action>(data, Action);
	});
}

export async function getTechs(
	paginationProps: PaginationProps = new PaginationProps(),
): Promise<Pagination<Tech>> {
	return Api.get('/techs/', paginationProps).then((data: any) => {
		return new Pagination<Tech>(data, Tech);
	});
}

export async function getTech(id: number): Promise<Tech> {
	return Api.get(`/techs/${id}`).then((data: any) => {
		return new Tech().deserialize(data) as Tech;
	});
}

export async function createTech(tech: Tech): Promise<Status> {
	return Api.post('/techs/', tech.serialize()).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function deleteTech(id: number): Promise<Status> {
	return Api.delete(`/techs/${id}`).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function getSubtechs(
	techId: number | undefined = undefined,
	paginationProps: PaginationProps = new PaginationProps(),
): Promise<Pagination<Subtech>> {
	let url = '/subtechs/';
	if (techId) {
		url += `?tech_id=${techId}`;
	}
	return Api.get(url, paginationProps).then((data: any) => {
		return new Pagination<Subtech>(data, Subtech);
	});
}

export async function createAction(action: Action): Promise<Status> {
	return Api.post('/actions/', action.serialize()).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function createSubtech(subtech: Subtech): Promise<Status> {
	return Api.post('/subtechs/', subtech.serialize()).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function deleteSubtech(id: number): Promise<Status> {
	return Api.delete(`/subtechs/${id}`).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function getSubtech(id: number): Promise<Subtech> {
	return Api.get(`/subtechs/${id}`).then((data: any) => {
		return new Subtech().deserialize(data) as Subtech;
	});
}

export async function getAction(id: number): Promise<Action> {
	return Api.get(`/actions/${id}`).then((data: any) => {
		return new Action().deserialize(data) as Action;
	});
}

export async function deleteAction(id: number): Promise<Status> {
	return Api.delete(`/actions/${id}`).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function getExercises(
	paginationProps: PaginationProps = new PaginationProps(),
): Promise<Pagination<Exercise>> {
	return Api.get('/exercises/', paginationProps).then((data: any) => {
		return new Pagination<Exercise>(data, Exercise);
	});
}

export async function getExercise(id: number): Promise<Exercise> {
	return Api.get(`/exercises/${id}`).then((data: any) => {
		return new Exercise().deserialize(data) as Exercise;
	});
}

export async function createExercise(exercise: Exercise): Promise<Status> {
	return Api.post('/exercises/', exercise.serialize()).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}

export async function deleteExercise(id: number): Promise<Status> {
	return Api.delete(`/exercises/${id}`).then((data: any) => {
		return new Status().deserialize(data) as Status;
	});
}
