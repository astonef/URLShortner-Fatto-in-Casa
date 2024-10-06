require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dns = require('dns');


const port = process.env.PORT || 3000;
const urlDatabase = {};
let nextShortUrlId = 1;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get('/api/daje', function(req, res) {
  res.json({ saluti: 'Ao, bella' });
});

app.use(bodyParser.urlencoded({extended: false}));

app.post('/api/shorturl', function(req, res){
  
  const originalUrl = req.body.url;

  const valid = /^(ftp|http|https):\/\/[^ "]+$/;
  if(!valid.test(originalUrl)){
    return res.json({ error: 'invalid url' });
  }

  const urlParts = new URL(originalUrl);
 
  const hostName = urlParts.hostname;
  dns.lookup(hostName, function(err){
    if(err){
      return res.json({error: 'invalid url'});
    }
  })

  const shortUrl = nextShortUrlId;
  urlDatabase[shortUrl] = originalUrl;
  nextShortUrlId++;  

  res.json({original_url: originalUrl, short_url: shortUrl});
  
});

app.get('/api/shorturl/:short_url', function(req, res){
  const shortUrl = parseInt(req.params.short_url);

  if (!urlDatabase.hasOwnProperty(shortUrl)) {
    res.json({ error: 'invalid url' });
    return;
  }
  
  res.redirect(urlDatabase[shortUrl]);
})

app.listen(port, function() {
  console.log(`In ascolto sulla porta ${port}`);
});
