'use-strict';

/** Load the require modules */
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var jsoncsv = require('json-csv');

var url = 'http://www.shirts4mike.com/';

/** Send request to the require url and get the page content. */
request(url + 'shirts.php', function (error, response, body) {

  // Create new array to hold all the products
  var products = [];

  /** Use this error msg to console.log errors */
  var errMsg = 'Error occurred: Please check "scraper-error.log" for more details.';

  /** Use date to get the scrape time for each product, for file name and for errLoger */
  var date = new Date();
  
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);

    /** Select all the products link in the page. */
    var a = $('ul.products li a');

    a.each(function() {
      var fullUrl = url + $(this).attr('href');

      /** Send a new request for each product. */
      request(fullUrl, function (error, response, body) {

        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);

          /** Create new object to hold product details. */
          var product = {};

          /** Get product properties from the product page. */
          product.price = $('.price').text();
          product.title = $('title').text();
          product.url = fullUrl;
          product.imgUrl = url + $('.shirt-picture img').attr('src');

          /** Get the time of the scraping. */
          product.time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

          /** Push the product to the products array. */
          products.push(product);
            
          /** Run after the last product was pushed to the products array. */
          if (products.length === a.length) {
            
            /** Define fields object fot csv file. */
            var fields = {
              fields : [
                {
                  name: 'title',
                  label: 'Product Name'
                },
                {
                  name: 'price',
                  label: 'Product Price'
                },
                {
                  name: 'imgUrl',
                  label: 'Product Image Link'
                },
                {
                  name: 'url',
                  label: 'Product Link'
                },
                {
                  name: 'time',
                  label: 'Time of Scraping'
                }
              ]
            };

            /** Build the csv file from products array. */
            jsoncsv.csvBuffered(products, fields, function(err, csv) {
              if (err) {
                console.log(errMsg);
                errLoger(err.message, date);
              }

              try {
                /** Check for '/data' folder under main folder. */
                fs.accessSync(__dirname + '/data');
              }
              catch(e) {
                /** If not found, create it. */
                fs.mkdirSync(__dirname + '/data');
              }

              /** Generate the file name with today date (year-month-day). */
              var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
              var fileName = date.getFullYear() + '-' + months[date.getMonth()] + '-' + date.getDate() + '.csv';

              /** Write the file. if the file already exist, rewrite it. */
              fs.writeFile(__dirname + '/data/' + fileName, csv, function(err) {
                if (err) {
                  console.log(errMsg);
                  errLoger(err.message, date);
                }
                else {
                  console.log('The file was successfully created');
                }
              });
            });

          }          
        }
        /** If the connection to produrct url fail, log error message. */
        else if (error) {
          console.log(errMsg);
          errLoger(error, date);
        }

      });

    });
  }
  /** If the connection to the website fail, log error message. */
  else if (error) {
    console.log(errMsg);
    errLoger(error, date);
  }

});

function errLoger(error, date) {
  var errMsg = '[' + date + ']\r\n';
  errMsg += 'The application failed to scrape content from the URL (http://www.shirts4mike.com)\r\n';
  errMsg +=  error + '\r\n\r\n';

  try {
    /** Check for 'scraper-error.log' file in the main folder. */
    fs.accessSync(__dirname + '/scraper-error.log');

    /** If found append the error to the end of the file. */
    fs.appendFile(__dirname + '/scraper-error.log', errMsg, function(err) {
      if (err) throw err;
    });
  }
  catch(e) {
    /** If not found, create it. */
    fs.writeFile(__dirname + '/scraper-error.log', errMsg, function(err) {
      if (err) throw err;
    });
  }
}