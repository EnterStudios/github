var githubErrorHandler = require('./error');

module.exports = function(robot) {
  var github = require("githubot")(robot);

  var read_contributors = function(msg, done, response_handler) {
    var repo = github.qualified_repo(msg.match[1]);
    var base_url = process.env.HUBOT_GITHUB_API || 'https://api.github.com';
    var url = base_url + "/repos/" + repo + "/contributors";

    github.handleErrors(function(response) { githubErrorHandler(response, msg, done); });

    github.get(url, function(commits) {
      if (commits.message) {
        msg.send("Achievement unlocked: [NEEDLE IN A HAYSTACK] repository " + commits.message + "!", done);
      } else if (commits.length === 0) {
        msg.send("Achievement unlocked: [LIKE A BOSS] no commits found!", done);
      } else {
        response_handler(commits);
      }
    });
  };

  robot.respond(/github repo committers (.*)$/i, { suggestions: ["github repo committers <repo>"] }, function(msg, done) {
    read_contributors(msg, done, function(commits) {
      var max_length = 20;
      var results = [];

      for (var i = 0; i < Math.min(commits.length, max_length); i++) {
        commit = commits[i];
        results.push("[" + commit.login + "] Contributions: " + commit.contributions);
      }

      msg.send(results, done);
    });
  });

  robot.respond(/github repo top-committers? (.*)$/i, { suggestions: ["github repo top-committers <repo>"] }, function(msg, done) {
    read_contributors(msg, done, function(commits) {
      var top_commiter = null;
      for (var i = 0; i < commits.length; i++) {
        var commit = commits[i];
        if (top_commiter === null) {
          top_commiter = commit;
        }
        if (commit.contributions > top_commiter.contributions) {
          top_commiter = commit;
        }
      }
      msg.send("[" + top_commiter.login + "] " + top_commiter.contributions + " :trophy:", done);
    });
  });
};
