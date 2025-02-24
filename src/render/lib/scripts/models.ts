import Field from '$lib/scripts/field';
import Model from '$lib/scripts/model';
import Datatype from '$lib/scripts/datatype';
import { Amplua, Impact, TrueFalse } from '$lib/utils/utils';

let Number = new Datatype('number');
let String = new Datatype('string');
let Boolean = new Datatype('boolean');
let Datetime = new Datatype('datetime');
let Array = new Datatype('array');
let BigString = new Datatype('bigstring');

export class NameWithId extends Model {
	id: any;
	name: any;

	constructor() {
		super();
		this.id = new Field('id', Number);
		this.name = new Field('name', String, 'Назва');
		return this.proxify();
	}
}

let NameWithIdType = new Datatype(NameWithId);

export class PlayerTeam extends Model {
	player: any;
	team: any;
	amplua: any;

	constructor() {
		super();

		this.player = new Field('player', NameWithIdType, 'Гравець', ['name']);
		this.team = new Field('team', NameWithIdType, 'Команда', ['name']);
		this.amplua = new Field('amplua', String, 'Амплуа', [], Amplua);

		return this.proxify();
	}
}

export class Player extends Model {
	id: any;
	firstName: any;
	lastName: any;
	age: any;
	weight: any;
	height: any;
	imageFile: any;
	teams: any;

	constructor() {
		super();
		this.id = new Field('id', Number);
		this.firstName = new Field('first_name', String, "Ім'я");
		this.lastName = new Field('last_name', String, 'Прізвище');
		this.age = new Field('age', Number, 'Вік');
		this.weight = new Field('weight', Number, 'Вага');
		this.height = new Field('height', Number, 'Зріст');
		this.imageFile = new Field('image_file', String, 'Посилання на зображення');
		this.teams = new Field('teams', new Datatype([PlayerTeam]), 'Команди');
		return this.proxify();
	}
}

export class Team extends Model {
	id: any;
	name: any;
	players: any;

	constructor() {
		super();

		this.id = new Field('id', Number);
		this.name = new Field('name', String, 'Назва');
		this.players = new Field('players', new Datatype([PlayerTeam]), 'Гравці');

		return this.proxify();
	}
}

export class Game extends Model {
	id: any;
	name: any;
	description: any;
	fromDatetime: any;
	toDatetime: any;
	teamA: any;
	teamB: any;

	constructor() {
		super();

		this.id = new Field('id', Number);
		this.name = new Field('name', String, 'Назва');
		this.description = new Field('description', BigString, 'Опис');
		this.fromDatetime = new Field('from_datetime', Datetime, 'Дата початку');
		this.toDatetime = new Field('to_datetime', Datetime, 'Дата закінчення');
		this.teamA = new Field('team_a', NameWithIdType, 'Команда А', ['name']);
		this.teamB = new Field('team_b', NameWithIdType, 'Команда Б', ['name']);

		return this.proxify();
	}
}

export class Status extends Model {
	status: any;
	detail: any;

	constructor() {
		super();

		this.status = new Field('status', String, 'Статус');
		this.detail = new Field('detail', String, 'Деталі');

		return this.proxify();
	}
}

export class Action extends Model {
	id: any;
	game: any;
	team: any;
	player: any;
	subtech: any;
	from_zone: any;
	to_zone: any;
	impact: any;

	constructor() {
		super();

		this.id = new Field('id', Number);
		this.game = new Field('game', NameWithIdType, 'Гра', ['name']);
		this.team = new Field('team', NameWithIdType, 'Команда', ['name']);
		this.player = new Field('player', NameWithIdType, 'Гравець', ['name']);
		this.subtech = new Field('subtech', NameWithIdType, 'Субтехніка', ['name']);
		this.from_zone = new Field('from_zone', Number, 'Зона від');
		this.to_zone = new Field('to_zone', Number, 'Зона до');
		this.impact = new Field('impact', String, 'Якісний показник гри', [], Impact);

		return this.proxify();
	}
}

export class Tech extends Model {
	id: any;
	name: any;
	description: any;

	constructor() {
		super();

		this.id = new Field('id', Number);
		this.name = new Field('name', String, 'Назва');
		this.description = new Field('description', BigString, 'Опис');

		return this.proxify();
	}
}

export class Subtech extends Model {
	id: any;
	name: any;
	description: any;
	difficulty: any;
	tech: any;

	constructor() {
		super();

		this.id = new Field('id', Number);
		this.name = new Field('name', String, 'Назва');
		this.description = new Field('description', BigString, 'Опис');
		this.difficulty = new Field('difficulty', Number, 'Складність');
		this.tech = new Field('tech', NameWithIdType, 'Технічна дія', ['name']);

		return this.proxify();
	}
}

export class Exercise extends Model {
	id: any;
	name: any;
	description: any;
	subtech: any;
	tech: any;
	imageUrl: any;
	videoUrl: any;
	difficulty: any;
	exercisesForLearning: any;
	exercisesForConsolidation: any;
	exercisesForImprovement: any;
	simulationExercises: any;
	exercisesWithTheBallOnYourOwn: any;
	exercisesWithTheBallInPairs: any;
	exercisesWithTheBallInGroups: any;
	exercisesInDifficultConditions: any;
	fromZone: any;
	toZone: any;
	timePerExercise: any;

	constructor() {
		super();

		this.id = new Field('id', Number);
		this.name = new Field('name', String, 'Назва');
		this.description = new Field('description', BigString, 'Опис');
		this.tech = new Field('tech', NameWithIdType, 'Техніка', ['name']);
		this.subtech = new Field('subtech', NameWithIdType, 'Субтехніка', ['name']);
		this.imageUrl = new Field('image_url', String, 'Посилання на зображення');
		this.videoUrl = new Field('video_url', String, 'Посилання на відео');
		this.difficulty = new Field('difficulty', Number, 'Складність');
		this.exercisesForLearning = new Field(
			'exercises_for_learning',
			Boolean,
			'Для навчання',
			[],
			TrueFalse,
		);
		this.exercisesForConsolidation = new Field(
			'exercises_for_consolidation',
			Boolean,
			'Для закріплення',
			[],
			TrueFalse,
		);
		this.exercisesForImprovement = new Field(
			'exercises_for_improvement',
			Boolean,
			'Для покращення',
			[],
			TrueFalse,
		);
		this.simulationExercises = new Field(
			'simulation_exercises',
			Boolean,
			'Для симуляції',
			[],
			TrueFalse,
		);
		this.exercisesWithTheBallOnYourOwn = new Field(
			'exercises_with_the_ball_on_your_own',
			Boolean,
			"З м'ячем у власних руках",
			[],
			TrueFalse,
		);
		this.exercisesWithTheBallInPairs = new Field(
			'exercises_with_the_ball_in_pairs',
			Boolean,
			"З м'ячем у парах",
			[],
			TrueFalse,
		);
		this.exercisesWithTheBallInGroups = new Field(
			'exercises_with_the_ball_in_groups',
			Boolean,
			"З м'ячем у групах",
			[],
			TrueFalse,
		);
		this.exercisesInDifficultConditions = new Field(
			'exercises_in_difficult_conditions',
			Boolean,
			'У складних умовах',
			[],
			TrueFalse,
		);
		this.fromZone = new Field('from_zone', Number, 'Зона від');
		this.toZone = new Field('to_zone', Number, 'Зона до');
		this.timePerExercise = new Field('time_per_exercise', Number, 'Час на одну вправу');

		return this.proxify();
	}
}
