/*Copyright (C) 2013 David Orchard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** 
 * FeedView view for the feed including collections
 * @module FeedView
 */
define(function(require) {
  
   var $ = require('jquery'),
      _ = require('underscore'),
      Backbone = require('backbone'),
      FeedModel = require('models/Feed'),
      FeedItemsCollectionView = require('views/FeedItemsCollection'),
      FeedItemsCollection = require('collections/FeedItemsCollection');
  
  /**
   * @exports FeedView
   * @constructor
   */    
  return Backbone.View.extend({
    events : {
       'click .searchsubmit'            : 'search',
       'click .refreshsubmit'           : 'refresh',
       'click .resetsubmit'             : 'reset',
     },

     el:  '.feedcontainer',  

  /** 
   * restores any previous search query state
   * @instance
   */
    initialize: function(){
      _.bindAll(this, "search");
       this.feedItemsCollection = new FeedItemsCollection();
        
      console.log("An object of FeedView was created");
      this.model.on('reset', _.bind(this.render, this));
      this.feedItemsCollection.on('successfulSearch', _.bind(this.showFeedItemCollection, this));
      this.feedItemsCollection.on('unsuccessfulSearch', _.bind(this.showNoSearchResults, this));

      if(this.model.get('query') !== undefined) {
          this.feedItemsCollection.read();
      }
      this.render();
    },  

/** renders the feedview with a new collection
  *
  * If there is not a stored query then the search form is displayed
  *    else the refresh form/button is displayed
  * @instance
  */
    render : function () {
      this.feed_view = new FeedItemsCollectionView({
          collection: this.feedItemsCollection,
      });
      var query = this.model.get('query');
      if(query === undefined) {
        this.showSearch();
      } else {
        $(".querystring").text(query);        
        this.showFeedItemCollection();
      }
    },
    
    /** Show the search form and hide the feed items with refresh and no results containers */
    showSearch : function() {
      $(".feeditemssearch").show();      
      $(".nosearchresults").hide();     
      $(".feeditemscollectioncontainer").hide();
    },
    
    /** Show the feed items container and hide the search form and no results container */
    showFeedItemCollection : function () {
      $(".feeditemssearch").hide();     
      $(".feeditemscollectioncontainer").show();
      $(".nosearchresults").hide();
      
      // the model is now good.
      this.model.save();
    },
    
    /** Show the search form and the no results container and hide the feed items conatiner */
    showNoSearchResults : function (query) {
      $(".feeditemssearch").show();      
      $(".nosearchresults").show();           
      $(".feeditemscollectioncontainer").hide();
    },
    

     /** search for tweets using a query
      * if it's a valid query and there's no results then show the no results items
      * if it's a valid query and there's results then update the persisent search query and update the feed
      */
     search: function () {
        var query = $("input.search").val();
        if (!query) {
          return;
        }
        // set the model but do NOT persist until it has results.
        this.model.set('query', query);
        $(".querystring").text(query);
        this.feedItemsCollection.search(query);
     },

    /** refresh the collection
     */
    refresh: function () {
      this.feedItemsCollection.refresh(this.model.get('query'));
     },
     
     /** reset the model */

     reset : function () {
       this.model.reset();
       this.feedItemsCollection.reset();
       this.showSearch();
     }
   });
});
