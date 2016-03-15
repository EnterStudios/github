module.exports = function(robot) {
  var github = require("githubot")(robot);
  var url_api_base = "";

  if ((url_api_base = process.env.HUBOT_GITHUB_API) == null) {
    url_api_base = "https://api.github.com";
  }

  robot.respond(/github show\s+(me\s+)?(.*)\s+pulls(\s+with\s+)?(.*)?/i, { suggestions: ["github show me <repo> pulls"] }, function(msg, done) {
    var filter_reg_exp;
    var repo = github.qualified_repo(msg.match[2]);

    if (msg.match[3]) {
      filter_reg_exp = new RegExp(msg.match[4], "i");
    }

    github.get(url_api_base + "/repos/" + repo + "/pulls", function(pulls) {
      var summary = "";

      if (pulls.length === 0) {
        summary = "Achievement unlocked: open pull requests zero!";
      } else {
        var filtered_result = [];
        for (var i = 0; i < pulls.length; i++) {
          var pull = pulls[i];
          if (filter_reg_exp && pull.title.search(filter_reg_exp) < 0) {
            continue;
          }
          filtered_result.push(pull);
        }
        if (filtered_result.length === 0) {
          summary = "There's no open pull request for " + repo + " matching your filter!";
        } else if (filtered_result.length === 1) {
          summary = "There's only one open pull request for " + repo + ":";
        } else {
          summary = "I found " + filtered_result.length + " open pull requests for " + repo + ":";
        }
        for (i = 0; i < filtered_result.length; i++) {
          var pull = filtered_result[i];
          summary = summary + ("\n" + pull.title + " - " + pull.user.login + ": " + pull.html_url);
        }
      }

      msg.send(summary, done);
    });
  });

  robot.respond(/github show\s+(me\s+)?org\-pulls(\s+for\s+)?(.*)?/i, { suggestions: ["github show me org-pulls"] }, function(msg, done) {
    var org_name = msg.match[3] || process.env.HUBOT_GITHUB_ORG;

    if (!org_name) {
      msg.send("No organization specified, please provide one or set HUBOT_GITHUB_ORG accordingly.", done);
      return;
    }

    org_name = org_name.trim();
    var url = url_api_base + "/orgs/" + org_name + "/issues?filter=all&state=open&per_page=100";

    github.get(url, function(issues) {
      var summary = "";

      if (issues.length === 0) {
        summary = "Achievement unlocked: open pull requests zero!";
      } else {
        var filtered_result = [];
        for (var i = 0; i < issues.length; i++) {
          var issue = issues[i];
          if (issue.pull_request != null) {
            filtered_result.push(issue);
          }
        }

        if (filtered_result.length === 0) {
          summary = "Achievement unlocked: open pull requests zero!";
        } else if (filtered_result.length === 1) {
          summary = "There's only one open pull request for " + org_name + ":";
        } else {
          summary = "I found " + filtered_result.length + " open pull requests for " + org_name + ":";
        }
        for (i = 0; i < filtered_result.length; i++) {
          var issue = filtered_result[i];
          summary = summary + ("\n" + issue.repository.name + ": " + issue.title + " (" + issue.user.login + ") -> " + issue.pull_request.html_url);
        }
      }

      msg.send(summary, done);
    });
  });
};
