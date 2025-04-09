const fs = require('fs');
const path = require('path');

const filePath = (fileName) => path.join(__dirname, `${fileName}.json`);

const readData = (fileName) => {
  const data = fs.readFileSync(filePath(fileName), 'utf8');
  return JSON.parse(data);
};

const writeData = (fileName, data) => {
  fs.writeFileSync(filePath(fileName), JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };