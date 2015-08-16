var base_url = "https://s3-website-us-east-1.amazonaws.com/mantra-new/file/";
//mantra-new.s3-website-us-east-1.amazonaws.com

module.exports = {
	tableName: "file",
	
	attributes: {
		// user: {
		// 	model: 'User',
		// 	required : true
		// },

		name : {
			type: 'string',
			size: 250
		},
		base64data:{
			type:'string'
		}
	},


	//Upload Images to AWS S3
	upload : function (data, callback) {
		var buffer = new Buffer(data.data, 'base64');
		data.data = buffer;
		data.subfolder = 'file';
		data.ext ="jpg";
		data.name = Math.floor(Math.random() * 100000000000 + 1);
		AWSService.upload(data, function(err, response){
			if(!err){
				File.create(data, function(err, imageData){
					if(err) {
						sails.log.debug(err)
						callback(err);
					} else {
						callback(null, imageData);
					}
				});
			}else{
				sails.log.error(err);
			}
		})
	}


};
