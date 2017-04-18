(function () {
  'use strict';

  angular.module('BlurAdmin')
  .directive('csvReader', CSVReader);

  function CSVReader(){
    return {
      scope: {
        csvReader:"="
      },
      link: function(scope, element) {
        $(element).on('change', function(changeEvent) {
          var files = changeEvent.target.files;
          if (files.length) {
            var r = new FileReader();
            r.onload = function(e) {
                var contents = e.target.result;
                scope.$apply(function () {
                  // split content based on new line
                  var allText = contents;
              		var allTextLines = allText.split(/\r\n|\n/);
              		var headers = allTextLines[0].split(',');
              		var lines = [];

              		for ( var i = 0; i < allTextLines.length; i++) {
              			// split content based on comma
              			var data = allTextLines[i].split(',');
              			if (data.length == headers.length) {
              				var tarr = [];
              				for ( var j = 0; j < headers.length; j++) {
              					tarr.push(data[j]);
              				}
              				lines.push(tarr);
              			}
              		}

                  scope.csvReader = lines;
                });
            };

            r.readAsText(files[0]);
          }
        });
      }
    };
  };

})();
