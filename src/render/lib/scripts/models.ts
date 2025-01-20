import Field from '$lib/scripts/field'
import Model from '$lib/scripts/model'
import Datatype from '$lib/scripts/datatype'
import { Relation } from '$lib/scripts/relation'
import type { iPlayer } from '$lib/scripts/schemas'

export class Player extends Model implements iPlayer {
  serializationAlias: { [key: string]: string } = {}
  id: number = 0
  firstName: string = ''
  lastName: string = ''
  age: number = 0
  weight: number = 0
  height: number = 0
  imageFileId: string = ''
  teams: number[] = []

  constructor() {
    this.deserializationAlias = {
      id: 'id',
      firstName: 'first_name',
      lastName: 'last_name',
      age: 'age',
      weight: 'weight',
      height: 'height',
      imageFileId: 'image_file_id',
      teams: 'teams'
    }
  }
}

// export class Player extends Model {
//   id: Field = new Field('id', 'id', new Datatype('string'))
//   firstName: Field = new Field('firstName', 'first_name', new Datatype('string'), 'Ім\'я')
//   lastName: Field = new Field('lastName', 'last_name', new Datatype('string'), 'Прізвище')
//   age: Field = new Field('age', 'age', new Datatype('number'), 'Вік')
//   weight: Field = new Field('weight', 'weight', new Datatype('number'), 'Вага')
//   height: Field = new Field('height', 'height', new Datatype('number'), 'Зріст')
//   imageFileId: Field = new Field('imageFileId', 'image_file_id', new Datatype('string'), 'Посилання на зображення')
//   teams: Field = new Field('teams', 'teams', new Datatype('array'), 'Команди', new Relation('teams', 'Команди', PlayerTeam))
// }

export class Team extends Model {
  id: Field = new Field('id', 'id', new Datatype('number'))
  name: Field = new Field('name', 'name', new Datatype('string'), 'Назва')
  players: Field = new Field('players', 'players', new Datatype('array'), 'Гравці', new Relation('players', 'Гравці', PlayerTeam))
}

export class Game extends Model {
  id: Field = new Field('id', 'id', new Datatype('number'))
  name: Field = new Field('name', 'name', new Datatype('string'), 'Назва')
  description: Field = new Field('description', 'description', new Datatype('string'), 'Опис')
  fromDatetime: Field = new Field('fromDatetime', 'from_datetime', new Datatype('datetime'), 'Дата початку')
  toDatetime: Field = new Field('toDatetime', 'to_datetime', new Datatype('datetime'), 'Дата закінчення')
  teamA: Field = new Field('teamA', 'team_a', new Datatype('number'), 'Команда А', new Relation('teams', 'Команда А'))
  teamB: Field = new Field('teamB', 'team_b', new Datatype('number'), 'Команда Б', new Relation('teams', 'Команда Б'))
}

export class Status extends Model {
  status: Field = new Field('status', 'status', new Datatype('string'), 'Статус')
  detail: Field = new Field('detail', 'detail', new Datatype('string'), 'Деталі')
}

export class PlayerTeam extends Model {
  playerId: Field = new Field('playerId', 'player_id', new Datatype('number'), 'Гравець')
  teamId: Field = new Field('teamId', 'team_id', new Datatype('number'), 'Команда')
  amplua: Field = new Field('amplua', 'amplua', new Datatype('string'), 'Амплуа')
}

export class Action extends Model {
  id: Field = new Field('id', 'id', new Datatype('number'))
  game: Field = new Field('game', 'game', new Datatype('number'), 'Гра', new Relation('games', 'Гра'))
  team: Field = new Field('team', 'team', new Datatype('number'), 'Команда', new Relation('teams', 'Команда'))
  player: Field = new Field('player', 'player', new Datatype('number'), 'Гравець', new Relation('players', 'Гравець'))
  subtech: Field = new Field('subtech', 'subtech', new Datatype('number'), 'Субтехніка', new Relation('subtechs', 'Субтехніка'))
  from_zone: Field = new Field('from_zone', 'from_zone', new Datatype('number'), 'Зона від')
  to_zone: Field = new Field('to_zone', 'to_zone', new Datatype('number'), 'Зона до')
  impact: Field = new Field('impact', 'impact', new Datatype('string'), 'Якісний показник гри')
}

export class Tech extends Model {
  id: Field = new Field('id', 'id', new Datatype('number'))
  name: Field = new Field('name', 'name', new Datatype('string'), 'Назва')
  description: Field = new Field('description', 'description', new Datatype('string'), 'Опис')
}

export class Subtech extends Model {
  id: Field = new Field('id', 'id', new Datatype('number'))
  name: Field = new Field('name', 'name', new Datatype('string'), 'Назва')
  description: Field = new Field('description', 'description', new Datatype('string'), 'Опис')
  techId: Field = new Field('techId', 'tech_id', new Datatype('number'), 'Технічна дія', new Relation('techs', 'Техніка'))
}
