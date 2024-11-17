import { PUBLIC_API_URL } from '$env/static/public';

class Game {
  constructor(id = null) {
    this.id = id;
    this.name = '';
    this.description = '';
    this.fromDatetime = '';
    this.toDatetime = '';
    this.teamA = [];
    this.teamB = [];
  }

  async getGame(id = this.id) {
    return fetch(`${PUBLIC_API_URL}/games/${id}`)
      .then(response => response.json())
      .then(json => json)
      .catch(error => console.error(error));
  }

  parseData(data) {
    this.name = data.name;
    this.description = data.description;
    this.fromDatetime = data.from_datetime;
    this.toDatetime = data.to_datetime;
    this.teamA = data.team_a;
    this.teamB = data.team_b;
  }

}

class Games {
  constructor() {
    this.games = [];
    this.rawData = [];
  }

  async getPlayers() {
    return fetch(`${PUBLIC_API_URL}/games/`)
      .then(response => response.json())
      .then(json => json)
      .then(json => { this.rawData = json; return json })
      .catch(error => console.log(error));
  }

  parseData(data) {
    for (let i = 0; i < data.length; i++) {
      const game = new Game();
      game.parseData(data[i]);
      this.games.push(game);
    }
  }
}

export { Game, Games };