const { createReadStream } = require("fs");

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
        r(obj)
    }
}
const { fstat, writeFileSync } = require("fs");

/**
 * 
 * @param {string} name
 * @returns {string} 
 */
function transform(name) {
    return 'ob' + name.replaceAll('.', '').replace('$','');
}
var r = (res) => {
    var resultClasses = "interface types {\n"
    var resultDef = ""
   for (const Class of res) {
    
      var className = transform(Class.name);
      var classNameDec = Class.isInterface ? "new (...args: any[]) => " : "typeof "
      resultClasses += "'"+ Class.name + "': " + classNameDec + className + "\n"
      if (Class.isInterface == true) {
         
      } else {
        resultDef += `
        declare class ${className}${Class.extends.length > 0 ? " extends " + Class.extends.map(e => transform(e)).join(', ') + " ": ""}${Class.implements.length > 0 ? " implements " + Class.implements.map(e => transform(e)).join(', ') + " ": ""} {
           ${Class.constructors.map((constr) => {
               var r = "constructor("
               r += constr.params.map(para => {
                   return `${para.name}: ${transform(para.type)}`
               }).join(',');
               r += ");\n";
               return r;
           }).join('')}
           ${Class.methods.map((method) => {
               var r = method.name+"("
               r += method.params.map(para => {
                   return `${para.name}: ${transform(para.type)}`
               }).join(',');
               r += "): "+transform(method.returns)+";\n";
               return r;
           }).join('')}
           ${Class.fields.map(field => {
               return field.name + ": " + transform(field.type) + "\n"
           }).join('')}
        }\n
     `
     
      }
      writeFileSync('./dec.ts', resultDef)
   }
   resultClasses += "};"
   //console.log(resultClasses)
}