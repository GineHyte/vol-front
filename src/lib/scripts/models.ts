import Field from '$lib/scripts/field'
import Model from '$lib/scripts/model'
import Datatype from '$lib/scripts/datatype'


export class Player extends Model {
  id: Field = new Field('id', 'id', new Datatype('string'))
  firstName: Field = new Field('firstName', 'first_name', new Datatype('string'), 'Ім\'я')
  lastName: Field = new Field('lastName', 'last_name', new Datatype('string'), 'Прізвище')
  age: Field = new Field('age', 'age', new Datatype('number'), 'Вік')
  weight: Field = new Field('weight', 'weight', new Datatype('number'), 'Вага')
  height: Field = new Field('height', 'height', new Datatype('number'), 'Зріст')
  imageFileId: Field = new Field('imageFileId', 'image_file_id', new Datatype('string'), 'Посилання на зображення')
  teams: Field = new Field('teams', 'teams', new Datatype('array'), 'Команди', 'team')
}

export class Team extends Model {
  id: Field = new Field('id', 'id', new Datatype('number'))
  name: Field = new Field('name', 'name', new Datatype('string'), 'Назва')
  players: Field = new Field('players', 'players', new Datatype('array'), 'Гравці', 'player')
}

export class Game extends Model {
  id: Field = new Field('id', 'id', new Datatype('number'))
  name: Field = new Field('name', 'name', new Datatype('string'), 'Назва')
  description: Field = new Field('description', 'description', new Datatype('string'), 'Опис')
  fromDatetime: Field = new Field('fromDatetime', 'from_datetime', new Datatype('string'), 'Дата початку')
  toDatetime: Field = new Field('toDatetime', 'to_datetime', new Datatype('string'), 'Дата закінчення')
  teamA: Field = new Field('teamA', 'team_a', new Datatype('number'), 'Команда А', 'team')
  teamB: Field = new Field('teamB', 'team_b', new Datatype('number'), 'Команда Б', 'team')
}

export class Status extends Model {
  status: Field = new Field('status', 'status', new Datatype('string'), 'Статус')
  detail: Field = new Field('detail', 'detail', new Datatype('string'), 'Деталі')
}

export class PlayerTeam extends Model {
  playerId: Field = new Field('playerId', 'player_id', new Datatype('number'), 'Гравець', 'player')
  teamId: Field = new Field('teamId', 'team_id', new Datatype('number'), 'Команда', 'team')
  amplua: Field = new Field('amplua', 'amplua', new Datatype('string'), 'Амплуа')
}
