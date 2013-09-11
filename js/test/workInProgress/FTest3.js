//var x = require('casper').selectXPath;
//var casper = require('casper').create();
//casper.start();
//var test = casper.test

casper.test.comment("Ftest");
//  casper.open('http://localhost/~dave/twittersearchfeed/');
//  casper.evaluate(function() {localStorage.removeItem('searchQuery');});
/*  casper.waitForSelector("form input#query",
    function success() {
       this.click("form input#query");
    },
    function fail() {
      test.assertExists("form input#query", "Twitter Search Feed down the middle tests: form input#query");
    });
  casper.waitForSelector("input#query",
	function success() {
	  this.sendKeys("input#query", "test");
    },
    function fail() {
	  test.assertExists("input#query", "Twitter Search Feed down the middle tests: input#query");
  });
  casper.waitForSelector("form input[type=button][value='Get Tweets']",
	function success() {
	  this.click("form input[type=button][value='Get Tweets']");
    },
    function fail() {
	  test.assertExists("form input[type=button][value='Get Tweets']", "Twitter Search Feed down the middle tests: form input[type=button][value='Get Tweets']");
  });
  casper.waitForSelector("input[type=button][value='Refresh']",
	function success() {
	  test.assertExists("input[type=button][value='Refresh']", "Twitter Search Feed down the middle tests: input[type=button][value='Refresh']");
	  this.click("input[type=button][value='Refresh']");
    },
    function fail() {
	  this.capture('formRefreshFail.png');
	  test.assertExists("input[type=button][value='Refresh']", "Twitter Search Feed down the middle tests: input[type=button][value='Refresh']");
  });
  casper.thenOpen("http://localhost/~dave/twittersearchfeed/", function() {
    casper.evaluate(function() {localStorage.removeItem('searchQuery');});
  });
  casper.waitForSelector("form input#query",
    function success() {
        this.click("form input#query");
    },
    function fail() {
        test.assertExists("form input#query", "Twitter Search Feed large input test: form input#query");
});
casper.waitForSelector("input#query",
    function success() {
        this.sendKeys("input#query", "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234");
    },
    function fail() {
        test.assertExists("input#query");
});
casper.waitForSelector("form input[type=button][value='Get Tweets']",
    function success() {
        var queryLength = casper.evaluate(function() {return $("#query").val().length});
        test.assert(queryLength === 1000, "Twitter Search Feed large input test: Text input truncated at 1000 characters"); //
        this.click("form input[type=button][value='Get Tweets']");
    },
    function fail() {
        test.assertExists("form input[type=button][value='Get Tweets']", "Twitter Search Feed large input test: form input[type=button][value='Get Tweets']");
});
casper.waitForSelector("input[type=button][value='Refresh']",
    function success() {
        this.click("input[type=button][value='Refresh']");
    },
    function fail() {
      this.capture('formRefreshFail.png');
        test.assertExists("input[type=button][value='Refresh']", "Twitter Search Feed large input test: input[type=button][value='Refresh']");
});
//casper.run(function() {casper.test.renderResults(true);casper.test.done();});
*/
casper.test.done();


