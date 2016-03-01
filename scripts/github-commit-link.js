module.exports = function(robot) {
  var github = require("githubot")(robot);

  robot.hear(/^.*?\b(?:([^\s@]+)@)?([0-9a-f]{7,40})\b.*$/i, function(msg, done) {
    var commit_sha = msg.match[2];
    var bot_github_repo = "";
    var issue_title = "";
    var base_url = process.env.HUBOT_GITHUB_API || 'https://api.github.com';

    if (msg.match[1] != null) {
      bot_github_repo = github.qualified_repo(msg.match[1]);
    } else {
      bot_github_repo = github.qualified_repo(process.env.HUBOT_GITHUB_REPO);
    }

    if(bot_github_repo === "") {
      msg.send("Couldn't find the commit " + commit_sha + ", specify a repo or set a default repo with `setenv HUBOT_GITHUB_REPO=user/repo`", done);
      return;
    }

    github.get((base_url + "/repos/" + bot_github_repo + "/commits/") + commit_sha, function(commit_obj) {
      var url;
      if (process.env.HUBOT_GITHUB_API) {
        url = commit_obj.url.replace(/api\/v3\//, '');
      } else {
        url = commit_obj.url.replace(/api\./, '');
      }
      url = url.replace(/repos\//, '');
      url = url.replace(/commits/, 'commit');
      msg.send("Commit: " + commit_obj.commit.message.split("\n")[0] + "\n" + url, done);
    });
  });
};
