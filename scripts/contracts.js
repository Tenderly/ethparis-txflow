const fs = require('fs');

const files = fs.readdirSync('./build/contracts/');
const payload = [];
for (const file of files) {
  payload.push(JSON.parse(fs.readFileSync(`./build/contracts/${file}`).toString()));
}

fs.writeFileSync('./ui/src/services/contract/contracts-mock.json', JSON.stringify(payload));
