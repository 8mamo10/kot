var http = require('http');
var querystring = require('querystring')
var webclient = require("request");
const parse = querystring.parse
const server = http.createServer();

const user_table = {
  'user1' : 'key1',
  'user2' : 'key2',
};

server.on('request', function(req, res) {
  if (req.method == 'GET') {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.write('GET / hello world');
    res.end();
  } else if (req.method == 'POST') {
    var data = '';
    req.on('data', function(chunk) {data += chunk})
      .on('end', function() {
        const parsed_data = parse(data);
        console.log(parsed_data);
        const user_name = parsed_data['user_name'];
        const user_key = user_table[user_name];
        console.log(user_key);
        const ts = parsed_data['timestamp'];
        const d = new Date(ts * 1000);
        const year  = d.getFullYear();
        const month = (d.getMonth() + 1 < 10) ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
        const day  = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate();
        const hour = (d.getHours()   < 10) ? '0' + d.getHours()   : d.getHours();
        const min  = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes();
        const sec   = (d.getSeconds() < 10) ? '0' + d.getSeconds() : d.getSeconds();
        const date_str = year + '-' + month + '-' + day;
        console.log(date_str);
        const datetime_str = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':' + sec + '+09:00';
        console.log(datetime_str);
        const postData = {
          "date": date_str,
          "time": datetime_str,
          "code": "1"
        }
        let postDataStr = JSON.stringify(postData);
        console.log(postDataStr);
        let options = {
          url: 'https://api.kingtime.jp/v1.0/daily-workings/timerecord/' + user_key,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer [token]'
          },
          body: postDataStr
        };
        console.log(options);
        webclient.post(options, function(error, response, body){
          console.log(body);
        });
        let postData2 = {
          "channel": "[channel name]",
          "username": "[bot name]",
          "text": "Good morning, " + user_name + "!!"
        };
        let postDataStr2 = JSON.stringify(postData2);
        console.log(postDataStr2);
        let options2 = {
          url: '[hook url]',
          method: 'POST',
          body: postDataStr2
        };
        console.log(options2);
        webclient.post(options2, function(error, response, body){
          console.log(body);
        });
      });
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.write('POST / hello world');
    res.end();
  }
});

const port = 3000;
server.listen(port);
console.log('Server listen on port ' + port);
