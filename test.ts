import Test from "./bruh";
function r(): typeof Test {
    return Test;
}
var s = r()
new s()