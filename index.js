const express = require('express');
const { resolve } = require('path');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3010;

// url of API
const apiUrl = 'https://api.parsemyfile.com/api/v1/generate';
// Change this value by your api key
const apiKey = 'YOUR_API_KEY';
// 1. create your file rules for extract data
const yamlPath = path.join(__dirname, 'schema_example.yaml');
// 2. Use file to extract data
const pdfPath = path.join(__dirname, 'facture_fictive_exemple.pdf');


app.use(express.static('static'));

app.get('/', async (req, res) => {
  // 3. Create form data for send to API and call API
  const form = new FormData();
  form.append('file', fs.createReadStream(pdfPath));
  form.append('yaml_file', fs.createReadStream(yamlPath));

  const apiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey},
    body: form,
  });

  // 4. use result
  const response = await apiResponse.text();

  res.type('json').send(response);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

