module.exports = function(robot) {
  var github = require('githubot')(robot);

  robot.respond(/github search (.+\/[^\s]+)\s+(.+)/i, { suggestions: ["github search <repo> <query>"] }, function(msg, done) {
    var e, error, in_repo, query, repo, repostr;
    try {
      var repo = msg.match[1];
      var query = msg.match[2].trim();
      var repostr = '';
      var in_repo = '';

      if (repo) {
        repostr = "+repo:" + repo;
        in_repo = " in repo " + repo;
      }

      github.handleErrors(function(response) {
        msg.send("Error: " + response.statusCode + " " + response.error, done);
      });

      github.get("search/code?q=" + (encodeURIComponent(query)) + repostr + "&sort=indexed", function(data) {
        var broken, first_n, found, i, item, len, ref, resp;
        resp = '';
        found = 0;
        if (data.total_count === 0) {
          msg.send("Didn't find \"" + query + "\"" + in_repo, done);
          return;
        }

        ref = data.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (found === 5) {
            broken = true;
            break;
          }
          resp += "\n - " + item.name + ": " + item.html_url;
          found += 1;
        }
        first_n = '';
        if (broken) {
          first_n = ", first 5";
          resp += "\nMore: https://github.com/search?q=" + (encodeURIComponent(query)) + repostr + "&type=Code&s=indexed";
        }

        msg.send("Searched for \"" + query + "\"" + in_repo + " and found " + data.total_count + " results" + first_n + ": " + resp, done);
      });
    } catch (error) {
      e = error;
      console.log("GitHub Search failed", e);
    }
  });
};
