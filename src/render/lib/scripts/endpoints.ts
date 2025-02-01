import { ApiImpl } from './api';
import { Player, Team, Game, Status, Action, Tech, Subtech, Exercise } from '$lib/scripts/models'
import { Pagination, PaginationProps } from '$lib/scripts/pagination'

export function getPlayers(paginationProps: PaginationProps = new PaginationProps()): Promise<Pagination<Player>> {
  return new ApiImpl().get('/players/', paginationProps)
    .then((data: any) => {
      console.log(data)
      return new Pagination<Player>(data, Player)
    })
}

export function getPlayer(id: number): Promise<Player> {
  return new ApiImpl().get(`/players/${id}`)
    .then((data: any) => {
      return new Player().deserialize(data) as Player
    })
}

export function createPlayer(player: Player): Promise<Status> {
  return new ApiImpl().post('/players/', player.serialize())
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function deletePlayer(id: number): Promise<Status> {
  return new ApiImpl().delete(`/players/${id}`)
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function getTeams(paginationProps: PaginationProps = new PaginationProps()): Promise<Pagination<Team>> {
  return new ApiImpl().get('/teams/', paginationProps)
    .then((data: any) => {
      return new Pagination<Team>(data, Team)
    })
}

export function getTeam(id: number): Promise<Team> {
  return new ApiImpl().get(`/teams/${id}`)
    .then((data: any) => {
      return new Team().deserialize(data) as Team
    })
}

export function createTeam(team: Team): Promise<Status> {
  return new ApiImpl().post('/teams/', team.serialize())
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function deleteTeam(id: number): Promise<Status> {
  return new ApiImpl().delete(`/teams/${id}`)
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function getGames(
  paginationProps: PaginationProps = new PaginationProps(),
  teamId: number | undefined = undefined,
  playerId: number | undefined = undefined
): Promise<Pagination<Game>> {
  let query = '';
  if (teamId) {
    query += `&team_id=${teamId}`;
  }
  if (playerId) {
    query += `&player_id=${playerId}`;
  }
  return new ApiImpl().get(`/games/?${query}`, paginationProps)
    .then((data: any) => {
      return new Pagination<Game>(data, Game)
    })
}

export function getGame(id: number): Promise<Game> {
  return new ApiImpl().get(`/games/${id}`)
    .then((data: any) => {
      return new Game().deserialize(data) as Game
    })
}

export function createGame(game: Game): Promise<Status> {
  return new ApiImpl().post('/games/', game.serialize())
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function deleteGame(id: number): Promise<Status> {
  return new ApiImpl().delete(`/games/${id}`)
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function getActions(gameId: number, paginationProps: PaginationProps = new PaginationProps()): Promise<Pagination<Action>> {
  return new ApiImpl().get(`/actions/?game_id=${gameId}`, paginationProps)
    .then((data: any) => {
      return new Pagination<Action>(data, Action)
    })
}

export function getTechs(paginationProps: PaginationProps = new PaginationProps()): Promise<Pagination<Tech>> {
  return new ApiImpl().get('/techs/', paginationProps)
    .then((data: any) => {
      return new Pagination<Tech>(data, Tech)
    })
}

export function getTech(id: number): Promise<Tech> {
  return new ApiImpl().get(`/techs/${id}`)
    .then((data: any) => {
      return new Tech().deserialize(data) as Tech
    })
}

export function createTech(tech: Tech): Promise<Status> {
  return new ApiImpl().post('/techs/', tech.serialize())
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function deleteTech(id: number): Promise<Status> {
  return new ApiImpl().delete(`/techs/${id}`)
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function getSubtechs(techId: number | undefined = undefined, paginationProps: PaginationProps = new PaginationProps()): Promise<Pagination<Subtech>> {
  let url = '/subtechs/';
  if (techId) {
    url += `?tech_id=${techId}`;
  }
  return new ApiImpl().get(url, paginationProps)
    .then((data: any) => {
      return new Pagination<Subtech>(data, Subtech)
    })
}

export function createAction(action: Action): Promise<Status> {
  return new ApiImpl().post('/actions/', action.serialize())
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}


export function createSubtech(subtech: Subtech): Promise<Status> {
  return new ApiImpl().post('/subtechs/', subtech.serialize())
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function deleteSubtech(id: number): Promise<Status> {
  return new ApiImpl().delete(`/subtechs/${id}`)
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}


export function getSubtech(id: number): Promise<Subtech> {
  return new ApiImpl().get(`/subtechs/${id}`)
    .then((data: any) => {
      return new Subtech().deserialize(data) as Subtech
    })
}

export function getAction(id: number): Promise<Action> {
  return new ApiImpl().get(`/actions/${id}`)
    .then((data: any) => {
      return new Action().deserialize(data) as Action
    })
}


export function deleteAction(id: number): Promise<Status> {
  return new ApiImpl().delete(`/actions/${id}`)
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function getExercises(paginationProps: PaginationProps = new PaginationProps()): Promise<Pagination<Exercise>> {
  return new ApiImpl().get('/exercises/', paginationProps)
    .then((data: any) => {
      return new Pagination<Exercise>(data, Exercise)
    })
}

export function getExercise(id: number): Promise<Exercise> {
  return new ApiImpl().get(`/exercises/${id}`)
    .then((data: any) => {
      return new Exercise().deserialize(data) as Exercise
    })
}

export function createExercise(exercise: Exercise): Promise<Status> {
  return new ApiImpl().post('/exercises/', exercise.serialize())
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}

export function deleteExercise(id: number): Promise<Status> {
  return new ApiImpl().delete(`/exercises/${id}`)
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}
