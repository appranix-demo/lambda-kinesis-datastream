var AWS = require('aws-sdk');

function getKinesisClient(region_name) {
	return new AWS.Firehose({
	    'accessKeyId': process.env.accessKeyId,
        'secretAccessKey': process.env.secretAccessKey,
		'region' : region_name
	});
}

function sendRecord(kinesisClient, lineData, context) {
    console.log(lineData);
	params = {
		'DeliveryStreamName' : process.env.DeliveryStreamName,
		'Record': { 
            'Data': ''+lineData+''
        }
	};

	try {
		kinesisClient.putRecord(params, function(err, data) {
			if (err) {
				console.log('Transmission FAILED: ' + err);
				return;
			} else {
			    context.succeed('Succeeded');
			}
		});
	} catch (err) {
		console.log('Transmission FAILED: ' + err);
	}
}
exports.handler = function index(event, context, callback) {
    var region = process.env.region;
    
    var kinesisClient = getKinesisClient(region);
    sendRecord(kinesisClient, event.eachLine, context);
}
