var fs = require('fs');
var startDate = new Date('2019-1-1');
var endDate = new Date('2020-1-1');
var csv = 'date,value\n';

for(var i = startDate; i < endDate; startDate.setDate(startDate.getDate() + 10)) {
  csv += '' + startDate.toString() + ',' + Math.random() + '\n'; // why leading empty str?
}

fs.writeFileSync('data.csv', csv);