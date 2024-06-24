require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('node:dns');
const { URL } = require('url');

const urlDatabase = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function (req, res, next) {

  const original_url = req.body.url
  let urlObject = null;
  let hostname = null;

  // Check if valid URL
  // Check if valid hostname
  try {
    urlObject = new URL(original_url)
    hostname = urlObject.hostname
    console.log(hostname)
  } catch (err) {
    console.log(err)
    res.json({ error: 'invalid url' });
  }


  console.log('hostname: ', hostname)

  dns.lookup(hostname, (err, address, family) => {

    console.log('DNS lookup...')
    console.log('address: ', address)
    console.log('family: ', family)
    if (err) {
      console.log('Invalid Hostname')
      res.json({ error: 'invalid url' });
      setError(err)

    } else {
      const generateShortUrl = () => Math.floor(Math.random() * 100000).toString();
      urlDatabase[short_url] = generateShortUrl()
      res.json({ original_url, short_url });
    }

  });

});


app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = req.params.short_url;
  const original_url = urlDatabase[short_url];

  if (original_url) {
    res.redirect(original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }


})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});



