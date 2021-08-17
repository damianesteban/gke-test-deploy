

(() => {

  const loc =  require('./package.json') || require('../package.json');
  console.log(loc.version);

  // if (!tsLocation) {
  //   console.log('No TS File. Setting to JS');
  //   console.log('JS Location: ' + jsLocation);
  // }


})();
