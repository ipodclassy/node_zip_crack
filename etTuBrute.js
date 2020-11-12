// zipping:
// zip -e target.zip file.something #...prompt for password
// unzipping:
// 7z e target.zip -pPASSWORD

////////////////////

function Dictionary(ab) {
  this.ab = ab;
  this.abl = ab.length;
}

Dictionary.prototype.excelColumn = function(index) {
  index--;
  var value = '';
  while (index >= 0) {
    value = this.ab[index % this.abl] + value;
    index = Math.floor(index / this.abl) - 1;
  }
  return value;
}

Dictionary.prototype.valueAsString = function(index) {
  return index.toString(this.abl).split('').map(function(c) { return this.ab[parseInt(c,this.abl)]; }.bind(this)).join('');
}

////////////////////

var spawn = require('child_process').spawn;
var dict = new Dictionary('abcdefghijklmnopqrstuvwxyz0123456789');
var file = './safe.zip';
var threads = 2;
var start = 1;

function checkPassByIndex(i) {
  var pass = dict.excelColumn(i);
  spawn('7z', ['e', file, '-otarget/', '-y', '-p' + pass]).on('exit', function(code) {
    console.log(code ? "failed on" : "password is", i, pass);
    code ? checkPassByIndex(i+threads) : process.exit();
  });
}

for (var t=0; t<threads; t++) {
  checkPassByIndex(t+start);
}
