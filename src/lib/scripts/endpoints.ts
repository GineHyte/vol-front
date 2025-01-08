import { ApiImpl } from './api';
import { Player, Team, Game, Status } from '$lib/scripts/models'
import { Pagination, PaginationProps } from '$lib/scripts/pagination'

export function getPlayers(paginationProps: PaginationProps = new PaginationProps()): Promise<Pagination<Player>> {
  return new ApiImpl().get('/players/', paginationProps)
    .then((data: any) => {
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
