const prompt = require('prompt-sync')();

function ask(question){
  return prompt(question);
}

module.exports = {
  ask
}