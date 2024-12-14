import { ApiImpl } from "./api";
import { Player, Team, Game, Status } from '$lib/scripts/models'
import { Pagination, PaginationProps } from '$lib/scripts/pagination'

export function getPlayers(paginationProps: PaginationProps): Promise<Pagination<Player>> {
  return new ApiImpl().get('/players', paginationProps)
    .then((data: any) => {
      return new Pagination<Player>(data, Player)
    })
}