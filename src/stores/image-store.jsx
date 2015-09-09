var Api = require('../utils/api');
var Reflux = require('reflux');
var Actions = require('../actions');
var _ = require('lodash');

module.exports = Reflux.createStore({
  listenables: [Actions],

  getImages: function(topicId) {
    Api.get('topics/' + topicId)
      .then(function(data) {
        this.images = _.reject(data.data, function(image) {
          return image.is_album;
        }) 
        this.triggerChange();     
      }.bind(this));
  },

  getImage: function(imageId) {
    Api.get('image/' + imageId)
      .then(function(json) {
        if(this.images) {
          this.images.push(json.data)
        } else { 
          this.images = [json.data];
        }
        this.triggerChange();
      }.bind(this));
  },

  find: function(id){
    var image = _.findWhere(this.images, {id: id})
    if (image){
      return image
    } else {
      this.getImage(id);
      return null
    }
  },

  triggerChange: function() {
    this.trigger('change', this.images);
  }
})