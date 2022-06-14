const http = require('http');
const axios = require('axios');
const fs = require('fs');
const archiver = require('archiver');
archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));

const HttpPost =

    module.exports = {

        HttpPost: async (url, postdata) => {

            const options = {
                Method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const data = await axios(options)
                .then(response => {
                    return response.data;
                })
            return data;
            // .catch(function (error) {
            //     console.log(error);
            // });
            // // console.log(data)
            // return data;
        },
        Dowloadfile: async (url, FileName) => {
            const pipFilePath = `zipfile/${FileName}`;

            const file = fs.createWriteStream(pipFilePath);
            const request = http.get(url, function (response) {
                response.pipe(file);
                file.on("finish", function () {
                    file.close(() => {
                        return true;
                        // console.log(pipFilePath);
                    });
                });
                file.on("error", function (err) {
                    fs.unlink(pipFilePath);
                    reject(err);
                });
            });
            if (request) {
                return true;
            } else {
                return false;
            }
        },
        addFilesFromDirectoryToZip: async (FileName, password) => {

            const output = fs.createWriteStream(`zipfile/${FileName}.zip`);;
            const archive = archiver('zip-encryptable', { zlib: { level: 9 }, forceLocalTime: true, password: password });
            const paths = `zipfile/${FileName}.xlsx`;
            spawn = require('child_process').spawn;

            //just for information
            output.on('close', () => {
                // console.info(archive.pointer() + ' total bytes');
                // console.info('archiver has been finalized and the output file descriptor has closed.');
                // cb()
            });
            archive.on('error', (err) => { throw err });
            archive.pipe(output);
            paths.split(",").forEach((path) => {
                archive.glob(path); //add files here
            });
            // console.info("Generating zip file, please wait. . . ")
            archive.finalize(); //generate the zip
            return true;
        }
    }
