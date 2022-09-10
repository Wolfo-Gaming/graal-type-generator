const { fstat, writeFileSync } = require("fs");
const { generate } = require("./generator");

/**
 * 
 * @param {string} name
 * @returns {string} 
 */
function transform(name) {
    return 'ob' + name.replaceAll('.', '').replace('$','');
}
generate((res) => {
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
})