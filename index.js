// Dependencies
const gm = require('gm');
const Minio = require('minio');

// Config
let srcBucket = process.env.RESIZER_SOURCE;
let dstBucket = process.env.RESIZER_DESTINATION;

let maxWidth = parseInt(process.env.RESIZER_MAX_WIDTH || "2560");
let maxHeight = parseInt(process.env.RESIZER_MAX_HEIGHT || "1600");

let minioConfig = {
    endPoint: process.env.RESIZER_ENDPOINT,
    port: parseInt(process.env.RESIZER_PORT),
    secure: process.env.RESIZER_SECURE === "true",

    accessKey: process.env.RESIZER_ACCESS_KEY,
    secretKey: process.env.RESIZER_SECRET_KEY
};

// Utils
function join(...arguments) {
    return "'" + arguments.join(":") + "'";
}

// Main
const mc = new Minio.Client(minioConfig);
const listener = mc.listenBucketNotification(srcBucket, "", "", ["s3:ObjectCreated:*"]);
console.log(`Listening on ${join(srcBucket)} for events`);

listener.on('notification', record => {
    let objectPath = decodeURIComponent(record.s3.object.key);
    mc.getObject(srcBucket, objectPath,
        function (err, dataStream) {
            console.log(`Processing ${join(dstBucket, objectPath)}`);
            if (err) {
                return console.log(`Error retrieving ${join(srcBucket, objectPath)}: ${join(err)}`);
            }

            let outputStream = gm(dataStream).resize(maxWidth, maxHeight, ">").stream();

            mc.putObject(dstBucket,
                objectPath,
                outputStream,
                (err, etag) => {
                    if (err) {
                        return console.log(`Error saving ${join(dstBucket, objectPath)}: ${join(err)}`);
                    }
                    console.log(`Successfully uploaded ${join(dstBucket, objectPath)} with md5sum ${join(etag)}`);
                });
        });
});

process.on("SIGINT", function () {
    listener.stop();
    process.exit();
});
