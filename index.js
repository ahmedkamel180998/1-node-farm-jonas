const fs = require("fs");
const http = require("http");

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(productData);

// templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

// replaceTemplate
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%ID%}/g, product.id);
  // if the product is not organic, then we replace the placeholder with an empty string
  if (!product.organic) {
    output = output.replace(/{%NOT-ORGANIC%}/g, "not-organic");
  }

  return output;
};

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    // console.log(cardsHtml);
    let output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);
    res.end(output);

    // product page
  } else if (pathName === "/product") {
    res.end("Hello from the product page!");

    // API
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(productData);

    // 404 Not Found
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end(
      "<h1>Page not found!</h1><p>We can't find the page you are looking for.</p>"
    );
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
