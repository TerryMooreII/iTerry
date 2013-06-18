'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .
  filter('grouped', function() {
    return function(input, itemsPerRow) {
      if (itemsPerRow === undefined) {
        itemsPerRow = 1;
      }
    var input2 = []
        angular.copy(input, input2)  
      var out = [];
      for (var i = 0; i < input.length; i++) {
        var rowElementIndex = i % itemsPerRow;
        var rowIndex = (i - rowElementIndex) / itemsPerRow;
        var row;
        if (rowElementIndex === 0) {
          row = [];
          out[rowIndex] = row;
        } else {
          row = out[rowIndex];
        }
        
        row[rowElementIndex] = input[i];
      }
        
      return out;
    };
  })
  .filter('group', function(){
   return function(items, groupSize) {
      var groups = [],
         inner;
      for(var i = 0; i < items.length; i++) {
         if(i % groupSize === 0) {
            inner = [];
            groups.push(inner);
         }
         inner.push(items[i]);
      }
      return groups;
   };
});;


