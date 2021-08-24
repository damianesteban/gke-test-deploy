
class DataStore {
  #data;
  #isDataSet
  #moreData;
  
  constructor() {
    this.#data = [{ name: 'Andrew' }, { name: 'Briana' }, { name: 'Cindy' }];
    this.#moreData = [{ name: 'Drew' }, { name: 'Evan' }, { name: 'Finn' }];
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

module.exports =  { store: dataStore }
