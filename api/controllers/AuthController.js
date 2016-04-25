


      var fs = require('fs');
      var el = require('email-existence');
      var readline = require('readline');
      var google = require('googleapis');
      var googleAuth = require('google-auth-library');
      var download = require('file-download');
      var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
     /* var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
          process.env.USERPROFILE) + '/.credentials/';*/
      var TOKEN_DIR = '/home/kousik/Desktop/Authentication/';
      var TOKEN_PATH = TOKEN_DIR + 'gmail-api-AuthController.json';
     /* var json = require('json');*/

      var auth;       
      var oauth2Client;
      //Microsoft outlook
      var credentials = {
          clientID: "b2ebd0f7-70f0-42fc-97e3-5527d2adeec5",
          clientSecret: "24xD5jE46nfo9cUfiZ1c4L3",
          site: "https://login.microsoftonline.com/common",
          authorizationPath: "/oauth2/v2.0/authorize",
          tokenPath: "/oauth2/v2.0/token"
        }
        var oauth2 = require("simple-oauth2")(credentials);
        var redirectUri = "http://localhost:8000/authorize";
        // The scopes the app requires
        var scopes = [ "openid", "https://outlook.office.com/mail.read" ];


      //
       module.exports = {
        upload: function (req, res) {
          sails.log.debug('req.body',req.body);
          File.upload(req.body, function(err, data){
            if (!err) {
              sails.log.debug("File is uploaded");
              res.json(data);

                  } else {
                      res.negotiate(err);
                  }
          });

       },

       add: function(req,res){
          sails.log.debug('req.body',req.body);
          res.json(req.body);
       },   

      fileDetail: function(req, res){
             var url= "https://s3.amazonaws.com/mantra-new/file/86545111891.jpg";



             var options = {
                // directory: "D:/Project/Download/",
                directory: "./",
                filename: Math.round(10000000000*Math.random())+'_'+".jpg"
             }  
           
            download(url, options, function(err){
              if (err) throw err
            
                   sails.log.debug("download the file");
                    sails.log.debug("the file save to:",directory);
                   res.json({"message": "download the file"});
             
            }) 
      },
      


      checkEmail: function(req,res){
            sails.log.debug(req.body.email);
            el.check(req.body.email, function(err,data){
             sails.log.debug('data: ',data);
              res.json(data);
            });
      }, 

      outlook: function(req, res){
        // var credentials = {
        //   clientID: "b2ebd0f7-70f0-42fc-97e3-5527d2adeec5",
        //   clientSecret: "24xD5jE46nfo9cUfiZ1c4L3",
        //   site: "https://login.microsoftonline.com/common",
        //   authorizationPath: "/oauth2/v2.0/authorize",
        //   tokenPath: "/oauth2/v2.0/token"
        // }
        // var oauth2 = require("simple-oauth2")(credentials);
        // var redirectUri = "http://localhost:8000/authorize";
        // // The scopes the app requires
        // var scopes = [ "openid", "https://outlook.office.com/mail.read" ];
        var returnVal= getAuthUrl();
        function getAuthUrl() {
          var returnVal = oauth2.authCode.authorizeURL({
            redirect_uri: "http://localhost:8000/authorize",
            scope: scopes.join(" ")
          });
          console.log("Generated auth url: " + returnVal);
          return returnVal;
        }
        res.redirect(returnVal);

      },

      getTokenFromCode: function(req, res){
        var auth_code= req.param('code');
        console.log('==code==', auth_code);
        // res.view('home/welcome');
        getTokenFromCode(auth_code);
        var accessTokenDetail;
        var userDetail;
        function getTokenFromCode(auth_code) {
          var token;
          oauth2.authCode.getToken({
            code: auth_code,
            redirect_uri: redirectUri,
            scope: scopes.join(" ")
            }, function (error, result) {
              if (error) {
                console.log("Access token error: ", error.message);
              }
              else {
                token = oauth2.accessToken.create(result);
                accessTokenDetail = token.token;
                console.log("Token created: ", token.token);
                // userDetail = getEmailFromIdToken(accessTokenDetail.id_token);
                // callback(response, null, token);
              }
            });
        }

        function getEmailFromIdToken(id_token) {
          // JWT is in three parts, separated by a '.'
          var token_parts = id_token.split('.');
          console.log('token_parts',token_parts);
          // Token content is in the second part, in urlsafe base64
          var encoded_token1 = new Buffer(token_parts[0].replace("-", "_").replace("+", "/"), 'base64');
          var encoded_token2 = new Buffer(token_parts[1].replace("-", "_").replace("+", "/"), 'base64');
          // var encoded_token3 = new Buffer(token_parts[2].replace("-", "_").replace("+", "/"), 'base64');
          var decoded_token1 = encoded_token1.toString();
          var decoded_token2 = encoded_token2.toString();
          // var decoded_token3 = encoded_token3.toString();
          var jwt1 = JSON.parse(decoded_token1);
          var jwt2 = JSON.parse(decoded_token2);
          // var jwt3 = JSON.parse(decoded_token3);
          // Email is in the preferred_username field
          console.log('userDetail1',jwt1);
           console.log('userDetail2',jwt2);
            // console.log('userDetail3',jwt3);
          return jwt2;
        }
        res.view('home/welcome');
        // console.log('token',token);
      },

      gmail: function (req, res) {
                  sails.log.debug('loading..');
                  var fs = require('fs');
                  var readline = require('readline');
                  var google = require('googleapis');
                  var googleAuth = require('google-auth-library');

                  //var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.email'];
                   var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/userinfo.profile' ,'https://www.googleapis.com/auth/userinfo.email'];
                 //var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
                 /* var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
                      process.env.USERPROFILE) + '/.credentials/';*/
                  var TOKEN_DIR = '/home/kousik/Desktop/Authentication/';
                  var TOKEN_PATH = TOKEN_DIR + 'gmail-api-AuthController.json';

                  // Load client secrets from a local file.
                  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
                    if (err) {
                      console.log('Error loading client secret file: ' + err);
                      return;
                    }
                    // Authorize a client with the loaded credentials, then call the
                    // Gmail API.
                    //authorize(JSON.parse(content), listLabels);
                    authorize(JSON.parse(content), authorizeCallback);
                     //authorize(JSON.parse(content), getMessage);
                   
                  });

                  /**
                   * Create an OAuth2 client with the given credentials, and then execute the
                   * given callback function.
                   *
                   * @param {Object} credentials The authorization client credentials.
                   * @param {function} callback The callback to call with the authorized client.
                   */
                  function authorize(credentials, callback) {
                    var clientSecret = credentials.installed.client_secret;
                    var clientId = credentials.installed.client_id;
                    var redirectUrl = credentials.installed.redirect_uris[1]+':8000/authComplete';
                    // var redirectUrl = 'http://testhire.klimb.io/';
                     auth = new googleAuth();
                    oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

                    // Check if we have previously stored a token.
                    // fs.readFile(TOKEN_PATH, function(err, token) {

                    //   if (err) {
                    //     sails.log.debug('TOKEN_PATH=>>',err);
                        getNewToken(oauth2Client, callback);
                    //   } else {
                    //     sails.log.debug(token);
                    //     oauth2Client.credentials = JSON.parse(token);
                    //     callback(oauth2Client);
                    //   }
                    // });
                  }

                  /**
                   * Get and store new token after prompting for user authorization, and then
                   * execute the given callback with the authorized OAuth2 client.
                   *
                   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
                   * @param {getEventsCallback} callback The callback to call with the authorized
                   *     client.
                   */
                  function getNewToken(oauth2Client, callback) {
                    var authUrl = oauth2Client.generateAuthUrl({
                      access_type: 'offline',
                      scope: SCOPES
                    });
                    console.log('Authorize this app by visiting this url: ', authUrl);
                    res.redirect(authUrl);

                    
                  }

                   function authorizeCallback() {}

           } ,      
		

           authComplete : function(req, res){
            sails.log.debug(req.params.all());
            var code = req.param('code');

            console.log('code',code);

                  var fs = require('fs');
                  var readline = require('readline');
                  var google = require('googleapis');
                  var googleAuth = require('google-auth-library');

                  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
                 /* var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
                      process.env.USERPROFILE) + '/.credentials/';*/
                  var TOKEN_DIR = '/home/kousik/Desktop/Authentication/';
                  var TOKEN_PATH = TOKEN_DIR + 'gmail-api-AuthController.json';
                  var ATTACH_DIR = '/home/kousik/Desktop/Authentication/';
                  var ATTACH_PATH = ATTACH_DIR + 'gmail-api-AttachIdfile.json';
                  // Load client secrets from a local file.
                  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
                    if (err) {
                      console.log('Error loading client secret file: ' + err);
                      return;
                    }
                    // Authorize a client with the loaded credentials, then call the
                    // Gmail API.
                    /*authorize(JSON.parse(content), listLabels);*/
                    authorize(JSON.parse(content), authorizeCallback);
                     /*authorize(JSON.parse(content), getMessage);*/
                    /*authorize(JSON.parse(content), getMessage);*/
                  });

                  /**
                   * Create an OAuth2 client with the given credentials, and then execute the
                   * given callback function.
                   *
                   * @param {Object} credentials The authorization client credentials.
                   * @param {function} callback The callback to call with the authorized client.
                   */
                  function authorize(credentials, callback) {
                    var clientSecret = credentials.installed.client_secret;
                    var clientId = credentials.installed.client_id;
                    var redirectUrl = credentials.installed.redirect_uris[1]+':8000/authComplete';
                    // var redirectUrl = 'http://testhire.klimb.io/';
                    var auth = new googleAuth();
                    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

                    // Check if we have previously stored a token.
                    // fs.readFile(TOKEN_PATH, function(err, token) {
                    //   if (err) {
                        getNewToken(oauth2Client, callback);
                    //   } else {
                    //     oauth2Client.credentials = JSON.parse(token);
                    //     callback(oauth2Client);
                    //   }
                    // });
                  }

                  /**
                   * Get and store new token after prompting for user authorization, and then
                   * execute the given callback with the authorized OAuth2 client.
                   *
                   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
                   * @param {getEventsCallback} callback The callback to call with the authorized
                   *     client.
                   */
                  function getNewToken(oauth2Client, callback) {
                    // var authUrl = oauth2Client.generateAuthUrl({
                    //   access_type: 'offline',
                    //   scope: SCOPES
                    // });
                    // console.log('Authorize this app by visiting this url: ', authUrl);
                    // res.redirect(authUrl);
                    oauth2Client.getToken(code, function(err, token) {
                        if (err) {
                          console.log('Error while trying to retrieve access token', err);
                          return;
                        }
                        oauth2Client.credentials = token;
                        console.log('token',token);
                        res.redirect('http://localhost:1337/');

                        // storeToken(token);
                    //    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
                    // if (err) {
                    //   console.log('Error loading client secret file: ' + err);
                    //   return;
                    // }
                    // Authorize a client with the loaded credentials, then call the
                    // Gmail API.
                    /*authorize(JSON.parse(content), listLabels);*/
                    // authorize(JSON.parse(content), listMessages);
                     /*authorize(JSON.parse(content), getMessage);*/
                    /*authorize(JSON.parse(content), getMessage);*/
                  // });

                      });
                      
                     
                    
                  }

                  /**
                   * Store token to disk be used in later program executions.
                   *
                   * @param {Object} token The token to store to disk.
                   */

                  // function storeToken(token) {
                  //   try {
                  //     fs.mkdirSync(TOKEN_DIR);
                  //   } catch (err) {
                  //     if (err.code != 'EEXIST') {
                  //       throw err;
                  //     }
                  //   }
                  //   fs.writeFile(TOKEN_PATH, JSON.stringify(token));
                  //   console.log('Token stored to ' + TOKEN_PATH);
                  // }


                    function authorizeCallback() {} 



               
           }



};
//https://www.googleapis.com/oauth2/v3/token?code='4/-f_cYYRpw_U654kvGqpEA-qML-fDLG_6XUDDQk90V1Q'&client_id='885125723746-1vgi4mq3sbu62h55l5ouu85l0ev6opmp.apps.googleusercontent.com'&client_secret='qCxQUmIXQtNaPQwMfdQBd3Rj'&grant_type=authorization_code

          