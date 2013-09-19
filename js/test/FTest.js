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
// Can switch to ftest against running heroku instance
//var twitterSearchSite = localhost;
var twitterSearchSite = heroku;
var autorefreshinterval = 30000;
var maxItems = 50;

var removeLocalStorageDirectAccess = function(testName) { 
    casper.evaluate(function() {
      delete localStorage.feed;
      });
    };

var removeLocalStorageClickReset = function (testName, successCallback) { 
  casper.waitForSelector(resetSubmitSelector, 
    function success() { 
      casper.click(resetSubmitSelector);
      if(successCallback) {
        successCallback();
      }
    }, 
    function fail() {
      casper.capture(testName + 'neverSeeReset.png');
      casper.assertExists(resetSubmitSelector, (testName !== undefined ? testName : "No testName provided") + " looking for resetSubmit");
     });
};

var removeLocalStorage = removeLocalStorageClickReset;

var feedItemLength = function() {return $(".feeditem").length;};
var feedItemLengthGreaterThan = function(val){ return casper.evaluate(feedItemLength) > val;};
var queryValueFtn = function() {return $("input").val();};
var ProxyNoURLSetMsg = "No URL set";
var ProxyURLTooLongMsg = "URL too long";
var ProxyURLNotAuthorisedMsg = "URL is not authorised";
var NoTweetResultsText = "No Tweet results for";
//var testsToRun = [7];
var testsToRun = Array(1,2,3,4,5,6,7,8,9,10,11);

casper.test.begin("Twitter Search Feed tests", {
  setUp: function(test) {    
  },
  
  test: function(test) {
    /** down the middle test, search term, refresh */
    casper.start(twitterSearchSite);
    removeLocalStorage("test initializer");
    var that = this;
    if( testsToRun.indexOf(1) != -1 ){
      var testText = "Twitter Search Feed Test #1: down the middle test";
      var fileName = testText.replace(/\s+/g, '');
      casper.then( function() {
        that.enterTermAndClick(test, "test", testText);
        casper.then( function () {
          casper.waitForSelector('.feeditem', function success() {
            test.assertExists('.feeditem', testText + " has " + '.feeditem');
            casper.then( function() {
              that.waitForRefreshAndClick(test, testText);
              casper.then( function() {
                test.assertExists(refreshSubmitSelector, testText + " last check");
              });
            });
          }, function fail() {
            casper.capture(fileName + 'NoFeedItemSoFail.png');
            test.assertExists('.feeditem', testText + " has " + '.feeditem');
          });
        });
      });
    }

    /** down the middle test, reload, */
      if( testsToRun.indexOf(2) != -1 ){
        casper.thenOpen(twitterSearchSite);
        casper.then( function() {
          var testText2 = "Twitter Search Feed Test #2: down the middle test after reload";
          that.waitForRefreshAndClick(casper.test, testText2);
          test.assertExists(refreshSubmitSelector, testText2);
        });
      }
   
      /** Test case: proxy with a long url and no url in the url */
      if( testsToRun.indexOf(3) != -1 ){
       casper.thenOpen(twitterSearchSite + "/twitter-proxy.php?q=0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234");
       var testText11 = "Twitter Search Feed Test #3: No URL in too long a URL to proxy";
       var fileName11 = testText11.replace(/\s+/g, '');
       casper.waitForText(ProxyNoURLSetMsg, 
       function success() {
         test.assertTextExists(ProxyNoURLSetMsg, testText11);
       }, 
       function fail() {
         test.assertTextExists(ProxyNoURLSetMsg, testText11);
       });
      } 
 
  /* Test case: big request with manual refresh does add */
  if( testsToRun.indexOf(4) != -1 ){
    casper.then( function () {
      var resultsLength = 0;
      casper.thenOpen(twitterSearchSite);
      var testText4 = "Twitter Search Feed Test #4: big request manual refresh test";
      var fileName4 = testText4.replace(/\s+/g, '');
      removeLocalStorage(testText4, function() {
        casper.reload();
        casper.waitUntilVisible(inputSelector,
          function success() {
            this.sendKeys(inputSelector, "test");
            casper.waitUntilVisible(searchSubmitSelector,
              function success() {
                casper.click(searchSubmitSelector);
                casper.waitUntilVisible(refreshSubmitSelector,
                  function success() {
                    test.assertVisible(refreshSubmitSelector, testText4 + " refresh displayed");
                    casper.wait(5000);
                    resultsLength = casper.evaluate(feedItemLength);
                    test.assert(resultsLength > 0 , testText4 + " has " + resultsLength + " results");
                    casper.click(refreshSubmitSelector);
                    var f = function success() {
                      // wait for rendering to finish
                      casper.wait(1000);
                      var resultsLengthNow = casper.evaluate(feedItemLength);
                      test.assert(resultsLengthNow > resultsLength , testText4 +  " after manual refresh has " + resultsLengthNow + " results which is >" + resultsLength);
                    };
                    // would be nice to wait for $(".feeditem:first .feeditemtext").text() to change
                    // or even a css3 selector for text content, which sadly didn't make the cut.
                    //casper.waitForSelectorTextChange('.feeditem:first .feeditemtext', f, f); doesn't work
                    // I *hate* timing based tests.  Determinism is good for the soul

//                    casper.wait(5000);
//                    casper.waitUntilVisible(refreshSubmitSelector, f, f);
                      casper.waitFor(function() { var rl = casper.evaluate(feedItemLength); return rl > resultsLength;}, f, f);
                  },
                  function fail() {
                    casper.capture(fileName4 + 'Fail.png');
                    test.assertExists(refreshSubmitSelector, testText4 + " missing " + refreshSubmitSelector);
                  });
                },
                function fail() {
                  test.assertExists(searchSubmitSelector, testText4 + " missing searchSubmit  " + searchSubmitSelector);
                });
              },
              function fail() {
                test.assertExists(inputSelector, testText4 + " missing Input" + inputSelector);
              });
            });  
          });  
        }

  
   /** Test case: proxy with not whitelisted request */
   casper.then( function () {
     if( testsToRun.indexOf(5) != -1 ){
       var testText5 = "Twiiter Search Feed Test #5: URL sent to the proxy with a non search url";
       casper.thenOpen(twitterSearchSite + "/twitter-proxy.php?url=statuses/home_timeline");
       f = function() { test.assertTextExists(ProxyURLNotAuthorisedMsg, testText5);};
       casper.waitForText(ProxyURLNotAuthorisedMsg, f, f);
    }
    });
     
    /** Test case: proxy with a long url and url in the url */
    casper.then( function () {
      if( testsToRun.indexOf(6) != -1 ){
        var testText6 = "Twitter Search Feed Test #6: URL sent to the proxy with too long a url";
    casper.thenOpen(twitterSearchSite + "/twitter-proxy.php?url=search/tweets.json?q=0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234");
     f = function success() { test.assertTextExists(ProxyURLTooLongMsg, testText6);};
  
      casper.waitForText(ProxyURLTooLongMsg, f, f);
    }
  });
   /** Test case: max feed items limit reached */
   casper.then( function () {
     if( testsToRun.indexOf(7) != -1 ){
       var testText7 = "Twitter Search Feed Test #7: big request max feed items limit";
       var fileName7 = testText7.replace(/\s+/g, '');
       casper.thenOpen(twitterSearchSite);
       removeLocalStorage(testText7);
       casper.thenOpen(twitterSearchSite, function () {
       that.enterTermAndClick(test, "a", testText7);  
       //can't do loops because of closure
       // loop 1
       casper.wait(1000);
       casper.waitFor(function() { return feedItemLengthGreaterThan(14);},
         function success() {
           var resultsLength = casper.evaluate(feedItemLength);
           test.assert(resultsLength > 0, testText7 + " loop 1 reached has " + resultsLength + " tweets which > 0 results");
           casper.wait(3000);
           casper.click(refreshSubmitSelector);
            // loop 2
           casper.wait(1000);
           casper.waitFor(function() { return feedItemLengthGreaterThan(resultsLength);},
             function success() {
               var resultsLength2 = casper.evaluate(feedItemLength);
               test.assert(resultsLength2 > resultsLength, testText7 + " loop 2 reached has " + resultsLength2 + " tweets which > " + resultsLength + " results");
               casper.wait(3000);
               casper.click(refreshSubmitSelector);
               // loop 3
               casper.wait(2000);
               casper.waitFor(function() { return feedItemLengthGreaterThan(resultsLength2);},
                 function success() {
                   var resultsLength3 = casper.evaluate(feedItemLength);
                   test.assert(resultsLength3 > resultsLength2, testText7 + " loop 3 reached has " + resultsLength3 + " tweets which > " + resultsLength2 + " results");
                   casper.wait(3000);
                   casper.click(refreshSubmitSelector);
                   // loop 4
                   casper.wait(2000);
                   casper.waitFor(function() { return feedItemLengthGreaterThan(resultsLength3);},
                      function success() {
                        var resultsLength4 = casper.evaluate(feedItemLength);
                        test.assert(resultsLength4 > resultsLength3, testText7 + " loop 4 reached has " + resultsLength4 + " tweets which > " + resultsLength3 + " results");
                        casper.wait(3000);
                        casper.click(refreshSubmitSelector);
                        casper.wait(2000);
                        casper.waitFor(function() { return(feedItemLengthGreaterThan(resultsLength4) || resultsLength4 == maxItems);},
                        function success() {
                          var resultsLength5 = casper.evaluate(feedItemLength);
                          test.assertEquals(maxItems, resultsLength5, testText7 + " after all loops reached has "+resultsLength5+" results");
                         }, 
                        function fail() {
                          casper.capture(fileName7 + 'AfterLoopsFail.png');
                          test.assertExists(refreshSubmitSelector, testText7 + " after all loops reached has feedItemLengthGreaterThan(" + resultsLength4 + ")");
                        });
                      },
                      function fail() {
                        test.assertExists(refreshSubmitSelector, testText7 + " after loop 4 reached missing feedItemLengthGreaterThan(" + resultsLength3 + ")");
                      });
                  },
                 function fail() {
                   test.assertExists(refreshSubmitSelector, testText7 + " after loop 3 reached missing feedItemLengthGreaterThan(" + resultsLength2 + ")");
                 });
             },
             function fail() {
               test.assertExists(refreshSubmitSelector, testText7 + " after loop 2 reached missing feedItemLengthGreaterThan(" + resultsLength + ")");
             });
         },
         function fail() {
           test.assertExists(refreshSubmitSelector, testText7 + " ater loop 1 reached missing feedItemLengthGreaterThan(14)");
         });
       });
    }
  });
  /** Test case: large input */
  if( testsToRun.indexOf(8) != -1 ){
    var testText8 = "Twitter Search Feed Test #8: large input test";
    var fileName8 = testText8.replace(/\s+/g, '');
    casper.thenOpen(twitterSearchSite, function() {
      removeLocalStorage(testText8);
    });
    casper.waitForSelector(formInputSelector,
    function success() {
      casper.click(formInputSelector);
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
    var testText9 = "Twitter Search Feed Test #9: no search result test";
    var fileName9 = testText9.replace(/\s+/g, '');
    removeLocalStorage(testText9);
      casper.waitForSelector(inputSelector,
    function success() {
      this.sendKeys(inputSelector, "78901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567");
      casper.waitForSelector(searchSubmitSelector,
      function success() {
        casper.click(searchSubmitSelector);
      },
      function fail() {
        test.assertExists(searchSubmitSelector, testText9 + " missing " + searchSubmitSelector);
      });
      f = function() { test.assertTextExists(NoTweetResultsText, testText9 + "No search results should be displayed");};
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
    },
    function fail() {
      test.assertExists(inputSelector, testText9 + " missing " + inputSelector);
    });
  }
  
  /* Test Case: no input selected */
  if( testsToRun.indexOf(10) != -1 ){
    casper.thenOpen(twitterSearchSite, function () {
      testText10 = "Twitter Search Feed Test #10: no input selected test";
      fileName10 = testText10.replace(/\s+/g, '');
      removeLocalStorage(testText10);
      casper.waitForSelector(searchSubmitSelector,
      function success() {
        casper.click(searchSubmitSelector);
        f = function() { test.assertExists(searchSubmitSelector, testText10 + " search submit should be displayed after no search term");};
        casper.waitForSelector(searchSubmitSelector,f, function(){});
        casper.waitForSelector(refreshSubmitSelector,
         function success() {
           test.assertExists(refreshSubmitSelector, testText10 + " submit should not have refresh displayed after no search term");
          },
         function fail() {
           test.assertNotVisible(refreshSubmitSelector, testText10 + " submit should not have refresh displayed after no search term");
         });
      },
      function fail() {
        test.assertExists(searchSubmitSelector, testText10 + " : missing " + searchSubmitSelector);
      });
     });
  }
   /** Test case: big request with auto refresh does add */
   casper.then( function () {
     if( testsToRun.indexOf(11) != -1 ){
       removeLocalStorage("test initializer");
       casper.thenOpen(twitterSearchSite);
       var testText3 = "Twitter Search Feed Test #11: big request auto refresh";
       var fileName3 = testText3.replace(/\s+/g, '');
       casper.then( function() {
       that.enterTermAndClick(test, "a", testText3);
       casper.waitUntilVisible(refreshSubmitSelector,
         function success() {
           var resultsLength = casper.evaluate(feedItemLength);
           test.assertEquals(15, resultsLength, testText3 + " has 15 results");
           casper.click(refreshSubmitSelector);
         },
         function fail() {
           casper.capture(fileName3 + 'Fail.png');
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
  });
   
  casper.run(function() {casper.test.renderResults(true); test.done();});
  },

  /** utility function to enter a term and click */
  enterTermAndClick: function(test, term, testName) {
    casper.waitUntilVisible(formInputSelector,
    function success() {
      casper.click(formInputSelector);
    },
    function fail() {
      casper.capture(testName.replace(/\s+/g, '') + 'NoFormInputSoFail.png');
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
      casper.click(searchSubmitSelector);
    },
    function fail() {
      test.assertExists(searchSubmitSelector, testName + " missing searchSubmit  " + searchSubmitSelector);
    });
  
  },

  waitForRefreshAndClick: function (test, testName) {
    casper.waitUntilVisible(refreshSubmitSelector,
    function success() {
      casper.click(refreshSubmitSelector);
    },
    function fail() {
      casper.capture(testName.replace(/\s+/g, '') + 'NoRefreshSubmitSelectorFail.png');
      test.assertExists(refreshSubmitSelector, testName + " missing "+ refreshSubmitSelector);
    });
  
  }
});

