var request = require('request');
var fs = require('fs');
var tokenfile  = require('./secrets.js');   // references github secret token
var dir = "./avatars/";           // pathname to be used to store images of avatars

var args = process.argv.slice(2);  /* to capture command line arguments */
var param1   = args[0];           // first command line arg.
var param2   = args[1];           // 2nd command line arg.

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {

    url     : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers : {
      'Authorization': "token "+ tokenfile.GITHUB_TOKEN,
      'User-Agent'   : 'request'
    }
  };

  if ((!param1) || (!param2)){      // if either or or both arguments missing
    console.log("Please supply a valid reponame and/or valid contributor");
    console.log("Eg.  node download_avatars jquery  jquery");
    return;                         // similar to an exit 0
''}

  request(options, function(err, res, body) {
    cb(err, body);
    if (!err && res.statusCode ==200){  // no errors and request successful
      var info = JSON.parse(body);     // build the array of JSON objects from the jquery call
      if (!fs.existsSync(dir)){       // if directory doesnt exist
        fs.mkdirSync(dir);            // make it
      } else {
          console.log("Directory already exists!");   // prevents attemtping to recreate existing dir.
        }
        info.forEach(printAvatarUrl);   // parse the JSON object, exec callback fxn on each json object.
    }
    else {
      console.log('Error');
      console.log(body);
    }
  });
}

function downloadImageByUrl(url, filePath){
// Using the URL provided , attempt to retrieve the contents and dump those contents to
// the pathname supplied via "filepath"
  request.get(url)                                           // Note 1
       .on('error', function (err) {                         // Note 2
         throw err;
       })
       .on('response', function (response) {                // Note 3
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream(filePath))     // dump the contents to the filesystem
       .on('finish',function() {
         console.log('Download complete...');
       });
}

function printAvatarUrl(avatar){
  // This function picks up the login and avatar_url fields from the JSON object passed in.
  // calls uses this info. to generate a filename and directory
  var extension = ".jpg";
  var fpath = dir + avatar['login']+ extension;           // setup the directory using avatar info
  downloadImageByUrl(avatar['avatar_url'], fpath);        // send the url and filepath to download function
}

getRepoContributors(param1, param2, function(err, result) {  // call main routine
  console.log("Errors:", err);
  console.log("Result:", result);
});