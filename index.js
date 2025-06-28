const fs = require("fs");
const http = require("http");

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(productData);

// first step => each time there's a new request for this route (root or /overview)
//            => load the template overview.html but we actually call it outside the server callback,
//                  so it will be the same for all requests, so load it once in the memory in the beginning when we start the application
// when neccessary, we can replace the placeholders with the actual data
// use readFileSync because we're in the top level code, so execute it once at the beginning.

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
  // we created a variable output to replace productname in temp argument
  // but it's not a good practice to directly modify the arguments that we pass to the function, so we create a new variable, so that it's let not const
  // use regex to make sure we replace all instances of the placeholder

  // The replace() method in JavaScript returns a new string with some or all matches of a pattern replaced by a replacement value.
  // It does not modify the original string (temp), because strings in JavaScript are immutable.
  // output will contain the new string with all instances of {%PRODUCTNAME%} replaced by product.productName, temp remains unchanged.

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
    // loop through the dataObject to create the product cards
    // use map() to return an array of strings, each string is the HTML for a product card
    // map() accepts a callback method gets the current element as an argument
    // each el represents a product object, then use this object to replace the placeholders in the tempCard template
    // replaceTemplate() will take tempCard
    // at the end, we will have an array of strings, each string is the HTML for a product card, so we can join them together to create the final HTML for the overview page
    // replace the {%PRODUCT_CARD%} placeholder in the tempOverview template with the cardsHtml variable
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
