require.config( {
  baseUrl: "js",
  paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone'
  }
});

    // Can this be done in Common JS style?  I tried once and it seemed to break phantomjs
define(['jquery',
    "backbone"],
    function($, Backbone ) {    

var Foo = Backbone.Model.extend({});

var FooCollection = Backbone.Collection.extend({
    model: Foo
});

var FooView = Backbone.View.extend({
  events : {
      'click .searchsubmit'            : 'search',
    },
    
    render: function() {
      this.$el.html( '<span class="searchsubmit" type="button" title="Get Tweets" ></span>' );
    },
  
    initialize: function() {
        this.collection = this.collection || new FooCollection();
        this.collection.on('add', this.fooAdded, this);
        this.render();                
    },
        
    search: function(foo) {
        console.debug('called search');
    }, 
    
    fooAdded: function(foo) {
        console.debug('called fooAdded');
    }
});

function setupJasmine() {
   var jasmineEnv = jasmine.getEnv();
   var htmlReporter = new jasmine.HtmlReporter();
   jasmineEnv.addReporter(htmlReporter);
   jasmineEnv.specFilter = function(spec) {
      return htmlReporter.specFilter(spec);
   };
   return jasmineEnv;
}

describe('Foo View', function() {
    it('should call search when search is clicked', function() {
      var searchButton = ".searchsubmit";
      
//        spyOn(FooView.prototype, 'fooAdded').andCallThrough();
        spyOn(FooView.prototype, 'search');
        var view = new FooView({collection: new FooCollection()});
        expect(view).not.toEqual(null);
        view.$el.find(searchButton).click();
        expect(view.search).toHaveBeenCalled();
        
 //       view.collection.add({name: 'foo'});
//        expect(view.fooAdded).toHaveBeenCalled();
    });
});

var jasmineEnv = setupJasmine();
jasmineEnv.execute();
});
