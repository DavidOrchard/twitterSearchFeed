twitterSearchFeed
=================

A simple Twitter search feed

Problem Description
Using only standard CSS, HTML, Javascript, Backbone, Underscore, JQuery (not JQuery UI or JQuery plugins) and the Twitter 1.0 API, this is a basic functioning Twitter search feed. 

When first opened, the application prompts the user to enter a search string to initialize the twitterfeed. On subsequent openings, the app remembers the last search the user performed. 

The application automatically displays new tweets in the search stream using a time interval, and also provides a button for the user to manually refresh the stream without reloading the page.

The application uses one Backbone view, model, and collection and make uses of an Underscore template to display the following tweet metadata.  A tweet does not need to support clickable URLs, clickable username or show embedded media):

* from_user_name
* profile_image
* tweet text
* create date

The design is focused towards the "average" non-technical user. It takes careful note of edge cases and error resolution process (both programmatically and in the UI).

##Areas of Focus
* Clean code
* Succinct yet clear documentation
* Edge case handling
* Pleasant operation
* Accurate results
* Demonstrable understanding of core web technologies

#Resources
* Backbone JS: http://backbonejs.org/
* Underscore JS: http://underscorejs.org/
* JQuery through Google CDN: https://developers.google.com/speed/libraries/devguide
* Twitter Search API: https://dev.twitter.com/docs/api/1.1/get/search
* RequireJS
* CasperJS

#Architecture and Design

##Visual design
The app starts with some explanative text and a search input, styled as a search input and with a search button.  Upon tapping the search button and having more than 0 results, the search input is hidden, results are displayed and a refresh icon is displayed.  If there are no results, a no results section is displayed and the search remains.  The search results are persisted to the device and are available if the user visits the app again.

There is explicitly no "fancy" UI, such as:
 * pull to refresh
 * spinner during search or refresh
 * change the time interval for auto-refresh
 * show new tweets such as a highlight or the twitter style (n new results, tap to show)
 * show time of last refresh
 * show offline/online state
 * pagination of long results
 * login so my personal oauth credentials are used.
 * warning the user if localStorage isn't available
 * bookmarking the app
 * reasonable styling, shading, corners...
 * a button to cancel the persisted search
 
## Application Architecture and design

The application is primarily javascript using Backbone and RequireJS.  It uses a twitter proxy due to browser same origin policy. 

The twitter best practices guide says "Include a since_id when asking for Tweets. since_id should be set to the value of the last Tweet you received or the max_id from the Search API response. If the since_id you provide is older than the index allows, it will be updated to the oldest since_id available." so the since_id or the max_id from the previous search is used

The Twitter app is at https://dev.twitter.com/apps/5062978/show, twitsearchfeed is the brilliant name

The app uses the php twitter proxy from http://mikerogers.io/2013/02/25/how-use-twitter-oauth-1-1-javascriptjquery.html.  I added a check for max URL length of about 1020 characters. I changed it so the blacklist is a pattern match on the url to allow search queries to go through, rather than exact matches as originally designed.  The proxy does not filter the response data, that's an obvious future performance enhancement.
whitelist.  

It is deployed on heroku at http://twittersearchfeed.herokuapp.com/

Grunt automates the running of jsdoc, jshint, jasmine unit tests, casperjs functional tests, and deployment to git.  grunt test will run jshint, jasmine unit tests and casperjs ftests.

There is a backbone model for a feed item and a feed, a collection of feed items.  There are views for a feed, a feed items collection and a feed item.  With approval, the statement "The application uses one Backbone view, model, and collection" is interpreted as one or more views, one or more models, and one or more collections.  Moving the feed, feedItem, and feedItemsCollection into one view doesn't seem natural.   

As Sep 16th, the FeedItemsCollection uses Backbones built in URL handling with parsing.  backbone.localStorage is used to persist the Feed model and the feedItemsCollection.  There is conflict between the fetch for localStorage and the fetch for the twitter search.  There is a fetchRemote function to disambiguate.  There can be duplicate sync events issued after the local or remote stores have been fetched.  It would be good for backbone to have a way for the store provider to indicate which store was synced. 

The UI is performant on refresh as any new tweets are inserted at the top and the existing tweets are not rendered.  There is a maximum number of tweets that are stored to prevent out of memory errors and sluggishness.  Extra models are removed and the DOM nodes are removed.  I believe this means they really are removed and do not become zombies, but I'm not 100% positive.  The feeditems are fairly minimal in their markup.  Each element is required for a css selector, and no more.

There is currently no mechanism to rate limit a users requests including auto-refresh.

The search and refresh icons are from Hootsuite's desktop app.  They should be a bit larger.

If localStorage is not available, the app still functions but without persistence. It wasn't worth making a custom modernizr build to just check for localStorage.  

To restart and kill the previous search:
desktop: enter the javascript console and type localStorage.clear(). 
mobile: terminate the browser window in safari or chrome; delete the localStorage for the app (on iOS, this is settings -> safari -> advanced -> Website Data -> Edit -> - next to site you're using, tap delete.

Alternatively, localStorage can be disabled using incognito mode.

# Testing

The files pass jshint, with 2 warnings excluded.  grunt jshint runs the jshint tests.

Casperjs tests can be run with casperjs test js/test/FTest.js or grunt casperjs or grunt ftest

jasmine tests can be run with SpecRunner.html, such as http://twittersearchfeed.herokuapp.com/SpecRunner.html, and grunt jasmine or grunt unittest

grunt test will run jshint, unittest, and ftest

The Feed model and the FeedItems Collections are coupled to the localStorage.  There's a bit more unit testing that could be done, such as checking for max lengths.  

It looks like the 2 ways of clearing localstorage: 1) casper.evaluate of removing localStorage (delete localStorage.feed and localStorage.removeItem('feed'), and 2) adding a reset button that clears it; don't work well with casper js.  There is a manual way to remove the localStorage: 
rm ~/Library/Application\ Support/Ofi\ Labs/PhantomJS/http_localhost_0.localstorage

I resorted to resetting the models in addition to removing localStorage when a custom reset method is called, typically via a hidden reset button.  After the models are reset, the UI resets to the search state as there are just empty models then.  This workaround enables the casper ftests to run to completion.

There could be more unit tests or ftests, such as images correctly displayed, exact correct formatting of the elements, etc.  It is important to only test the external behavior, not the internals.  This allows for refactoring and changes without needless test rewrites.  Also, the FTest.js file has some duplicate code because there are problems guaranteeing ordering of executing.

TODO: 

* Clean up FTest.js dup code
* Clean up automated github and heroku deployment

#Installation

##Grunt
* npm install -g grunt-cli
* npm install
* npm install grunt-shell
* npm install grunt-contrib-jasmine
* npm install requirejs
* npm install grunt-jsdoc
* npm install -g git://github.com/jsdoc3/jsdoc.git

## Valiant attempts

Couldn't split casperjs tests into multiple files per https://gist.github.com/n1k0/3813361.  The waitFor doesn't wait in file like:
  var x = require('casper').selectXPath;
  casper.test.comment("Ftest");
  casper.start("http://localhost/~dave/twittersearchfeed/");
  casper.waitForSelector("form input#query",
    function success() {
       this.click("form input#query");
    },
    function fail() {
      test.assertExists("form input#query", "Twitter Search Feed down the middle tests: form input#query");
    });
  casper.echo("finished waiting");

Can't run multiple casperjs suites per file per https://groups.google.com/forum/#!topic/casperjs/VrtkdGQl3FA

Something has broken recently in grunt-contrib-jasmine and previously working tests and these tests don't run.  I tried both normal and --save-dev versions.  A common problem is The 0.5.1 version of jasmine-phantomjs has a rights problem so you may need to 
sudo chmod a+x node_modules/grunt-contrib-jasmine/node_modules/grunt-lib-phantomjs/node_modules/phantomjs/lib/phantom/bin/phantomjs
Even after that, the loading of the js/test/specs/spec.js in the generated _SpecRunner.html timesout.

## Other things
I spent at least half and maybe 2/3 of the effort on the casperjs tests.  I found it a very fragile and unpolished product.  See the previous comments about inability to split tests into suites within a file and across files, needing to manually reset localStorage.  Many things just don't work.  I found the ordering of the tests to be fairly random.  I eneded up wrapping a lot of calls in then() and this made the test code even more complicated.

I originally posted this on Sep 11, but I mistakenly put my twitter OAuth keys in the first commit. I had to remove that commit for obvious reasons.  The only way to rebase onto a first commit (one without a parent) is to rebase -i all the commits after, then reset to the first commit, git add ., git commit --amend, git push.  Doc'd in http://feeding.cloud.geek.nz/posts/combining-multiple-commits-into-one/.  Unfortunately that lost the git history from Sep 12 to Sep 13th.  I have put a version from noonish on Sept 12th at branch "sept12"