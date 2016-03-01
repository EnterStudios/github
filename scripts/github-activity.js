require('date-utils');

module.exports = function(robot) {
  var github = require("githubot")(robot);

  robot.respond(/gh repo show (.*)$/i, function(msg, done) {
    var repo = github.qualified_repo(msg.match[1]);
    var base_url = process.env.HUBOT_GITHUB_API || 'https://api.github.com';
    var url = base_url + "/repos/" + repo + "/commits";

    github.get(url, function(commits) {
      if (commits.message) {
        msg.send("Achievement unlocked: [NEEDLE IN A HAYSTACK] repository " + commits.message + "!", done);
      } else if (commits.length === 0) {
        msg.send("Achievement unlocked: [LIKE A BOSS] no commits found!", done);
      } else {
        msg.send("https://github.com/" + repo).then(function() {
          var results = [];
          for (var i = 0; i < Math.min(commits.length, 5); i++) {
            var c = commits[i];
            var d = new Date(Date.parse(c.commit.committer.date)).toFormat("DD/MM HH24:MI");
            results.push("[" + d + " -> " + c.commit.committer.name + "] " + c.commit.message);
          }
          msg.send(results, done);
        });
      }
    });
  });
};
