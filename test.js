const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');



const moment = require('moment');

// const sorted = 1;


// const file = fs.readFile('./r.csv', 'utf8', (err, data) => {
//     if (err) {
//         console.log(err);
//         return;
//     } 

//     const parsed = csv({ headers: false }).
    
//     parse(data);

//     const xs = parsed.sorted((a, b) => {
//       moment(a['2']).valueOf() - moment(b['2']).valueOf();
//     })

//     console.log(xs)
//   })

  let values = [];
fs.createReadStream('r.csv')
  .pipe(csv({
    headers: false

  }))
  .on('data', (row) => {
    values.push(row)
  })
  .on('end', () => {
    const xs = values.sort((a, b) => {
      console.log(a['2'])
      return moment(a['2']).unix() - moment(b['2']).unix()
      
    })
    fs.writeFileSync('r1.json', JSON.stringify(xs));
  });
