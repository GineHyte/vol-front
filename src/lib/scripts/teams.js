import { PUBLIC_API_URL } from '$env/static/public';
import { Player } from './players';

class Team {
  constructor() {
    this.name = '';
    this.players = [];
    this.coach = '';
  }

  async getTeam(id) {
    return fetch(`${PUBLIC_API_URL}/teams/${id}`)
      .then(response => response.json())
      .then(json => json)
      .catch(error => console.error(error));
  }

  parseData(data) {
    this.name = data.name;
    this.players = data.players;
    this.coach = data.coach;
  }

}

class Teams {
  constructor() {
    this.teams = [];
    this.rawData = [];
  }

  async getTeams() {
    return fetch(`${PUBLIC_API_URL}/teams/`)
      .then(response => response.json())
      .then(json => json)
      .then(json => { this.rawData = json; return json })
      .catch(error => console.log(error));
  }

  parseData(data) {
    for (let i = 0; i < data.length; i++) {
      const team = new Team();
      team.parseData(data[i]);
      this.teams.push(team);
    }
  }
}

export { Team, Teams };