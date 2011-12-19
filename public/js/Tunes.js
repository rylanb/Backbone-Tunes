(function($) {

  //Models
  window.Album = Backbone.Model.extend({
    isFirstTrack: function(index){
      return index === 0;
    },
    isLastTrack: function(index){
      return index >= this.get('tracks').length - 1;
    },
    trackUrlAtIndex: function(index) {
      var tracks = this.get('tracks');
      if( tracks.length >= index) {
        return tracks[index].url;
      }
      return null;
    }
  });

  //Collections
  window.Albums = Backbone.Collection.extend({
    model: Album,
    url: "/albums"
  });

  window.library = new Albums();

  //Views
  window.AlbumView = Backbone.View.extend({
    tagName: 'li',
    className: 'album',
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.template = _.template( $('#album-template').html() );
    },

    render: function() {
      var renderedContent = this.template(this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    }
  });

  window.LibraryAlbumView = AlbumView.extend({

  });

  window.LibraryView = Backbone.View.extend({
    tagName: 'section',
    className: 'library',

    initialize: function(){
      _.bindAll(this, 'render');
      this.template = _.template( $('#library-template').html() );
      this.bind('reset', this.render);
    },

    render: function() {
      var $albums;

      $(this.el).html(this.template({}));
      $albums = this.$(".albums");
      // console.log("collection", this.collection);
      // console.log("albums", $albums);
      this.collection.each( function(album){
        var view = new LibraryAlbumView({
          model: album,
          collection: collection
        });
        $albums.append(view.render().el);
      });
      return this;
    }
  });

  //Router
  window.BackboneTunes = Backbone.Router.extend({
    routes: {
      '' : 'home'
    },
    initialize: function() {
      this.libraryView = new LibraryView({collection: window.library})
    },
    home: function() {
      var $container = $('#container');
      $container.empty();
      $container.append(this.libraryView.render().el);
    }
  });

  $(function(){
    window.App =  new BackboneTunes();
    Backbone.history.start();
  });

})(jQuery);
