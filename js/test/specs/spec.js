/*Copyright (C) 2013 David Orchard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

require.config( {
  baseUrl: "js",
  paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    
    // Plugins
    
    jasminejquery: 'lib/plugins/jasmine-jquery',    
    text: 'text'
  },
  shim: {        
        // Jasmine-jQuery plugin
        "jasminejquery": {
            deps:['jquery'],
            exports:'jquery'
         },
         
         newsfeedstatic:{
           exports:'news_feed_data'      
         } 
    }
});

// Can this be done in Common JS style?  I tried once and it seemed to break phantomjs
define(['jquery',
"backbone",
"views/Feed",
"views/FeedItem",
"views/FeedItemsCollection",
"models/FeedItem",
"models/Feed",
'collections/FeedItemsCollection',
"routers/mobileRouter", 
'newsfeedstatic',
"jasminejquery"],
function($, Backbone, FeedView, FeedItemView, FeedItemsCollectionView, FeedItemModel, FeedModel, FeedItemsCollection, MobileRouter, news_feed_data ) {

        // Test suite that includes all of the Jasmine unit tests   
        describe("Twitter Search Require", function() {

            // Twitter Search View Suite: contains all tests related to views
            describe("Twitter Search views", function() {

              // Runs before every View spec
              beforeEach(function() {

                setFixtures('<section class="feedcontainer">                   <section class="feeditemssearch">                     <form>                          <p>Please enter your twitter search below.  The search will be saved for you so you can return any time.                            You can refresh the results manually and there is an automatic refresh</p>                          <input class="search" placeholder="Enter search" type="search" maxlength="1000" />                          <span class="searchsubmit" type="button" title="Get Tweets" />                      </form>                   </section>                     <section class="feeditemscollectioncontainer">                       <p>You can refresh the results manually and there is an automatic refresh</p>                               <a href="#" class="refreshsubmit" title="Refresh Search"></a>                       Results for <strong class="querystring"></strong>                       <section class="feeditemscollection"></section>                     </section>                   </section>                   <section class="nosearchresults">                     <section class="header">No Tweet results for</section>                     <section class="querystring"></section>                   </section>');
                this.feedModel = new FeedItemsCollection(news_feed_data.statuses);
              });

              describe("FeedItemsCollectionView", function() {
                beforeEach(function() {
                  this.feedItemsCollectionView = new FeedItemsCollectionView({
                    collection: this.feedModel,
                  });
                });
                
                it('FeedItemsCollectionView returns the view object', function() {
                  expect(this.feedItemsCollectionView.render()).toEqual(this.feedItemsCollectionView);
                });

                it('feeditemscollectionview should have a tagname of "section"', function(){
                  expect(this.feedItemsCollectionView.el.tagName.toLowerCase()).toBe('section');
                });
              });                 
 
              describe("FeedView", function() {
                 var searchButton = ".searchsubmit";
                 beforeEach(function() {
                   this.feedView = new FeedView({model:this.feedModel});
                   spyOnEvent(searchButton, 'click');
                    this.feedView.delegateEvents();
                 });

                 it('searchButton click should generate click event', function() {                  
                   $(searchButton).click();
                   expect('click').toHaveBeenTriggeredOn($(searchButton));
                 });
               });
 
            }); // End of the View test suite


        // Twitter Search Collection Suite: contains all tests related to collections
        describe("Twitter Search collections", function() {

            // Runs before every Collection spec
            beforeEach(function() {

                // Instantiates a new Collection instance
                this.collection = new FeedItemsCollection();
                for(var i = news_feed_data.statuses.length -1 ; i >= 0; i--) {
                   this.collection.unshift(news_feed_data.statuses[i]);
                }

            });

            it("should contain the correct number of models", function() {

                expect(this.collection.length).toEqual(15);

            });

        }); // End of the Collection test suite

        // Twitter Search Mobile Router Suite: contains all tests related to Mobile routers
        describe("Twitter Search mobile routers", function () {

            // Runs before every Mobile Router spec
            beforeEach(function () {

                // Stops the router from listening to hashchange events (Required because Backbone will only allow you to run Backbone.history.start() once for each page load.)
                Backbone.history.stop();

                // Instantiates a new Router instance
                this.router = new MobileRouter();

                // Creates a Jasmine spy
                this.routeSpy = jasmine.createSpy("home");

                // When the route index method is called, the Jasmine spy is also called
                this.router.on("route:home", this.routeSpy);

            });
            
            it("should call the mobile router home method when there is a #home on the url", function() {
 
                 // Navigates to home
                 this.router.navigate("#home");

                 // Navigates to the default route
                 this.router.navigate("", { trigger: true });

                 // Expects the Jasmine spy to have been called
                 expect(this.routeSpy).toHaveBeenCalled();

             });
            

            it("should call the mobile router home method when there is no hash on the url", function() {

                // Navigates to a different route
                this.router.navigate("elsewhere");

                // Navigates to the default route
                this.router.navigate("", { trigger: true });

                // Expects the Jasmine spy to have been called
                expect(this.routeSpy).toHaveBeenCalled();

            });

        }); // End of the Mobile Router test suite

    }); // End of the Twitter Search Require test suite

});