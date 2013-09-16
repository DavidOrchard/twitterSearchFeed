/*Copyright (C) 2013 David Orchard

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** main entry point into the application */

require.config({
  shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		backboneLocalStorage: {
			deps: ['backbone'],
			exports: 'Store'
		}
	},
	paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/underscore', 
    backbone: 'lib/backbone',
		backboneLocalStorage: 'lib/backbone.localStorage',
    text: 'text'
  }
});

define([
	'jquery',
	'underscore',
	'backbone',
	'models/Feed',
	'routers/mobileRouter',
	'views/Feed',
], function( $, _, Backbone, FeedModel, MobileRouter, FeedView) {

  new MobileRouter();
  // Tell Backbone to start watching for hashchange events
  Backbone.history.start();

  var feedModel = new FeedModel();
  feedModel.fetch();
  // hackery as backbone.localStorage seems to be designed for collections so it stores things as an array
  if( feedModel.attributes && feedModel.attributes[0] && feedModel.attributes[0].query) {
    feedModel.set('query', feedModel.attributes[0].query);
  }
  new FeedView({model:feedModel});  
});