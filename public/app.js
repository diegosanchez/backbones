// Applications
MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
	mainRegion:"#content"
});

MyApp.addInitializer(function(options){
  var angryCatsView = new AngryCatsView({
    collection: options.cats
  });
  MyApp.mainRegion.show(angryCatsView);
});


// Models
AngryCat = Backbone.Model.extend({
	rankUp: function() {
	  this.set({rank: this.get('rank') - 1});
	},
	
	rankDown: function() {
	  this.set({rank: this.get('rank') + 1});
	}	
});

AngryCats = Backbone.Collection.extend({
	model: AngryCat,
	comparator: function (cat) {
		return cat.get('rank');
	},
	initialize: function (cats) {
		var rank = 1;
		_.each( cats, function (cat) {
			cat.set('rank', rank);
			++rank;
		});

		var self = this;

		MyApp.on('rank:up', function (cat) {

			console.clear();
			console.log('rank up triggered');
			console.log('arguments:', arguments[0].attributes);

			if (cat.get('rank') === 1) {
			  // can't increase rank of top-ranked cat
			  return true;
			}
			self.rankUp(cat);
			self.sort();
			self.trigger('reset');

		});

		MyApp.on('rank:down', function (cat) {
			console.clear();
			console.log('rank down triggered');
			console.log('arguments:', arguments[0].attributes);

			if (cat.get('rank') === self.size()) {
		      // can't decrease rank of lowest ranked cat
		      return true;
		    }
		    self.rankDown(cat);
		    self.sort();
		    self.trigger('reset');
		});
	},
	rankUp: function(cat) {
		// find the cat we're going to swap ranks with
		var rankToSwap = cat.get('rank') - 1;
		var otherCat = this.at(rankToSwap - 1);

		// swap ranks
		cat.rankUp();
		otherCat.rankDown();
	},
	 
	rankDown: function(cat) {
		// find the cat we're going to swap ranks with
		var rankToSwap = cat.get('rank') + 1;
		var otherCat = this.at(rankToSwap - 1);

		console.log(cat.attributes);
		console.log(otherCat.attributes);
		// swap ranks
		cat.rankDown();
		otherCat.rankUp();
	}
});


// Views
AngryCatView = Backbone.Marionette.ItemView.extend({
	template: '#angry_cat-template',
	tagName: 'tr',
	className: 'angry_cat',
	events: {
		'click .rank_up img': 'rankUp',
		'click .rank_down img': 'rankDown'
	},

	rankUp: function () {

		MyApp.trigger('rank:up', this.model);
	},

	rankDown: function () {
		console.clear();
		console.log('rank down triggered');
		console.log('arguments:', arguments);
		MyApp.trigger('rank:down', this.model);
	}
});

AngryCatsView = Backbone.Marionette.CompositeView.extend({
	tagName: 'table',
	id: 'angry_cats',
	className: 'table-striped table-bordered',
	template: '#angry_cats-template',
	itemView: AngryCatView,

	appendHtml: function (collectionView, itemView) {
		collectionView.$('tbody').append(itemView.el);
	}
});


// Utilities
function show(message) {
	return function () {
		console.log('show:', message, ' arguments:', arguments);
	};
}

