import Field from '$lib/scripts/field';
import Model from '$lib/scripts/model';
import Datatype from '$lib/scripts/datatype';
import { getAmplua, getImpact, getTrueFalse, t } from '$lib/utils/utils';

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
		this.name = new Field('name', String, t('common.name'));
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

		this.player = new Field('player', NameWithIdType, t('titles.player'), ['name']);
		this.team = new Field('team', NameWithIdType, t('titles.team'), ['name']);
		this.amplua = new Field('amplua', String, t('titles.amplua'), [], getAmplua());

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
		this.firstName = new Field('first_name', String, t('fields.firstName'));
		this.lastName = new Field('last_name', String, t('fields.lastName'));
		this.age = new Field('age', Number, t('fields.age'));
		this.weight = new Field('weight', Number, t('fields.weight'));
		this.height = new Field('height', Number, t('fields.height'));
		this.imageFile = new Field('image_file', String, t('fields.imageLink'));
		this.teams = new Field('teams', new Datatype([PlayerTeam]), t('titles.teams'));
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
		this.name = new Field('name', String, t('common.name'));
		this.players = new Field('players', new Datatype([PlayerTeam]), t('titles.players'));

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
		this.name = new Field('name', String, t('common.name'));
		this.description = new Field('description', BigString, t('fields.description'));
		this.fromDatetime = new Field('from_datetime', Datetime, t('fields.startDate'));
		this.toDatetime = new Field('to_datetime', Datetime, t('fields.endDate'));
		this.teamA = new Field('team_a', NameWithIdType, t('fields.teamA'), ['name']);
		this.teamB = new Field('team_b', NameWithIdType, t('fields.teamB'), ['name']);

		return this.proxify();
	}
}

export class Status extends Model {
	status: any;
	detail: any;

	constructor() {
		super();

		this.status = new Field('status', String, t('fields.status'));
		this.detail = new Field('detail', String, t('fields.details'));

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
		this.game = new Field('game', NameWithIdType, t('titles.game'), ['name']);
		this.team = new Field('team', NameWithIdType, t('titles.team'), ['name']);
		this.player = new Field('player', NameWithIdType, t('titles.player'), ['name']);
		this.subtech = new Field('subtech', NameWithIdType, t('titles.subtech'), ['name']);
		this.from_zone = new Field('from_zone', Number, t('fields.fromZone'));
		this.to_zone = new Field('to_zone', Number, t('fields.toZone'));
		this.impact = new Field('impact', String, t('fields.qualityIndicator'), [], getImpact());

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
		this.name = new Field('name', String, t('common.name'));
		this.description = new Field('description', BigString, t('fields.description'));

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
		this.name = new Field('name', String, t('common.name'));
		this.description = new Field('description', BigString, t('fields.description'));
		this.difficulty = new Field('difficulty', Number, t('fields.difficulty'));
		this.tech = new Field('tech', NameWithIdType, t('fields.technicalAction'), ['name']);

		return this.proxify();
	}
}

export class Exercise extends Model {
	id: any;
	name: any;
	description: any;
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
	subtechs: any;

	constructor() {
		super();

		this.id = new Field('id', Number);
		this.name = new Field('name', String, t('common.name'));
		this.description = new Field('description', BigString, t('fields.description'));
		this.subtechs = new Field('subtechs', new Datatype([ExerciseSubtech]), t('fields.subtechs'))
		this.imageUrl = new Field('image_url', String, t('fields.imageLink'));
		this.videoUrl = new Field('video_url', String, t('fields.videoLink'));
		this.difficulty = new Field('difficulty', Number, t('fields.difficulty'));
		this.exercisesForLearning = new Field(
			'exercises_for_learning',
			Boolean,
			t('fields.forLearning'),
			[],
			getTrueFalse(),
		);
		this.exercisesForConsolidation = new Field(
			'exercises_for_consolidation',
			Boolean,
			t('fields.forConsolidation'),
			[],
			getTrueFalse(),
		);
		this.exercisesForImprovement = new Field(
			'exercises_for_improvement',
			Boolean,
			t('fields.forImprovement'),
			[],
			getTrueFalse(),
		);
		this.simulationExercises = new Field(
			'simulation_exercises',
			Boolean,
			t('fields.forSimulation'),
			[],
			getTrueFalse(),
		);
		this.exercisesWithTheBallOnYourOwn = new Field(
			'exercises_with_the_ball_on_your_own',
			Boolean,
			t('fields.withBallOwn'),
			[],
			getTrueFalse(),
		);
		this.exercisesWithTheBallInPairs = new Field(
			'exercises_with_the_ball_in_pairs',
			Boolean,
			t('fields.withBallPairs'),
			[],
			getTrueFalse(),
		);
		this.exercisesWithTheBallInGroups = new Field(
			'exercises_with_the_ball_in_groups',
			Boolean,
			t('fields.withBallGroups'),
			[],
			getTrueFalse(),
		);
		this.exercisesInDifficultConditions = new Field(
			'exercises_in_difficult_conditions',
			Boolean,
			t('fields.inDifficultConditions'),
			[],
			getTrueFalse(),
		);
		this.fromZone = new Field('from_zone', Number, t('fields.fromZone'));
		this.toZone = new Field('to_zone', Number, t('fields.toZone'));
		this.timePerExercise = new Field('time_per_exercise', Number, t('fields.timePerOneExercise'));

		return this.proxify();
	}
}

export class PlayerSum extends Model {
	nameWithId: any
	sumActions: any
	prozent: any

	constructor() {
		super()

		this.nameWithId = new Field('player', NameWithIdType)
		this.sumActions = new Field('sum_actions', Number, t('fields.actionCount'))
		this.prozent = new Field('prozent', Number, t('fields.percentageOfAll'))
		
		return this.proxify();
	}
}

export class TechSum extends Model {
	nameWithId: any
	player: any
	sumActions: any
	prozent: any

	constructor() {
		super()
		
		this.nameWithId = new Field('tech', NameWithIdType)
		this.player = new Field('player', Number, t('titles.player'))
		this.sumActions = new Field('sum_actions', Number, t('fields.actionCount'))
		this.prozent = new Field('prozent', Number, t('fields.percentageOfAll'))
		
		return this.proxify();
	}
}

export class SubtechSum extends Model {
	nameWithId: any
	tech: any
	player: any
	sumActions: any
	prozent: any

	constructor() {
		super()
		
		this.nameWithId = new Field('subtech', NameWithIdType)
		this.tech = new Field('tech', Number, t('titles.tech'))
		this.player = new Field('player', Number, t('titles.player'))
		this.sumActions = new Field('sum_actions', Number, t('fields.actionCount'))
		this.prozent = new Field('prozent', Number, t('fields.percentageOfAll'))
		
		return this.proxify();
	}
}

export class ImpactSum extends Model {
	impact: any
	subtech: any
	tech: any
	player: any
	sumActions: any
	prozent: any

	constructor() {
		super()
		
		this.impact = new Field('impact', String, t('fields.qualityIndicator'), [], getImpact())
		this.subtech = new Field('subtech', Number, t('titles.subtech'))
		this.tech = new Field('tech', Number, t('titles.tech'))
		this.player = new Field('player', Number, t('titles.player'))
		this.sumActions = new Field('sum_actions', Number, t('fields.actionCount'))
		this.prozent = new Field('prozent', Number, t('fields.percentageOfAll'))
		
		return this.proxify();
	}
}

export class ZoneSum extends Model {
	zone: any
	impact: any
	subtech: any
	tech: any
	player: any
	sumActions: any
	prozent: any

	constructor() {
		super()
		
		this.zone = new Field('zone', String, t('fields.zone'))
		this.impact = new Field('impact', String, t('fields.qualityIndicator'), [], getImpact())
		this.subtech = new Field('subtech', Number, t('titles.subtech'))
		this.tech = new Field('tech', Number, t('titles.tech'))
		this.player = new Field('player', Number, t('titles.player'))
		this.sumActions = new Field('sum_actions', Number, t('fields.actionCount'))
		this.prozent = new Field('prozent', Number, t('fields.percentageOfAll'))
		
		return this.proxify();
	}
}


export class PlayerStats extends Model {
	playerSum: any
	techTop: any

	constructor() {
		super()
		
		this.playerSum = new Field('player_sum', new Datatype(PlayerSum), t('titles.player'))
		this.techTop = new Field('tech_top', new Datatype([TechSum]))
		
		return this.proxify();
	}
}

export class TechStats extends Model {
	techTop: any
	subtechTop: any

	constructor() {
		super()
		
		this.techTop = new Field('tech_top', new Datatype(TechSum))
		this.subtechTop = new Field('subtech_top', new Datatype([SubtechSum]))
		
		return this.proxify();
	}
}

export class SubtechStats extends Model {
	subtechTop: any
	impactTop: any

	constructor() {
		super()
		
		this.subtechTop = new Field('subtech_top', new Datatype(SubtechSum))
		this.impactTop = new Field('impact_top', new Datatype([ImpactSum]))
		
		return this.proxify();
	}
}

export class ImpactStats extends Model {
	impactTop: any
	zoneTop: any

	constructor() {
		super()
		
		this.impactTop = new Field('impact_top', new Datatype(ImpactSum))
		this.zoneTop = new Field('zone_top', new Datatype([ZoneSum]))
		
		return this.proxify();
	}
}


export class PlanWeek extends Model {
	exercises: any
	week: any

	constructor() {
		super()

		this.exercises = new Field('exercises', new Datatype([Exercise]))
		this.week = new Field('week', Number)

		return this.proxify();
	}
}

export class Login extends Model {
	accessToken: any;
	refreshToken: any;
	expiresIn: any;

	constructor() {
		super();

		this.accessToken = new Field('access_token', String, t('fields.accessToken'));
		this.refreshToken = new Field('refresh_token', String, t('fields.refreshToken'));
		this.expiresIn = new Field('expires_in', Number, t('fields.tokenExpiry'));

		return this.proxify();
	}
}

export class Register extends Model {
	username: any;
	password: any;
	firstName: any;
	lastName: any;

	constructor() {
		super();

		this.username = new Field('username', String, t('fields.username'));
		this.password = new Field('password', String, t('fields.password'));
		this.firstName = new Field('first_name', String, t('fields.firstName'));
		this.lastName = new Field('last_name', String, t('fields.lastName'));

		return this.proxify();
	}
}

export class ExerciseSubtech extends Model {
	exercise: any;
	subtech: any;

	constructor() {
		super();

		this.exercise = new Field('exercise', NameWithIdType, t('titles.exercise'), ['name']);
		this.subtech = new Field('subtech', NameWithIdType, t('titles.subtech'), ['name']);

		return this.proxify();
	}
}
