// Building the first part of building the dynamic node farn website => building the template that will hold the actual data
// Requirements => 1. An overview where we have all the products and then each product has its details page.
//              => 2. data is read from a JSON file, so if we change the json file, for example, deleting a product, then reloading the page, the product will not be displayed.
//              => 3. any changes to JSON file, then that should update here on the site, because it's a dynamic website built from data that's in the JSON file.
//              => 4. we have 2 templates, one for the overview and one for the product details.
const fs = require("fs");
const http = require("http");

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(productData); // parse the JSON data into a JavaScript object

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/") {
    res.end("Hello from the server!");
  } else if (pathName === "/product") {
    res.end("Hello from the product page!");
  } else if (pathName === "/overview") {
    res.end("Hello from the overview page!");
  } else if (pathName === "/about") {
    res.end("Hello from the about page!");
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "content-type": "application/json", // the browser expects JSON content, so we set the content type to application/json
    });
    res.end(productData); // send the product data back to the client
  } else {
    res.writeHead(404, {
      "content-type": "text/html", // the browser expects HTML content
      "my-own-header": "hello-world", // custom header, not necessary but can be useful for debugging or other purposes
    });
    // res.end("Page not found!");
    res.end(
      "<h1>Page not found!</h1><p>We can't find the page you are looking for.</p>"
    );
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
