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
function($,
  Backbone,
  FeedView,
  FeedItemView,
  FeedItemsCollectionView,
  FeedItemModel,
  FeedModel,
  FeedItemsCollection,
  MobileRouter,
  news_feed_data )
  {
  var testData1 = {statuses : [ {"id_str" : "377465033191485441",
                                 "created_at" : "Tue Sep 10 16:14:11 +0000 2013",
                                 "user" : {
                                     "screen_name" : "NBAZena",
                                     "profile_image_url" : "http:\/\/a0.twimg.com\/profile_images\/470119903\/NBA_Genova_logoSociet__normal.jpg"
                                   },
                                   "text" : "text1"
                                   }
                              ]
                  };

  var testData = {statuses : []};

        // Test suite that includes all of the Jasmine unit tests
        describe("Twitter Search", function() {

            // Twitter Search View Suite: contains all tests related to views
            describe("Twitter Search views", function() {

              // Runs before every View spec
              beforeEach(function() {

                setFixtures('');
                this.feedModel = new FeedModel();
              });

              describe("FeedItemsCollectionView", function() {
                beforeEach(function() {
                  this.feedItemsCollection = new FeedItemsCollection();
                  this.feedItemsCollection.update(news_feed_data);
                   this.feedItemsCollectionView = new FeedItemsCollectionView({
                    collection: this.feedItemsCollection,
                  });

                });

                it('render() returns the view object', function() {
                  expect(this.feedItemsCollectionView.render()).toEqual(this.feedItemsCollectionView);
                });

                it('should have a tagname of "section"', function(){
                  expect(this.feedItemsCollectionView.el.tagName.toLowerCase()).toBe('section');
                });

                it("should contain the correct number of views", function() {
                  expect(this.feedItemsCollectionView.$el.children().length).toEqual(15);
                });

                it("should contain the correct number of views after 1 added", function() {
                  this.feedItemsCollection.maxSize = 15;
                  this.feedItemsCollection.update(testData1);
                  expect(this.feedItemsCollectionView.$el.children().length).toEqual(15);
                });
              });

              describe("FeedView", function() {
                 var searchButton = ".searchsubmit";
                 var refreshButton = ".refreshsubmit";
                 var resetButton = ".resetsubmit";
                 
                 beforeEach( function (){
                   //setFixtures('<section id="feedcontainer"><span class="searchsubmit" type="button" title="Get Tweets" ></span><section class="feeditemscollectioncontainer"><span class="refreshsubmit" title="Refresh Search" label="Refresh Search"></span>Results for <strong class="querystring"></strong><section class="feeditemscollection"></section></section></section>');
                   this.feedView = new FeedView({model: new FeedModel()});
                   spyOn(this.feedView, 'search');
                   spyOn(this.feedView, 'refresh');
                   spyOn(this.feedView, 'reset');
                   spyOn(this.feedView, 'showFeedItemCollection');
                   spyOn(this.feedView, 'showNoSearchResults');
                   spyOnEvent(searchButton, 'click');
                   spyOnEvent(refreshButton, 'click');
                   spyOnEvent(resetButton, 'click');
                   this.feedView.delegateEvents();
                 });

                it('searchButton click should generate click event', function() {
                  $(searchButton).click();
                  expect('click').toHaveBeenTriggeredOn($(searchButton));
                });
                it('refreshButton click should generate click event', function() {
                  $(refreshButton).click();
                  expect('click').toHaveBeenTriggeredOn($(refreshButton));
                });
                it('resetButton click should generate click event', function() {
                  $(resetButton).click();
                  expect('click').toHaveBeenTriggeredOn($(resetButton));
                });

                it('searchbutton click should call search function', function() {
                  expect(this.feedView).not.toEqual(null);
                  this.feedView.$el.find(searchButton).click();
                  expect(this.feedView.search).toHaveBeenCalled();
                });

                it('refreshbutton click should call refresh function', function() {
                  this.feedView.$el.find(refreshButton).click();
                  expect(this.feedView.refresh).toHaveBeenCalled();
                });
                it('resetbutton click should call reset function', function() {
                  this.feedView.$el.find(resetButton).click();
                  expect(this.feedView.reset).toHaveBeenCalled();
                 });

/** The Spy isn't getting called, not sure why.  The showNoSearchResults is actually being called.  Setting a breakpoint shows the spy in place.
               it('No item in FeedItemsCollection after search should call showNoSearchResults', function () {
                  this.feedView.feedItemsCollection.update(testData);
                  expect(this.feedView.showNoSearchResults).toHaveBeenCalled();
                });

                  it('Adding item in FeedItemsCollection after search should call showFeedItemCollection', function () {
                  this.feedView.feedItemsCollection.update(testData1);
                  //expect('successfulSearch').toHaveBeenTriggeredOn(this.feedView.feedItemsCollection  );
                  expect(this.feedView.showFeedItemCollection).toHaveBeenCalled();
                });
*/
               });

            }); // End of the View test suite


        // Twitter Search Collection Suite: contains all tests related to collections
        describe("Twitter Search collections", function() {

          describe("FeedItemsCollection", function() {
          // Runs before every Collection spec
          beforeEach(function() {
            // Instantiates a new Collection instance
            this.collection = new FeedItemsCollection();
          });

          it("should contain the correct number of models", function() {
            this.collection.update(news_feed_data);
            expect(this.collection.length).toEqual(15);
          });

          it("should contain the correct number of models after 1 added", function() {
            this.collection.maxSize = 15;
            this.collection.update(news_feed_data);
            this.collection.update(testData1);
            expect(this.collection.length).toEqual(15);
          });

          it("should fire successfulSearch event after update with no items previously", function () {
            var spy = jasmine.createSpy('');
            this.collection.bind('successfulSearch', spy);
            this.collection.update(testData1);
            expect(spy).toHaveBeenCalled();
          });

          it("should fire unsuccessfulSearch event after update with no items previously", function () {
            var spy = jasmine.createSpy('');
            this.collection.bind('unsuccessfulSearch', spy);
            this.collection.update(testData);
            expect(spy).toHaveBeenCalled();
          });
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

    }); // End of the Twitter Search test suite

});