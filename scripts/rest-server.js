const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

module.exports = function(app) {
  app.use(bodyParser.json());

  app.get("/close/demo", function(req, res) {
    fs.writeFileSync(
      path.resolve(__dirname, "./_demo.js"),
      "module.exports = null;"
    );
    res.json({});
  });
};
