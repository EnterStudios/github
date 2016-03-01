module.exports = function(robot) {

  var formatString = function(string) {
    return decodeURIComponent(string.replace(/(\n)/gm, " "));
  };

  var status = function(msg, done) {
    robot.http('https://status.github.com/api/status.json').get()(function(err, res, body) {
      var date, json, now, secondsAgo;
      json = JSON.parse(body);
      now = new Date();
      date = new Date(json['last_updated']);
      secondsAgo = Math.round((now.getTime() - date.getTime()) / 1000);
      msg.send("Status: " + json['status'] + " (" + secondsAgo + " seconds ago)", done);
    });
  };

  var lastMessage = function(msg, done) {
    robot.http('https://status.github.com/api/last-message.json').get()(function(err, res, body) {
      var date, json;
      json = JSON.parse(body);
      date = new Date(json['created_on']);
      msg.send(("Status: " + json['status'] + "\n") + ("Message: " + (formatString(json['body'])) + "\n") + ("Date: " + (date.toLocaleString())), done);
    });
  };

  var statusMessages = function(msg, done) {
    robot.http('https://status.github.com/api/messages.json').get()(function(err, res, body) {
      var buildMessage, json, message;
      json = JSON.parse(body);
      buildMessage = function(message) {
        var date;
        date = new Date(message['created_on']);
        return "[" + message['status'] + "] " + (formatString(message['body'])) + " (" + (date.toLocaleString()) + ")";
      };
      msg.send(((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = json.length; i < len; i++) {
          message = json[i];
          results.push(buildMessage(message));
        }
        return results;
      })()).join('\n'), done);
    });
  };

  robot.respond(/gh status$/i, function(msg, done) {
    status(msg, done);
  });

  robot.respond(/gh status last$/i, function(msg, done) {
    lastMessage(msg, done);
  });

  robot.respond(/gh status messages$/i, function(msg, done) {
    statusMessages(msg, done);
  });
};

