
var express = require("express"),
	app = express();

app.use(express.static(__dirname + '/'));

app.listen(8800);
console.log('http server listen of port 8800');