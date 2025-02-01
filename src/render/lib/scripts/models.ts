import Field from '$lib/scripts/field'
import Model from '$lib/scripts/model'
import Datatype from '$lib/scripts/datatype'
import { Relation } from '$lib/scripts/relation'


let Number = new Datatype('number')
let String = new Datatype('string')
let Boolean = new Datatype('boolean')
let Datetime = new Datatype('datetime')
let Array = new Datatype('array')

export class Player extends Model {
  id!: Field
  firstName!: Field
  lastName!: Field
  age!: Field
  weight!: Field
  height!: Field
  imageFileId!: Field
  teams!: Field

  constructor() { 
    super()

    this.id = new Field('id', String)
    this.firstName = new Field('first_name', String, 'Ім\'я')
    this.lastName = new Field('last_name', String, 'Прізвище')
    this.age = new Field('age', Number, 'Вік')
    this.weight = new Field('weight', Number, 'Вага')
    this.height = new Field('height', Number, 'Зріст')
    this.imageFileId = new Field('image_file_id', String, 'Посилання на зображення')
    this.teams = new Field('teams', Array, 'Команди', new Relation('teams', 'Команди', PlayerTeam))
   }
}

export class Team extends Model {
  id: Field = new Field('id', Number)
  name: Field = new Field('name', String, 'Назва')
  players: Field = new Field('players', Array, 'Гравці', new Relation('players', 'Гравці', PlayerTeam))

  constructor() { super() }
}

export class Game extends Model {
  id: Field = new Field('id', Number)
  name: Field = new Field('name', String, 'Назва')
  description: Field = new Field('description', String, 'Опис')
  fromDatetime: Field = new Field('from_datetime', Datetime, 'Дата початку')
  toDatetime: Field = new Field('to_datetime', Datetime, 'Дата закінчення')
  teamA: Field = new Field('team_a', Number, 'Команда А', new Relation('teams', 'Команда А'))
  teamB: Field = new Field('team_b', Number, 'Команда Б', new Relation('teams', 'Команда Б'))

  constructor() { super() }
}

export class Status extends Model {
  status: Field = new Field('status', String, 'Статус')
  detail: Field = new Field('detail', String, 'Деталі')

  constructor() { super() }
}

export class PlayerTeam extends Model {
  playerId: Field = new Field('player_id', Number, 'Гравець')
  teamId: Field = new Field('team_id', Number, 'Команда')
  amplua: Field = new Field('amplua', String, 'Амплуа')

  constructor() { super() }
}

export class Action extends Model {
  id: Field = new Field('id', Number)
  game: Field = new Field('game', Number, 'Гра', new Relation('games', 'Гра'))
  team: Field = new Field('team', Number, 'Команда', new Relation('teams', 'Команда'))
  player: Field = new Field('player', Number, 'Гравець', new Relation('players', 'Гравець'))
  subtech: Field = new Field('subtech', Number, 'Субтехніка', new Relation('subtechs', 'Субтехніка'))
  from_zone: Field = new Field('from_zone', Number, 'Зона від')
  to_zone: Field = new Field('to_zone', Number, 'Зона до')
  impact: Field = new Field('impact', String, 'Якісний показник гри')

  constructor() { super() }
}

export class Tech extends Model {
  id: Field = new Field('id', Number)
  name: Field = new Field('name', String, 'Назва')
  description: Field = new Field('description', String, 'Опис')

  constructor() { super() }
}

export class Subtech extends Model {
  id: Field = new Field('id', Number)
  name: Field = new Field('name', String, 'Назва')
  description: Field = new Field('description', String, 'Опис')
  difficulty: Field = new Field('difficulty', new Datatype('number', 1, 3), 'Складність')
  techId: Field = new Field('tech_id', Number, 'Технічна дія', new Relation('techs', 'Техніка'))

  constructor() { super() }
}


export class Exercise extends Model {
  id: Field = new Field('id', Number)
  name: Field = new Field('name', String, 'Назва')
  description: Field = new Field('description', String, 'Опис')
  subtechId: Field = new Field('subtech_id', Number, 'Субтехніка', new Relation('subtechs', 'Субтехніка'))
  imageUrl: Field = new Field('image_url', String, 'Посилання на зображення')
  videoUrl: Field = new Field('video_url', String, 'Посилання на відео')
  difficulty: Field = new Field('difficulty', Number, 'Складність')
  exercisesForLearning: Field = new Field('exercises_for_learning', Boolean, 'Для навчання')
  exercisesForConsolidation: Field = new Field('exercises_for_consolidation', Boolean, 'Для закріплення')
  exercisesForImprovement: Field = new Field('exercises_for_improvement', Boolean, 'Для покращення')
  simulationExercises: Field = new Field('simulation_exercises', Boolean, 'Для симуляції')
  exercisesWithTheBallOnYourOwn: Field = new Field('exercises_with_the_ball_on_your_own', Boolean, 'З м\'ячем у власних руках')
  exercisesWithTheBallInPairs: Field = new Field('exercises_with_the_ball_in_pairs', Boolean, 'З м\'ячем у парах')
  exercisesWithTheBallInGroups: Field = new Field('exercises_with_the_ball_in_groups', Boolean, 'З м\'ячем у групах')
  exercisesInDifficultConditions: Field = new Field('exercises_in_difficult_conditions', Boolean, 'У складних умовах')
  fromZone: Field = new Field('from_zone', Number, 'Зона від')
  toZone: Field = new Field('to_zone', Number, 'Зона до')
  timePerExercise: Field = new Field('time_per_exercise', Number, 'Час на одну вправу')

  constructor() { super() }
}