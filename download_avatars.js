var request = require('request');
var fs = require('fs');
var tokenfile  = require('./secrets.js');
var dir = "./avatars/";

// var args = process.argv.slice(2);  /* to capture command line arguments */

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {

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
        //console.log(info);
        if (!fs.existsSync(dir)){       // if directory doesnt exist
         fs.mkdirSync(dir);            // make it
        } else {
            console.log("Directory already exists!");
        }
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
  var extension = ".jpg";
  var fpath = dir + avatar['login']+ extension;

  downloadImageByUrl(avatar['avatar_url'], fpath);
}
getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

//downloadImageByUrl("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");