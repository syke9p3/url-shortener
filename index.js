require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('node:dns');
const { URL } = require('url');

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
    res.json({ error: 'Invalid URL' });
  }


  console.log('hostname: ', hostname)

  dns.lookup(hostname, (err, address, family) => {

    console.log('DNS lookup...')
    console.log('address: ', address)
    console.log('family: ', family)
    if (err) {
      console.log('Invalid Hostname')
      res.json({ err: 'Invalid Hostname' });
      setError(err)

    } else {
      let short_url = Math.floor(Math.random() * 100000).toString();
      res.json({ original_url, short_url: '42' });
    }

  });

});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});



