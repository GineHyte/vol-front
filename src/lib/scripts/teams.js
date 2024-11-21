import { PUBLIC_API_URL } from '$env/static/public';
import { Player } from './players';
import { pushNotification } from '$lib/utils/utils';

class Team {
  constructor(id = null) {
    this.id = id;
    this.name = '';
    this.players = [];
    this.coach = '';
  }

  async get(id = this.id) {
    if (id === null) {
      pushNotification({title: "Error", message: 'No Team id provided', kind: 'error' });
      return Promise.reject('No id provided');
    }
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

  async get(size = 100, page = 1) {
    return fetch(`${PUBLIC_API_URL}/teams?size=${size}&page=${page}`)
      .then(response => response.json())
      .then(json => {
        this.rawData = json.items;
        this.totalPages = json.pages;
        return json
      })
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