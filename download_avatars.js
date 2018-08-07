var request = require('request');
var tokenfile  = require('./secrets.js');

// var args = process.argv.slice(2);  /* to capture command line arguments */



console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {


  var options = {
    //repoName = "promises-exercises";
    //repoOwner = "";

    url     : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers : {
      'Authorization': "token "+ tokenfile.GITHUB_TOKEN,
      'User-Agent'   : 'request'
    }
  };

    request(options, function(err, res, body) {
      cb(err, body);
      if (!err && res.statusCode ==200){
        var info = JSON.parse(body);        // get the data from the url
        console.log(info);
        info.forEach(printAvatarUrl);
      }
      else {
        console.log('Error');
        console.log(body);
      }
    });



  // ...
}


function printAvatarUrl(avatar){
  console.log("Avatar Url:" + avatar['avatar_url']);
}


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});