const { spawn } = require('child_process');
const { createWriteStream, readFileSync, createReadStream } = require('fs');
const JSON5 = require('json5')
/**
 * 
 * @param {(result: import('./index').Class[]) => void} cb 
 */
module.exports.generate = function generate(cb) {
    const task = spawn('java', ['-jar', './reflection.jar', "a"], {cwd: "./lib"})
    var i = 0
    task.stderr.on("data", (data) => {
      
        console.log(data.toString())
    })
    task.stdout.pipe(createWriteStream('./test.json'))
    task.on('exit', () => {
        var stream = createReadStream('./test.json', { flags: 'r', encoding: 'utf-8' });
        var buf = '';

        stream.on('data', function (d) {
            buf += d.toString(); // when data is read, stash it in a string buffer
            pump(); // then process the buffer
        });

        function pump() {
            var pos;

            while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
                if (pos == 0) { // if there's more than one newline in a row, the buffer will now start with a newline
                    buf = buf.slice(1); // discard it
                    continue; // so that the next iteration will start with data
                }
                processLine(buf.slice(0, pos)); // hand off the line
                buf = buf.slice(pos + 1); // and slice the processed data off the buffer
            }
        }

        function processLine(line) { // here's where we do something with a line

            if (line[line.length - 1] == '\r') line = line.substr(0, line.length - 1); // discard CR (0x0D)

            if (line.length > 0) { // ignore empty lines
                var s = line.replace(/^SLF4J:.*$/gm, "")
                var obj = JSON.parse(s); // parse the JSON
                obj = obj.filter(e => !e.name.includes('$'))
                cb(obj)
            }
        }
    })

}
