const assert = require("assert");

process.stdin.on("data", function(data) {
  assert(data.toString().includes(4));
});
