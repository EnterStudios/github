var _ = require("underscore");
var _s = require("underscore.string");

var ASK_REGEX = /show\s(me)?\s*(\d+|\d+\sof)?\s*(\S+'s|my)?\s*(\S+)?\s*issues\s*(for\s\S+)?\s*(about\s.+)?/i;

var parse_criteria = function(message) {
  var assignee, label, limit, me, query, ref, repo;
  ref = message.match(ASK_REGEX).slice(1), me = ref[0], limit = ref[1], assignee = ref[2], label = ref[3], repo = ref[4], query = ref[5];
  return {
    me: me,
    limit: limit != null ? parseInt(limit.replace(" of", "")) : void 0,
    assignee: assignee != null ? assignee.replace("'s", "") : void 0,
    label: label,
    repo: repo != null ? repo.replace("for ", "") : void 0,
    query: query != null ? query.replace("about ", "") : void 0
  };
};

var filter_issues = function(issues, arg) {
  var limit, query;
  limit = arg.limit, query = arg.query;
  if (query != null) {
    issues = _.filter(issues, function(i) {
      return _.any([i.body, i.title], function(s) {
        return _s.include(s.toLowerCase(), query.toLowerCase());
      });
    });
  }
  if (limit != null) {
    issues = _.first(issues, limit);
  }
  return issues;
};

var complete_assignee = function(msg, name) {
  var resolve;
  if (name === "my") {
    name = msg.message.user.name;
  }
  name = name.replace("@", "");
  resolve = function(n) {
    return process.env["HUBOT_GITHUB_USER_" + (n.replace(/\s/g, '_').toUpperCase())];
  };
  return resolve(name) || resolve(name.split(' ')[0]) || name;
};

module.exports = function(robot) {
  var github = require("githubot")(robot);

  robot.respond(ASK_REGEX, function(msg, done) {
    var base_url = process.env.HUBOT_GITHUB_API || 'https://api.github.com';
    var criteria = parse_criteria(msg.message.text);
    criteria.repo = github.qualified_repo(criteria.repo);
    if (criteria.assignee != null) {
      criteria.assignee = complete_assignee(msg, criteria.assignee);
    }
    var query_params = {
      state: "open",
      sort: "created"
    };
    if (criteria.label != null) {
      query_params.labels = criteria.label;
    }
    if (criteria.assignee != null) {
      query_params.assignee = criteria.assignee;
    }

    github.get(base_url + "/repos/" + criteria.repo + "/issues", query_params, function(issues) {
      var assignee, issue, j, label, labels, len, results;
      var issues = filter_issues(issues, criteria);
      if (_.isEmpty(issues)) {
        msg.send("No issues found.", done);
      } else {
        results = [];
        for (j = 0, len = issues.length; j < len; j++) {
          issue = issues[j];
          labels = ((function() {
            var k, len1, ref, results1;
            ref = issue.labels;
            results1 = [];
            for (k = 0, len1 = ref.length; k < len1; k++) {
              label = ref[k];
              results1.push("#" + label.name);
            }
            return results1;
          })()).join(" ");
          assignee = issue.assignee ? " (" + issue.assignee.login + ")" : "";
          results.push("[" + issue.number + "] " + issue.title + " " + labels + assignee + " = " + issue.html_url);
        }

        msg.send(results, done);
      }
    });
  });
};
