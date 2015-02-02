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
	defaults: {
		rank: 0
	}
});
AngryCats = Backbone.Collection.extend({
	model: AngryCat,
	initialize: function (cats) {
		var rank = 1;
		_.each( cats, function (cat) {
			cat.set('rank', rank);
			++rank;
		});
	}
});


// Views
AngryCatView = Backbone.Marionette.ItemView.extend({
	template: '#angry_cat-template',
	tagName: 'tr',
	className: 'angry_cat'
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

