/*Copyright (C) 2013 David Orchard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** @module FeedItemsCollection */
define([
  'underscore',
  'backbone',
  'backboneLocalStorage',
  'models/FeedItem',
  'common'
  ], function(_, Backbone, Store, FeedItemModel, common){
    'use strict';
    var FeedItemsCollection = Backbone.Collection.extend({
      model: FeedItemModel,
      localStorage: new Store("feeditemscollection"),

      initialize: function(){
        this.bind('sync', function(model, collection, options) {
          this.setAutoRefresh();
        });
        this.bind('add', function(model, collection, options) {
          if( model.isNew()) {
            model.save();
          }
        });
        this.bind('remove', function(model, collection, options) {
          model.destroy();
        });
      },

      comparator : "id_str",

      /** clear the localStorage and reset the model */
      reset: function() {
        try {
          Backbone.Collection.prototype.reset.call(this);
          this.clearAutoRefresh();
        } catch (e) {        
        }
      },

      /** filter the feed items
      * Filters the json data to store the flattened:
      * id_str
      * user.profile_image_url
      * user.screen_name
      * text
      * created_at
      *
      * Note, there is a conflict between twitter ids and backbone ids.  If a model has an id, then isNew() reports false so it wouldn't be saved.  
      * Naming is hard....
      */
      filter: function(feedItem) {
        return {id_str        : feedItem.id_str,
          profile_image_url   : feedItem.user.profile_image_url, 
          screen_name         : feedItem.user.screen_name, 
          text                : feedItem.text,
          created_at          : feedItem.created_at
        };
      },

      /** set the auto refresh, usually only on successful query */
      setAutoRefresh: function() {
        var that = this;
        if(! this.intervalId) {
          this.intervalId = window.setInterval(function () {
            that.refresh();}
            , common.autoRefreshInterval);
          }
      },

      /** clear the auto refresh, probably only happen on reset */
      clearAutoRefresh: function() {
        window.clearInterval(this.intervalId);
      },

      /** format the URL for search requests
       * format per twitter-proxy.php?url='+encodeURIComponent('statuses/user_timeline.json?screen_name=MikeRogers0&count=2')
       * twitter search = https://api.twitter.com/1.1/search/tweets.json
       * we encode the query to handle any special characters properly
       */
      url: function() {
        return "twitter-proxy.php?url="+encodeURIComponent("search/tweets.json?q="+this.query + (this.models.length > 0 ? ("&since_id="+this.models[this.models.length - 1].attributes.id_str) : ""));
      },

      /** returns a filtered response with space for the incoming items.  Generates successfulSearch or unsuccessfulSearch depending upon response value
      *
      * @param {String} response server response
      */
      parse: function( response ) {
        if( response !== undefined && response.statuses !== undefined) {
          if( this.length == 0 ) {
            if( response.statuses.length > 0 ) {
              this.trigger('successfulSearch');
              this.setAutoRefresh();
            } else {
              this.trigger('unsuccessfulSearch');
            }
          }

          // Preserve the maxFeedItemsCollectionSize
          // In cases of small values, this ui may flash as items are removed from the bottom and then items added at the top
          // Alternatively, on the add event from the sync, remove items to preserve
          while(this.length + response.statuses.length > common.maxFeedItemsCollectionSize ) {
            this.pop();
          }
          var that = this;
          var newArray = new Array();
          response.statuses.forEach(function(element, index ) { newArray.unshift(that.filter(element));});
          return newArray;
        } 
        return [];
      },

      /** search using query passed in. Store the query
       *
       * @param {String} query
       */
      search : function (query) {
        this.query = query;     
        this.fetchRemote();
      },
      
      /**  Fetch the model from the server. If the server's representation of the
       * model differs from its current attributes, they will be overridden,
       * triggering a `"change"` event.
       *
       * @param {Object} options
       * 
       * this is a copy of the Backbone Sync method but it uses ajaxSync instead of sync as sync is taken with localstorage
       */
      fetchRemote: function(options) {
        options = options ? _.clone(options) : {};
        // Below is a hack to solve a problem that only happens in minification, where sort order is not preserved
        options.sort = true;
        if (options.parse === void 0) options.parse = true;
        var model = this;
        var success = options.success;
        options.success = function(resp) {
          // model.set does a model.parse
          if (!model.set(resp, options)) return false;
          if (success) success(model, resp, options);
          model.trigger('sync', model, resp, options);
        };
        //wrapError(this, options);
        return Backbone.ajaxSync('read', this, options);
      },

      /** refresh the list of feedItems from the server, not removing items that are local but not in server response */
      refresh : function () {
        this.fetchRemote({remove: false});
      }

    });

    return FeedItemsCollection;
  });