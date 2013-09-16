/*Copyright (C) 2013 David Orchard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

require.config({baseUrl:"js",paths:{jquery:"lib/jquery",underscore:"lib/underscore",backbone:"lib/backbone",newsfeedstatic:"test/newsfeedstatic",jasminejquery:"lib/plugins/jasmine-jquery",text:"text"},shim:{underscore:{exports:"_"},backbone:{deps:["underscore","jquery"],exports:"Backbone"},jasminejquery:{deps:["jquery"],exports:"jquery"},newsfeedstatic:{exports:"news_feed_data"}}}),define(["jquery","backbone","views/Feed","views/FeedItem","views/FeedItemsCollection","models/FeedItem","models/Feed","collections/FeedItemsCollection","routers/mobileRouter","newsfeedstatic","common","jasminejquery"],function(e,t,n,r,i,s,o,u,a,f,l){var c={statuses:[{id_str:"377465033191485441",created_at:"Tue Sep 10 16:14:11 +0000 2013",user:{screen_name:"NBAZena",profile_image_url:"http://a0.twimg.com/profile_images/470119903/NBA_Genova_logoSociet__normal.jpg"},text:"text1"}]},h={statuses:[]};describe("Twitter Search",function(){describe("Twitter Search views",function(){beforeEach(function(){setFixtures(""),this.feedModel=new o}),describe("FeedItemsCollectionView",function(){beforeEach(function(){this.common=l,this.common.maxFeedItemsCollectionSize=15,this.feedItemsCollection=new u,this.feedItemsCollection.update(f),this.feedItemsCollectionView=new i({collection:this.feedItemsCollection})}),it("render() returns the view object",function(){expect(this.feedItemsCollectionView.render()).toEqual(this.feedItemsCollectionView)}),it('should have a tagname of "section"',function(){expect(this.feedItemsCollectionView.el.tagName.toLowerCase()).toBe("section")}),it("should contain the correct number of views",function(){expect(this.feedItemsCollectionView.$el.children().length).toEqual(15)}),it("should contain the correct number of views after 1 added",function(){this.feedItemsCollection.update(c),expect(this.feedItemsCollectionView.$el.children().length).toEqual(15)})}),describe("FeedView",function(){var t=".searchsubmit",r=".refreshsubmit",i=".resetsubmit";beforeEach(function(){this.feedView=new n({model:new o}),spyOn(this.feedView,"search"),spyOn(this.feedView,"refresh"),spyOn(this.feedView,"reset"),spyOn(this.feedView,"showFeedItemCollection"),spyOn(this.feedView,"showNoSearchResults"),spyOnEvent(t,"click"),spyOnEvent(r,"click"),spyOnEvent(i,"click"),this.feedView.delegateEvents()}),it("searchButton click should generate click event",function(){e(t).click(),expect("click").toHaveBeenTriggeredOn(e(t))}),it("refreshButton click should generate click event",function(){e(r).click(),expect("click").toHaveBeenTriggeredOn(e(r))}),it("resetButton click should generate click event",function(){e(i).click(),expect("click").toHaveBeenTriggeredOn(e(i))}),it("searchbutton click should call search function",function(){expect(this.feedView).not.toEqual(null),this.feedView.$el.find(t).click(),expect(this.feedView.search).toHaveBeenCalled()}),it("refreshbutton click should call refresh function",function(){this.feedView.$el.find(r).click(),expect(this.feedView.refresh).toHaveBeenCalled()}),it("resetbutton click should call reset function",function(){this.feedView.$el.find(i).click(),expect(this.feedView.reset).toHaveBeenCalled()})})}),describe("Twitter Search collections",function(){describe("FeedItemsCollection",function(){beforeEach(function(){this.collection=new u}),it("should contain the correct number of models",function(){this.collection.update(f),expect(this.collection.length).toEqual(15)}),it("should contain the correct number of models after 1 added",function(){this.collection.maxSize=15,this.collection.update(f),this.collection.update(c),expect(this.collection.length).toEqual(15)}),it("should fire successfulSearch event after update with no items previously",function(){var e=jasmine.createSpy("");this.collection.bind("successfulSearch",e),this.collection.update(c),expect(e).toHaveBeenCalled()}),it("should fire unsuccessfulSearch event after update with no items previously",function(){var e=jasmine.createSpy("");this.collection.bind("unsuccessfulSearch",e),this.collection.update(h),expect(e).toHaveBeenCalled()}),it("should have no items after reset called",function(){this.collection.reset(),expect(this.collection.length).toEqual(0)})})}),describe("Twitter Search mobile routers",function(){beforeEach(function(){t.history.stop(),this.router=new a,t.history.start(),this.routeSpy=jasmine.createSpy("home"),this.router.on("route:home",this.routeSpy)}),it("should call the mobile router home method when there is a #home on the url",function(){this.router.navigate("#home"),this.router.navigate("",{trigger:!0}),expect(this.routeSpy).toHaveBeenCalled()}),it("should call the mobile router home method when there is no hash on the url",function(){this.router.navigate("elsewhere"),this.router.navigate("",{trigger:!0}),expect(this.routeSpy).toHaveBeenCalled()})})})});