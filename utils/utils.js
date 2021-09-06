import * as https from 'https';


export function request(url) {
    https.get(url, (resp) => {
      let key, data = '';

      resp.on('data', (chunk) => {
          data += chunk;
      });

      resp.on('end', () => {
        console.log(data)
          return JSON.parse(data);
      });

    }).on("error", (error) => {
        console.log("Error: " + error.message);
        return null;
    });
}

