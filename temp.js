const locale = "fr";

import * as https from 'https';

function request(url) {
    https.get(url, (resp) => {
      let key, data = '';

      resp.on('data', (chunk) => {
          data += chunk;
      });

      resp.on('end', () => {
          data = JSON.parse(data);
          return data.query.pages;
      });

    }).on("error", (error) => {
        return console.log("Error: " + error.message);
    });
}

request(`https://${locale}.wikipedia.org/w/api.php?action=query&generator=random&prop=extracts&grnlimit=1&grnnamespace=0&prop=extracts&explaintext=1&exintro=1&format=json`);

