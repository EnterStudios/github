module.exports = function(response, msg, done) {
  msg.send(msg.newRichResponse({
    title: "Oops, the Github API returned with an error",
    color: 'danger',
    fields: [
      {
        "title": "Response Code",
        "value": response.statusCode,
        "short": true
      },
      {
        "title": "Error",
        "value": response.error,
        "short": true
      }
    ]
  }), done);
};
