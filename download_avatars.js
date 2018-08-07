var request = require('request');
var fs = require('fs');

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
}

function downloadImageByUrl(url, filePath){

  request.get(url)                                           // Note 1
       .on('error', function (err) {                         // Note 2
         throw err;
       })
       .on('response', function (response) {                // Note 3
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream(filePath))
       .on('finish',function() {
         console.log('Download complete...');
       });

}


function printAvatarUrl(avatar){
  console.log("Avatar Url:" + avatar['avatar_url']);
}

//getRepoContributors("jquery", "jquery", function(err, result) {
//  console.log("Errors:", err);
//  console.log("Result:", result);
//});

downloadImageByUrl("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");