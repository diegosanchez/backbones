// Applications
MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
	mainRegion:"#content"
});

MyApp.addInitializer( function (options) {
	var view = new AngryCatView({
		collection: options.cats
	});

	MyApp.mainRegion.show( view );
});


// Models
AngryCat = Backbone.Model.extend({});
AngryCats = Backbone.Collection.extend({
	model: AngryCat
});


// Views
AngryCatView = Backbone.Marionette.ItemView.extend({
	template: '#angry_cat-template',
	tagName: 'tr',
	className: 'angry_cat'
});

AngryCatViews = Backbone.Marionette.CompositeView.extend({
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

