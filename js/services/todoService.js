app.factory('todoService', ['$resource', '$firebaseArray', function($resource, $firebaseArray) {
	return {
		get: function() {
			var ref = new Firebase("http://firebaseio.com");
			return $firebaseArray(ref);
		}
	}
}]);