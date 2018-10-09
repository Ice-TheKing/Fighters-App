const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const background = fs.readFileSync(`${__dirname}/../hosted/bkd.jpg`);
const icon = fs.readFileSync(`${__dirname}/../hosted/icon.png`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(bundle);
  response.end();
};

const getBackground = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/jpg' });
  response.write(background);
  response.end();
};

const getIcon = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(icon);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBundle,
  getBackground,
  getIcon
};
