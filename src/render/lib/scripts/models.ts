import Field from '$lib/scripts/field'
import Model from '$lib/scripts/model'
import Datatype from '$lib/scripts/datatype'
import { Relation } from '$lib/scripts/relation'


export class Player extends Model {
  id: Field = new Field('id', 'id', new Datatype('string'))
  firstName: Field = new Field('firstName', 'first_name', new Datatype('string'), 'Ім\'я')
  lastName: Field = new Field('lastName', 'last_name', new Datatype('string'), 'Прізвище')
  age: Field = new Field('age', 'age', new Datatype('number'), 'Вік')
  weight: Field = new Field('weight', 'weight', new Datatype('number'), 'Вага')
  height: Field = new Field('height', 'height', new Datatype('number'), 'Зріст')
  imageFileId: Field = new Field('imageFileId', 'image_file_id', new Datatype('string'), 'Посилання на зображення')
  teams: Field = new Field('teams', 'teams', new Datatype('array'), 'Команди', new Relation('teams', 'Команди', PlayerTeam))
}

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
  difficulty: Field = new Field('difficulty', 'difficulty', new Datatype('number', 1, 3), 'Складність')
  techId: Field = new Field('techId', 'tech_id', new Datatype('number'), 'Технічна дія', new Relation('techs', 'Техніка'))
}


export class Exercise extends Model {
  id: Field = new Field('id', 'id', new Datatype('number'))
  name: Field = new Field('name', 'name', new Datatype('string'), 'Назва')
  description: Field = new Field('description', 'description', new Datatype('string'), 'Опис')
  subtechId: Field = new Field('subtechId', 'subtech_id', new Datatype('number'), 'Субтехніка', new Relation('subtechs', 'Субтехніка'))
  imageUrl: Field = new Field('imageUrl', 'image_url', new Datatype('string'), 'Посилання на зображення')
  videoUrl: Field = new Field('videoUrl', 'video_url', new Datatype('string'), 'Посилання на відео')
  difficulty: Field = new Field('difficulty', 'difficulty', new Datatype('number'), 'Складність')
  exercisesForLearning: Field = new Field('exercisesForLearning', 'exercises_for_learning', new Datatype('boolean'), 'Для навчання')
  exercisesForConsolidation: Field = new Field('exercisesForConsolidation', 'exercises_for_consolidation', new Datatype('boolean'), 'Для закріплення')
  exercisesForImprovement: Field = new Field('exercisesForImprovement', 'exercises_for_improvement', new Datatype('boolean'), 'Для покращення')
  simulationExercises: Field = new Field('simulationExercises', 'simulation_exercises', new Datatype('boolean'), 'Для симуляції')
  exercisesWithTheBallOnYourOwn: Field = new Field('exercisesWithTheBallOnYourOwn', 'exercises_with_the_ball_on_your_own', new Datatype('boolean'), 'З м\'ячем у власних руках')
  exercisesWithTheBallInPairs: Field = new Field('exercisesWithTheBallInPairs', 'exercises_with_the_ball_in_pairs', new Datatype('boolean'), 'З м\'ячем у парах')
  exercisesWithTheBallInGroups: Field = new Field('exercisesWithTheBallInGroups', 'exercises_with_the_ball_in_groups', new Datatype('boolean'), 'З м\'ячем у групах')
  exercisesInDifficultConditions: Field = new Field('exercisesInDifficultConditions', 'exercises_in_difficult_conditions', new Datatype('boolean'), 'У складних умовах')
  fromZone: Field = new Field('fromZone', 'from_zone', new Datatype('number'), 'Зона від')
  toZone: Field = new Field('toZone', 'to_zone', new Datatype('number'), 'Зона до')
  timePerExercise: Field = new Field('timePerExercise', 'time_per_exercise', new Datatype('number'), 'Час на одну вправу')
}