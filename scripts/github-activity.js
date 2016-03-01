// Generated by CoffeeScript 1.10.0
(function() {
  require('date-utils');

  module.exports = function(robot) {
    var github;
    github = require("githubot")(robot);
    return robot.respond(/repo show (.*)$/i, function(msg) {
      var base_url, repo, url;
      repo = github.qualified_repo(msg.match[1]);
      base_url = process.env.HUBOT_GITHUB_API || 'https://api.github.com';
      url = base_url + "/repos/" + repo + "/commits";
      return github.get(url, function(commits) {
        var c, d, i, len, results, send;
        if (commits.message) {
          return msg.send("Achievement unlocked: [NEEDLE IN A HAYSTACK] repository " + commits.message + "!");
        } else if (commits.length === 0) {
          return msg.send("Achievement unlocked: [LIKE A BOSS] no commits found!");
        } else {
          msg.send("https://github.com/" + repo);
          send = 5;
          results = [];
          for (i = 0, len = commits.length; i < len; i++) {
            c = commits[i];
            if (send) {
              d = new Date(Date.parse(c.commit.committer.date)).toFormat("DD/MM HH24:MI");
              msg.send("[" + d + " -> " + c.commit.committer.name + "] " + c.commit.message);
              results.push(send -= 1);
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      });
    });
  };

}).call(this);
