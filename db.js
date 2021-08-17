
class DataStore {
  #data;
  #isDataSet
  
  constructor() {
    this.#data = [];
  }

  set data(data) {
    this.#data = data;
    this.#isDataSet = true;
  }

  get data() {
    return this.#data;
  }
}

const dataStore = new DataStore();
Object.freeze(dataStore);

module.exports = dataStore;
