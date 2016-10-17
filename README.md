## Content-Scraper

Content-Scraper is a [Node.js](https://nodejs.org/) command line application.

### What it does?

* Connect to the website http://shirts4mike.com
* Get the latest products details (*price, title, url and image url*)
* Save the products to a spreadsheet (*CSV format*) `inside the data folder` (*will be created if not found*)

### Tech

Content-Scraper uses a number of open source projects to work properly:
* [Request](https://github.com/request/request) - Simplified HTTP request client.
* [Cheerio](https://github.com/cheeriojs/cheerio) - Fast, flexible & lean implementation of core jQuery designed specifically for the server.
* [json-csv](https://github.com/IWSLLC/json-csv) - Export a richly structured, JSON array to CSV.
* [JSHint](https://github.com/jshint/jshint) - Static analysis tool for JavaScript.
* [node.js](http://nodejs.org/) - duh!

> Those projects were chosen because they're very popular and have a great documentations.

### Installation

Install the dependencies and devDependencies and run the application.

```
$ npm install
$ node scraper.js
```

For production environments...

```
$ NODE_ENV=production npm install
$ node scraper.js
```

### Linting tool `only in dev mode`

Run this line to check your code for syntax errors
```
$ jshint scraper.js
```

### Error handling

When an error occurs (*the site is down, no internet connection,  etc..*)
an error message will appear in the console
```
Error occurred: Please check "scraper-error.log" for more details.
```
The app will log it to the file `scraper-error.log` (*will be created if not found*). It'll append it to the bottom of the file with a time stamp and error e.g.
```
[Tue Feb 16 2016 10:02:12 GMT-0800 (PST)]
The application failed to scrape content from the URL (http://www.shirts4mike.com)
<error message>
```

### License

MIT

***Free Software, Hell Yeah!***