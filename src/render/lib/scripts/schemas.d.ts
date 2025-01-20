interface iModel {
    // alias for serialization name in frontend: name in backend
    serializationAlias: { [key: string]: string }
    // alias for deserialization name in backend: name in frontend
    deserializationAlias: { [key: string]: string }

    // you can specify one of serializationAlias or deserializationAlias in constructor
    // it will increate start time of application, but will increase code readability
}

export interface iPlayer extends iModel {
    readonly id: number
    firstName: string
    lastName: string
    age: number
    weight: number
    height: number
    imageFileId: string
    teams: number[]
}

export interface iTeam extends iModel {
    readonly id: number
    name: string
    players: number[]
}

export interface iGame extends iModel {
    readonly id: number
    name: string
    description: string
    fromDatetime: Date
    toDatetime: Date
    teamA: number
    teamB: number
}

export interface iStatus extends iModel {
    readonly id: number
    status: string
    detail: string
}

export interface iPlayerTeam extends iModel {
    playerId: number
    teamId: number
    amplua: string
}

export interface iAction extends iModel {
    id: number
    game: number
    team: number
    player: number
    subtech: number
    from_zone: number
    to_zone: number
    impact: string
}

export interface iTech extends iModel {
    id: number
    name: string
    description: string
}

export interface iSubtech extends iModel {
    id: number
    name: string
    description: string
    techId: number
}

