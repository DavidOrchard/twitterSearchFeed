/* var x = require('casper').selectXPath;
casper.test.comment("Ftest");
  casper.start("http://localhost/~dave/twittersearchfeed/");
  casper.echo("ftest started");
  casper.evaluate(function() {localStorage.removeItem('searchQuery');});
  casper.echo("localstorage cleared");
  casper.waitForSelector("form input#query",
    function success() {
       this.click("form input#query");
    },
    function fail() {
      test.assertExists("form input#query", "Twitter Search Feed down the middle tests: form input#query");
    });
    casper.echo("finished waiting");

casper.test.done();

*/