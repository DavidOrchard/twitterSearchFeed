/*Copyright (C) 2013 David Orchard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** @module App
 *
 * All the requires are here for easy cut 'n paste in other files 
 */
define(function(require) {
  var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone'),
  FeedItemModel = require('models/FeedItem'),
  FeedModel = require('models/Feed'),
  FeedItemsCollection = require('collections/FeedItemsCollection'),
  MobileRouter = require('routers/mobileRouter'),
  FeedView = require('views/Feed'),
  FeedItemView = require('views/FeedItem'),
  FeedItemsCollectionView = require('views/FeedItemsCollection');

  /** Load the stored search query
  *  Initialize the FeedView, setting the model to any stored query results if there is a search query
  *
  */          
  var initialize = function(){
    var feedModel = new FeedModel();
    feedModel.read();
    feedView = new FeedView({model:feedModel});
  };

  return {
    initialize: initialize
  };
});
