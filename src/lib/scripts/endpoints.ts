import { ApiImpl } from './api';
import { Player, Team, Game, Status } from '$lib/scripts/models'
import { Pagination, PaginationProps } from '$lib/scripts/pagination'

export function getPlayers(paginationProps: PaginationProps): Promise<Pagination<Player>> {
  return new ApiImpl().get('/players', paginationProps)
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
  console.log(player);
  return new ApiImpl().post('/players', player.serialize())
    .then((data: any) => {
      return new Status().deserialize(data) as Status
    })
}