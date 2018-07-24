const fs = require("fs");
const path = require("path");

let file = process.argv.slice(2)[0];
console.log(path.relative(__dirname, file));

fs.writeFileSync(
  "./scripts/_demo.js",
  `module.exports = {
  view: require('${path.relative(__dirname, file).replace(/\\/g, "/")}')
};`
);
