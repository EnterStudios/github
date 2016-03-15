module.exports = function(robot) {
  var github = require("githubot")(robot);

  robot.respond(/github merge ([-_\.0-9a-zA-Z]+\/[-_\.0-9a-zA-Z]+)(\/([-_\.a-zA-z0-9\/]+))? into ([-_\.a-zA-z0-9\/]+)$/i, { suggestions: ["github merge project_name/<sha> into <base>"] }, function(msg, done) {
    var app = msg.match[1];
    var head = msg.match[3] || "master";
    var base = msg.match[4];
    github.branches(app).merge(head, {
      base: base
    }, function(merge) {
      if (merge.message) {
        msg.send(merge.message, done);
      } else {
        msg.send("Merged the crap out of it", done);
      }
    });
  });
};
