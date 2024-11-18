import { PUBLIC_API_URL } from '$env/static/public';

class Player {
  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.age = '';
    this.weight = 0;
    this.height = 0;
    this.amplua = '';
  }

  async get(id) {
    return fetch(`${PUBLIC_API_URL}/players/${id}`)
      .then(response => response.json())
      .then(json => json)
      .catch(error => console.error(error));
  }

  parseData(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.age = data.age;
    this.weight = data.weight;
    this.height = data.height;
    this.amplua = data.amplua;
  }

}

class Players {
  constructor() {
    this.players = [];
    this.rawData = [];
  }

  async get() {
    return fetch(`${PUBLIC_API_URL}/players/`, {mode: 'no-cors'})
      .then(response => response.json())
      .then(json => json)
      .then(json => { this.rawData = json; return json })
      .catch(error => console.log(error));
  }

  parseData(data) {
    for (let i = 0; i < data.length; i++) {
      const player = new Player();
      player.parseData(data[i]);
      this.players.push(player);
    }
  }
}

export { Player, Players };