/*Copyright (C) 2013 David Orchard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** @module FeedItemsCollection */
define([
  'underscore',
  'backbone',
  'models/FeedItem'
], function(_, Backbone, FeedItemModel){
  'use strict';
  var FeedItemsCollection = Backbone.Collection.extend({
    model: FeedItemModel,
    maxSize: 50,
    
    /** save the collection to localStorage */
    save: function () {
      try {
        localStorage.feedItemsCollection = JSON.stringify(this.toJSON());
      } catch (e) {        
      }
    },

    /** read the collection from localStorage */
    read: function() {
      var feedItemsFromLocalStorage = null;
      try {
        if( localStorage.feedItemsCollection !== undefined ){
          feedItemsFromLocalStorage = JSON.parse(localStorage.feedItemsCollection);
          this.add(feedItemsFromLocalStorage);
          if( this.length > 0 ) {
            this.trigger('successfulSearch');
          }
        }
      } catch( e) {
        // if there's any problems parsing the stored stuff, at least get us back to a stable state
        this.reset();
      }
      return(feedItemsFromLocalStorage);
    },

    /** clear the localStorage and reset the model */
    reset: function() {
      try {
        localStorage.removeItem("feedItemsCollection");
      } catch (e) {        
      }
    },
    
    /** update the collection with the new feed_items */
    update: function(feedItems) {
      if(feedItems !== undefined && feedItems.statuses !== undefined ) {
        var statuses = feedItems.statuses;
      // If there is a feedItem returned and none, then fire a successfulSearch message
      if( this.length == 0 ) {
         if( statuses.length > 0 ) {
           this.trigger('successfulSearch');
         } else {
           this.trigger('unsuccessfulSearch');
         }
      }
      for(var i = statuses.length -1 ; i >= 0; i--) {
         this.unshift(statuses[i]);
         while(this.length > this.maxSize ) {
           this.pop();
         }
      }
      this.save();
    }
    },
    /** call the twitter search api using the proxy
      * @param {string} query the search query 
      * @param {function} callback
      */
     callQuery: function(query, callback) {
       // format per twitter-proxy.php?url='+encodeURIComponent('statuses/user_timeline.json?screen_name=MikeRogers0&count=2')
       // twitter search = https://api.twitter.com/1.1/search/tweets.json
       var url = "twitter-proxy.php?url=";
       // we encode the query to handle any special characters properly
        url += encodeURIComponent("search/tweets.json?q="+query);
         $.get(url, function(data) {
           callback(data);
         }, 
         'json');     
     },
     
     search : function (query) {
       var that = this;
        this.callQuery(query, function(data) {
           if( data.statuses !== undefined && data.statuses.length > 0) {
             that.update(data );
           }        
        });
       
     },
     
     refresh : function (query) {
       var lastId = this.models[0].attributes.id_str;
       // encode the query to handle any special characters properly
       var that = this;
       this.callQuery(query + "&since_id="+lastId, function(data) { that.update(data); }, 'json');    
     }
    
  });
  
  return FeedItemsCollection;
});