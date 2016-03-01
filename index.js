var path = require('path');

module.exports = function(robot) {
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-activity.js");
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-committers.js");
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-issues.js");
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-merge.js");
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-pulls.js");
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-search.js");
  robot.loadFile(path.resolve(__dirname, "scripts"), "github-status.js");
};
