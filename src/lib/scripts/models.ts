import Field from '$lib/scripts/field'
import Model from '$lib/scripts/model'
import Datatype from '$lib/scripts/datatype'


export class Player extends Model {
  id: Field = new Field('id', 'id', new Datatype(String))
  firstName: Field = new Field('firstName', 'first_name', new Datatype(String), 'Ім\'я')
  lastName: Field = new Field('lastName', 'last_name', new Datatype(String), 'Прізвище')
  age: Field = new Field('age', 'age', new Datatype(Number), 'Вік')
  weight: Field = new Field('weight', 'weight', new Datatype(Number), 'Вага')
  height: Field = new Field('height', 'height', new Datatype(Number), 'Зріст')
  imageFileId: Field = new Field('imageFileId', 'image_file_id', new Datatype(String), 'Посилання на зображення')
  teams: Field = new Field('teams', 'teams', new Datatype(Array<Number>), 'Команди', undefined, 'team')
}

export class Team extends Model {
  id: Field = new Field('id', 'id', new Datatype(Number))
  name: Field = new Field('name', 'name', new Datatype(String), 'Назва')
  players: Field = new Field('players', 'players', new Datatype(Array<Number>), 'Гравці', undefined, 'player')
}

export class Game extends Model {
  id: Field = new Field('id', 'id', new Datatype(Number))
  name: Field = new Field('name', 'name', new Datatype(String), 'Назва')
  description: Field = new Field('description', 'description', new Datatype(String), 'Опис')
  fromDatetime: Field = new Field('fromDatetime', 'from_datetime', new Datatype(String), 'Дата початку')
  toDatetime: Field = new Field('toDatetime', 'to_datetime', new Datatype(String), 'Дата закінчення')
  teamA: Field = new Field('teamA', 'team_a', new Datatype(Number), 'Команда А', undefined, 'team')
  teamB: Field = new Field('teamB', 'team_b', new Datatype(Number), 'Команда Б', undefined, 'team')
}

export class Status extends Model {
  status: Field = new Field('status', 'status', new Datatype(String), 'Статус')
  detail: Field = new Field('detail', 'detail', new Datatype(String), 'Деталі')
}