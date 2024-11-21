import { PUBLIC_API_URL } from '$env/static/public';

class Player {
  constructor(id = null) {
    this.id = id;
    this.firstName = '';
    this.lastName = '';
    this.age = '';
    this.weight = 0;
    this.height = 0;
    this.amplua = '';
    this.imageURL = '';
  }

  async get(id = this.id) {
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
    this.imageURL = data.image_url;
  }

}

class Players {
  constructor() {
    this.players = [];
    this.rawData = [];
    this.totalPages = 0;
  }

  async get(size = 100, page = 1) {
    return fetch(`${PUBLIC_API_URL}/players?size=${size}&page=${page}`)
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
      const player = new Player();
      player.parseData(data[i]);
      this.players.push(player);
    }
  }
}

export { Player, Players };