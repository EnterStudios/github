// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function(robot) {
    var github;
    github = require("githubot")(robot);
    return robot.hear(/^.*?\b(?:([^\s@]+)@)?([0-9a-f]{7,40})\b.*$/i, function(msg) {
      var base_url, bot_github_repo, commit_sha, issue_title;
      if (process.env.HUBOT_GITHUB_REPO && process.env.HUBOT_GITHUB_TOKEN) {
        if (!(msg.message.text.match(/commit\//))) {
          commit_sha = msg.match[2];
          if (msg.match[1] != null) {
            bot_github_repo = github.qualified_repo(msg.match[1]);
          } else {
            bot_github_repo = github.qualified_repo(process.env.HUBOT_GITHUB_REPO);
          }
          issue_title = "";
          base_url = process.env.HUBOT_GITHUB_API || 'https://api.github.com';
          return github.get((base_url + "/repos/" + bot_github_repo + "/commits/") + commit_sha, function(commit_obj) {
            var url;
            if (process.env.HUBOT_GITHUB_API) {
              url = commit_obj.url.replace(/api\/v3\//, '');
            } else {
              url = commit_obj.url.replace(/api\./, '');
            }
            url = url.replace(/repos\//, '');
            url = url.replace(/commits/, 'commit');
            return msg.send("Commit: " + commit_obj.commit.message.split("\n")[0] + "\n" + url);
          });
        }
      } else {
        return msg.send("Hey! You need to set HUBOT_GITHUB_REPO and HUBOT_GITHUB_TOKEN before I can link to that commit.");
      }
    });
  };

}).call(this);
