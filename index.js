const express = require('express');
const { resolve } = require('path');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3010;

// url of API
const apiUrl = 'https://api.parsemyfile.com/api/v1/generate';
// Change this value by your api key
const apiKey = 'CHANGE_ME';
// Url of PDF example
const pdfUrl = 'https://parsemyfile.com/facture_fictive_exemple.pdf';
const tempPDFPath = path.join(__dirname, 'temp.pdf');
// file rules is yaml
const yamPath = path.join(__dirname, 'schema_example.yaml');

app.use(express.static('static'));

app.get('/', async (req, res) => {
  await saveRemotePDF(pdfUrl);
  // Create form data for send to API
  const form = new FormData();
  form.append('file', fs.createReadStream(tempPDFPath));
  form.append('yaml_file', fs.createReadStream(yamlPath));

  // 3. Call API
  const apiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey, ...form.getHeaders() },
    body: form,
  });

  const response = await apiResponse.text();

  res.type('json').send(response);
  //res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function saveRemotePDF(pdfUrl) {
  // Recup PDF
  const response = await fetch(pdfUrl);
  // save in tmp file
  const fileStream = fs.createWriteStream(tempPDFPath);
  console.log('IC');
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}
