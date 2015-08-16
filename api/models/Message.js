 


 module.exports = {

 
 /*tableName: "message",

  attributes: {

        user:{
                  model:'user',
                  
              },

        id: 'string',
        threadId: 'string',
        labelIds: [
          'string'
        ],
        snippet: 'string',
        
        historyId: 'long',
        internalDate: 'long',
        payload: {
              partId: 'string',
              mimeType: 'string',
              filename: 'string',
              headers: [
                {
                  name: 'string',
                  value: 'string'
                }
              ],
            "body": users.user.attachments Resource,
              body: 'users.messages.attachments',
             parts: [
                (MessagePart)
              ]
        },
        sizeEstimate: 'integer',
        raw: 'bytes'
},*/


              getGmail: function (reqbody, cb) {
                  var fs = require('fs');
                  var readline = require('readline');
                  var google = require('googleapis');
                  var googleAuth = require('google-auth-library');

                  var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
                 /* var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
                      process.env.USERPROFILE) + '/.credentials/';*/
                  var TOKEN_DIR = 'F:/Project/Authentication/.credentials/';
                  var TOKEN_PATH = TOKEN_DIR + 'gmail-api-AuthController.json';
                  var ATTACH_DIR = 'F:/Project/Authentication/.credentials/';
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
                    authorize(JSON.parse(content), listMessages);
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
                    var redirectUrl = credentials.installed.redirect_uris[0];
                    var auth = new googleAuth();
                    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

                    // Check if we have previously stored a token.
                    fs.readFile(TOKEN_PATH, function(err, token) {
                      if (err) {
                        getNewToken(oauth2Client, callback);
                      } else {
                        oauth2Client.credentials = JSON.parse(token);
                        callback(oauth2Client);
                      }
                    });
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
                    /*authUrl();*/
                    var rl = readline.createInterface({
                      input: process.stdin,
                      output: process.stdout
                    });
                    rl.question('Enter the code from that page here: ', function(code) {
                      rl.close();
                      oauth2Client.getToken(code, function(err, token) {
                        if (err) {
                          console.log('Error while trying to retrieve access token', err);
                          return;
                        }
                        oauth2Client.credentials = token;
                        storeToken(token);
                       
                      });
                    });
                  }

                  /**
                   * Store token to disk be used in later program executions.
                   *
                   * @param {Object} token The token to store to disk.
                   */
                  function storeToken(token) {
                    try {
                      fs.mkdirSync(TOKEN_DIR);
                    } catch (err) {
                      if (err.code != 'EEXIST') {
                        throw err;
                      }
                    }
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
                    console.log('Token stored to ' + TOKEN_PATH);
                  }

                  /**
                   * Lists the messages in the user's account.
                   *
                   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
                   */

                    function listMessages(auth) {
                          var gmail = google.gmail('v1');
                          gmail.users.messages.list({
                            auth: auth,
                            userId: 'me',
                          }, function(err, response) {
                            if (err) {
                              console.log('The API returned an error: ' + err);
                              return;
                            }
                            var messages = response.messages;
                             /*console.log(response);*/
                            if (messages.length == 0) {
                              console.log('No messages found.');
                            } else {
                              var arr= [];
                              var msgList =[];
                              var attachmentList= []
                              var count =0;
                              console.log("Query returned"+ messages.length + "Messages");
                                var msgLength = messages.length;
                                  for (var i = 0; i < messages.length; i++) {
                                    var message = messages[i];
                                    var messageId=  messages[i].id;
                                    arr.push(message);
                                   

                                      (function (messageId) {
                                      var gmail = google.gmail('v1');
                                     
                                      gmail.users.messages.get({
                                        auth: auth,
                                        userId:'me',
                                        'id': messageId,
                                      }, function(err, response){
                                        if (err) {
                                          console.log('The API returned an error: ' + err);
                                          return;
                                        }
                                   
                                              //
                                          var parts = response.payload.parts;
                                            _.each(parts, function (part) {
                                               (function (part) {
                                              if (part.filename && part.filename.length > 0) {
                                              var attachId = part.body.attachmentId;

                                              console.log("attachId = ",attachId ,'<br>');
                                               attachmentList.push(attachId);
                                               }
                                               })(part)
                                               count = count+1;
                                               if (count >=  40) {
                                                storeAttachId(attachmentList);
                                            
                                              //res.json(attachmentList);
                                                      Message.find().exec(function (err, data) {
                                                            if (!err) {
                                                                return cb(null, attachmentList)
                                                            } else {
                                                                return cb(err)
                                                            }
                                                      });
                                            
                                              } 

                                            });

                                                  //
                                                   function storeAttachId(attachmentList) {
                                                    try {
                                                    fs.mkdirSync(ATTACH_DIR);
                                                    } catch (err) {
                                                    if (err.code != 'EEXIST') {
                                                      throw err;
                                                    }
                                                    }
                                                  
                                                    fs.writeFile(ATTACH_PATH, JSON.stringify(attachmentList));
                                                    console.log('AttachId stored to ' + ATTACH_PATH);
                                                  }
                                                  //
                                           
                                           
                                         

                                         
                                      });
                                      
                                    })(messageId);
                                    
                                    
                                             

                                }
                                

                              }
                          });
                    }

              }
        


};
