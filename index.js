var path = require('path');

module.exports = function(robot) {
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-activity.js");
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-commit-link.js");
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-committers.js");
};
