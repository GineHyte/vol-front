import Field from "$lib/scripts/field"
import Model from "$lib/scripts/model"


export class Player extends Model {
  id: Field = new Field('id', 'id', Number)
  firstName: Field = new Field('firstName', 'first_name', String, 'Ім\'я')
  lastName: Field = new Field('lastName', 'last_name', String, 'Прізвище')
  age: Field = new Field('age', 'age', Number, 'Вік')
  weight: Field = new Field('weight', 'weight', Number, 'Вага')
  height: Field = new Field('height', 'height', Number, 'Зріст')
  imageURL: Field = new Field('imageURL', 'image_url', String, 'Посилання на зображення')
  teams: Field = new Field('teams', 'teams', Array, 'Команди', undefined, "team")
}

export class Team extends Model {
  id: Field = new Field('id', 'id', Number)
  name: Field = new Field('name', 'name', String, 'Назва')
  players: Field = new Field('players', 'players', Array, 'Гравці', undefined, "player")
}

export class Game extends Model {
  id: Field = new Field('id', 'id', Number)
  name: Field = new Field('name', 'name', String, 'Назва')
  description: Field = new Field('description', 'description', String, 'Опис')
  fromDatetime: Field = new Field('fromDatetime', 'from_datetime', String, 'Дата початку')
  toDatetime: Field = new Field('toDatetime', 'to_datetime', String, 'Дата закінчення')
  teamA: Field = new Field('teamA', 'team_a', Number, 'Команда А', undefined, 'team')
  teamB: Field = new Field('teamB', 'team_b', Number, 'Команда Б', undefined, 'team')
}

export class Status extends Model {
  status: Field = new Field('status', 'status', String, 'Статус')
  detail: Field = new Field('detail', 'detail', String, 'Деталі')
}