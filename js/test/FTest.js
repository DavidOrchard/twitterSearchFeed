var x = require('casper').selectXPath;
var casper = require('casper').create();

/** Tests to do */
/* no localStorage */

var inputSelector = "input[class=search]";
var formInputSelector = "form " + inputSelector;
var searchSubmitSelector = "span[class='searchsubmit'][title='Get Tweets']";
var refreshSubmitSelector = "span[class='refreshsubmit'][title='Refresh Search'][label='Refresh Search']";
var resetSubmitSelector = "span[class='resetsubmit']";
var localhost = 'http://localhost/~dave/twittersearchfeed/';
var heroku = 'http://twittersearchfeed.herokuapp.com/';
//var twitterSearchSite = window.location.hostname == "localhost" ? localhost : heroku;
var twitterSearchSite = localhost;
var autorefreshinterval = 30000;
var maxItems = 50;

var removeLocalStorageDirectAccess = function(testName) { 
    casper.evaluate(function() {
      localStorage.removeItem('feedModel');
      })};

var removeLocalStorageClickReset = function (testName) { 
  casper.waitForSelector(resetSubmitSelector, 
    function () { casper.click(resetSubmitSelector);
    }, function() {
      casper.capture(testName + 'neverSeeReset.png');
      casper.assertExists(resetSubmitSelector, testName + " looking for resetSubmit");
     });
};

var removeLocalStorage = removeLocalStorageDirectAccess;

var feedItemLength = function() {return $(".feeditem").length;};
var queryValueFtn = function() {return $("input").val();};
var ProxyNoURLSetMsg = "No URL set";
var ProxyURLTooLongMsg = "URL too long";
var ProxyURLNotAuthorisedMsg = "URL is not authorised";
var NoTweetResultsText = "No Tweet results for";
var testsToRun = Array(1,2);
//var testsToRun = [3]; 
//var testsToRun = Array(4,5,6);
//var testsToRun = Array(7,8,9,10,11);
casper.test.begin("Twitter Search Feed tests", {
  setUp: function(test) {    
  },
  
  test: function(test) {
  /** down the middle test, search term, refresh */
  casper.start(twitterSearchSite);
  removeLocalStorage("test initializer");
  var that = this;
  if( testsToRun.indexOf(1) != -1 ){
    var testText = "Twitter Search Feed down the middle test";
    var fileName = testText.replace(/\s+/g, '');
    casper.then( function() {
      that.enterTermAndClick(test, "test", testText);
      casper.then( function() {
        that.waitForRefreshAndClick(test, testText);
        casper.then( function() {
          this.capture(fileName + 'LastCheck.png');
          test.assertExists(refreshSubmitSelector, testText + " last check");
          });        
        });
    });
  }

  /** down the middle test, reload, */
  if( testsToRun.indexOf(2) != -1 ){
    var that = this;
    casper.thenOpen(twitterSearchSite, function () {
      var testText2 = "Twitter Search Feed down the middle test after reload";
      that.waitForRefreshAndClick(test, testText2);
      test.assertExists(refreshSubmitSelector, testText2);
    });
  }
   
   /** Test case: big request with auto refresh does add */
   if( testsToRun.indexOf(3) != -1 ){
     casper.thenOpen(twitterSearchSite, function () {
     var testText3 = "Twitter Search Feed big request auto refresh";
     var fileName3 = testText3.replace(/\s+/g, '');
     that.enterTermAndClick(test, "a", testText3);
     casper.waitUntilVisible(refreshSubmitSelector,
       function success() {
         casper.wait(2000);
         var resultsLength = casper.evaluate(feedItemLength);
         test.assertEquals(resultsLength, 15, testText3 + " has 15 results");
         casper.click(refreshSubmitSelector);
       },
       function fail() {
         this.capture(fileName3 + 'Fail.png');
         test.assertExists(refreshSubmitSelector, testText3 + " missing " + refreshSubmitSelector);
    });

     var f = function success() {
       var resultsLength = casper.evaluate(feedItemLength);
       test.assert(resultsLength > 15, testText3 + " after auto refresh has " + resultsLength + " tweets which is > 15");
     };

     casper.wait(autorefreshinterval + 5000);
     casper.waitForSelector(refreshSubmitSelector, f, f);
   });
  }
  
  /* Test case: big request with manual refresh does add */
  if( testsToRun.indexOf(4) != -1 ){
    var resultsLength = 0;
    casper.thenOpen(twitterSearchSite);
    var testText4 = "Twitter Search Feed big request manual refresh test";
    var fileName4 = testText4.replace(/\s+/g, '');
    removeLocalStorage(testText4);
    casper.reload();
    casper.waitUntilVisible(formInputSelector,
    function success() {
      this.click(formInputSelector);
    },
    function fail() {
      this.capture(fileName4 + 'formInputFail.png');
      test.assertExists(formInputSelector, testText4 + " missing form Input " + formInputSelector);
     });
    casper.waitUntilVisible(inputSelector,
    function success() {
      this.sendKeys(inputSelector, "test");
    },
    function fail() {
      test.assertExists(inputSelector, testText4 + " missing Input" + inputSelector);
    });
    casper.waitUntilVisible(searchSubmitSelector,
    function success() {
      this.click(searchSubmitSelector);
    },
    function fail() {
      test.assertExists(searchSubmitSelector, testText4 + " missing searchSubmit  " + searchSubmitSelector);
    });
  
     casper.waitUntilVisible(refreshSubmitSelector,
    function success() {
      test.assertVisible(refreshSubmitSelector, testText4 + " refresh displayed");
      casper.wait(5000);
       resultsLength = casper.evaluate(feedItemLength);
       test.assert(resultsLength != null, testText4 + " has " + resultsLength + " results");
      test.assert(resultsLength > 0 , testText4 + " has >0 results");
      this.click(refreshSubmitSelector);
    },
    function fail() {
      casper.capture(fileName4 + 'Fail.png');
      test.assertExists(refreshSubmitSelector, testText4 + " missing " + refreshSubmitSelector);
    });
  
    var f = function success() {
       var resultsLengthNow = casper.evaluate(feedItemLength);
       test.assert(resultsLengthNow > resultsLength , testText4 +  " after manual refresh has " + resultsLengthNow + " results which is >" + resultsLength);
     };
    // would be nice to wait for $(".feeditem:first .feeditemtext").text() to change
    // or even a css3 selector for text content, which sadly didn't make the cut.
    //casper.waitForSelectorTextChange('.feeditem:first .feeditemtext', f, f); doesn't work
    // I *hate* timing based tests.  Determinism is good for the soul
  
    casper.wait(3000);
    casper.waitUntilVisible(refreshSubmitSelector, f, f);
  }
  
   /** Test case: proxy with not whitelisted request */
   if( testsToRun.indexOf(5) != -1 ){
   casper.thenOpen(twitterSearchSite + "/twitter-proxy.php?url=statuses/home_timeline");

   f = function() { test.assertTextExists(ProxyURLNotAuthorisedMsg, "URL sent to the proxy with a non search url");};
    casper.waitForText(ProxyURLNotAuthorisedMsg, f, f);
  }  
  /** Test case: proxy with a long url and url in the url */
  if( testsToRun.indexOf(6) != -1 ){
casper.thenOpen(twitterSearchSite + "/twitter-proxy.php?url=search/tweets.json?q=0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234");
 f = function success() { test.assertTextExists(ProxyURLTooLongMsg, "URL sent to the proxy with too long a url");};
  
  casper.waitForText(ProxyURLTooLongMsg, f, f);
}  
   /** Test case: max feed items limit reached */
   if( testsToRun.indexOf(7) != -1 ){
     casper.thenOpen(twitterSearchSite, function() {
     removeLocalStorage();
     var testText7 = "Twitter Search Feed big request max feed items limit";
     var fileName7 = testText7.replace(/\s+/g, '');
     that.enterTermAndClick(test, "a", testText7);

     //can't do loops because of closure
     // loop 1
     casper.waitUntilVisible(refreshSubmitSelector,
       function success() {
         var resultsLength = casper.evaluate(feedItemLength);
         test.assertEquals(15, resultsLength, testText7 + " loop 1 reached has " + resultsLength + " tweets which == 15 results");
         casper.click(refreshSubmitSelector);
       },
       function fail() {
         test.assertExists(refreshSubmitSelector, testText7 + "  reached missing " + refreshSubmitSelector);
       });

     // loop 2
     casper.wait(5000);
     casper.waitUntilVisible(refreshSubmitSelector,
       function success() {
         var resultsLength2 = casper.evaluate(feedItemLength);
         casper.capture(fileName7 + 'Loop2.png');
         test.assert(resultsLength2 > 15, testText7 + " loop 2 reached has " + resultsLength2 + " tweets which > 15 results");
         casper.click(refreshSubmitSelector);
       },
       function fail() {
         test.assertExists(refreshSubmitSelector, testText7 + " reached missing " + refreshSubmitSelector);
       });

     // loop 3
     casper.wait(5000);
     casper.waitUntilVisible(refreshSubmitSelector,
       function success() {
         casper.capture(fileName7 + 'Loop3.png');
         var resultsLength3 = casper.evaluate(feedItemLength);
         test.assert(resultsLength3 > 15, testText7 + " loop 3 reached has " + resultsLength3 + " tweets which > 15 results");
         casper.click(refreshSubmitSelector);
       },
       function fail() {
         test.assertExists(refreshSubmitSelector, testText7 + " reached missing " + refreshSubmitSelector);
       });
     // loop 4
     casper.wait(5000);
     casper.waitUntilVisible(refreshSubmitSelector,
       function success() {
         casper.capture(fileName7 + 'Loop4.png');
         var resultsLength4 = casper.evaluate(feedItemLength);
         test.assert(resultsLength4 > 15, testText7 + " loop 4 reached has " + resultsLength4 + " tweets which > 15 results");
         casper.click(refreshSubmitSelector);
       },
       function fail() {
         test.assertExists(refreshSubmitSelector, testText7 + " reached missing " + refreshSubmitSelector);
       });

     casper.wait(2000);
     casper.waitUntilVisible(refreshSubmitSelector,
       function success() {
         var resultsLength = casper.evaluate(feedItemLength);
         casper.capture(fileName7 + 'AfterLoopsPass.png');
         test.assertEquals(maxItems, resultsLength, testText7 + " reached has "+resultsLength+" results");
         casper.click(refreshSubmitSelector);
       }, 
       function fail() {
         casper.capture(fileName + 'AfterLoopsFail.png');
         test.assertExists(refreshSubmitSelector, testText7 + " after loop missing " + refreshSubmitSelector);
       });
   });
  }

  /** Test case: large input */
  if( testsToRun.indexOf(8) != -1 ){
  casper.thenOpen(twitterSearchSite, function() {
    removeLocalStorage();
  });
  var testText8 = "Twitter Search Feed large input test";
  var fileName8 = testText8.replace(/\s+/g, '');
  casper.waitForSelector(formInputSelector,
  function success() {
    this.click(formInputSelector);
  },
  function fail() {
    test.assertExists(formInputSelector, testText8 + " missing " + formInputSelector);
  });
  casper.waitForSelector(inputSelector,
  function success() {
    this.sendKeys(inputSelector, "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234");
  },
  function fail() {
    test.assertExists(inputSelector);
  });
  casper.waitForSelector(inputSelector,
  function success() {
    var query = casper.evaluate(queryValueFtn);
    test.assert(query.length === 1000, testText8 + " truncated input at 1000 characters"); //
  },
  function fail() {
    test.assertExists(searchSubmitSelector, testText8 + " missing " + searchSubmitSelector);
  });
}
  /** Test case no search result */
  if( testsToRun.indexOf(9) != -1 ){
  casper.thenOpen(twitterSearchSite);
  removeLocalStorage();
  var testText9 = "Twitter Search Feed no search result test";
  var fileName9 = testText9.replace(/\s+/g, '');
    casper.waitForSelector(inputSelector,
  function success() {
    this.sendKeys(inputSelector, "78901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567");
  },
  function fail() {
    test.assertExists(inputSelector, testText9 + " missing " + inputSelector);
  });
  casper.waitForSelector(searchSubmitSelector,
  function success() {
    this.click(searchSubmitSelector);
  },
  function fail() {
    test.assertExists(searchSubmitSelector, testText9 + " missing " + searchSubmitSelector);
  });
  f = function() { test.assertTextExists(NoTweetResultsText, "No search results should be displayed");};
  casper.waitForText("No Tweet results for", f, f);
  f = function() { test.assertExists(searchSubmitSelector, testText9 + " search submit should be displayed after no results");};
  casper.waitForSelector(searchSubmitSelector,f, function(){});
  casper.waitForSelector(refreshSubmitSelector,
   function success() {
     test.assertExists(refreshSubmitSelector, testText9 + " should not have refresh displayed after no results");
    },
   function fail() {
     test.assertNotVisible(refreshSubmitSelector, testText9 + " should not have refresh displayed after no results");
   });
}
  
  /* Test Case: no input selected */
  if( testsToRun.indexOf(10) != -1 ){
  casper.thenOpen(twitterSearchSite);
  testText10 = "Twitter Search Feed no input selected test";
  fileName10 = testText10.replace(/\s+/g, '');
  removeLocalStorage();
  casper.waitForSelector(searchSubmitSelector,
  function success() {
    this.click(searchSubmitSelector);
  },
  function fail() {
    test.assertExists(searchSubmitSelector, testText10 + " : missing " + searchSubmitSelector);
  });
  f = function() { test.assertExists(searchSubmitSelector, testText10 + " search submit should be displayed after no search term");};
  casper.waitForSelector(searchSubmitSelector,f, function(){});
  casper.waitForSelector(refreshSubmitSelector,
   function success() {
     test.assertExists(refreshSubmitSelector, testText10 + " submit should not have refresh displayed after no search term");
    },
   function fail() {
     test.assertNotVisible(refreshSubmitSelector, testText10 + " submit should not have refresh displayed after no search term");
   });
}
  /** Test case: proxy with a long url and no url in the url */
  if( testsToRun.indexOf(11) != -1 ){
 casper.thenOpen(twitterSearchSite + "/twitter-proxy.php?q=0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234");
 var testText11 = "No URL in too long a URL to proxy";
 var fileName11 = testText11.replace(/\s+/g, '');
 casper.waitForText(ProxyNoURLSetMsg, 
 function success() {
   test.assertTextExists(ProxyNoURLSetMsg, testText11);
 }, 
 function fail() {
   test.assertTextExists(ProxyNoURLSetMsg, testText11);
 });
} 
   
  casper.run(function() {casper.test.renderResults(true); test.done();});
},

/** utility function to enter a term and click */
enterTermAndClick: function(test, term, testName) {
  casper.waitUntilVisible(formInputSelector,
  function success() {
    this.click(formInputSelector);
  },
  function fail() {
    this.capture(testName.replace(/\s+/g, '') + 'Fail.png');
    test.assertExists(formInputSelector, testName + " missing form Input " + formInputSelector);
  });
  casper.waitUntilVisible(inputSelector,
  function success() {
    this.sendKeys(inputSelector, "test");
  },
  function fail() {
    test.assertExists(inputSelector, testName + " missing Input " + inputSelector);
  });
  casper.waitUntilVisible(searchSubmitSelector,
  function success() {
    this.click(searchSubmitSelector);
  },
  function fail() {
    casper.capture(testName.replace(/\s+/g, '') + 'NoSearchSubmitSoFail.png');
    test.assertExists(searchSubmitSelector, testName + " missing searchSubmit  " + searchSubmitSelector);
  });
},

waitForRefreshAndClick: function (test, testName) {
  casper.waitUntilVisible(refreshSubmitSelector,
  function success() {
    this.click(refreshSubmitSelector);
  },
  function fail() {
    this.capture(testName.replace(/\s+/g, '') + 'NoRefreshSubmitSelectorFail.png');
    test.assertExists(refreshSubmitSelector, testName + " missing "+ refreshSubmitSelector);
  });
  
}


});
