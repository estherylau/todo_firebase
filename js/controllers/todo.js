app.controller('TodoController', ['$scope', '$filter', 'todoService', function($scope, $filter, todoService) {
	//todoService.success(function(data) {
		//$scope.toDo = data;
		$scope.toDo = todoService.get();
		$scope.todayTD = [];
		// check length of todo list if (not including archive)
		$scope.toDo.$loaded().then(function(x) {
			//console.log($scope.toDo.length);
		$scope.calculateTodoLength();
		$scope.calculateCompleted();
			
		})
		.catch(function(err) {
			console.log("Error");
		});

		
		$scope.length = $scope.toDo.length;
		//console.log("length: " + $scope.todoLength);
		$scope.incrementId = $scope.toDo.length;
		
		$scope.recalCompletedCount = function() {
			$scope.count = 0;
		}

		$scope.recalCompletedCount();

		$scope.updateCompletedCount = function(e, type, todo) {
			console.log('you updated' + $scope.count);
			if(e.target) {
				e.target.checked? $scope.count++ : $scope.count--;
			}
			if(type == 'delete' && $scope.count != 0) {$scope.count--;}
			$scope.toDo.$save(todo);
		}
	//});

	$scope.calculateTodoLength = function() {
		$scope.length = 0;
		$scope.$watch($scope.toDo.length, function(newVal, oldVal) {
			angular.forEach($scope.toDo, function(todo, index) {
				if(!todo.archive) {
					$scope.length++;
				}
			});
		});
	}

	$scope.calculateCompleted = function() {
		$scope.$watch($scope.toDo.count, function(newVal, oldVal) {
			angular.forEach($scope.toDo, function(todo, index) {
				if(!todo.archive && todo.done) {
					$scope.count++;
				}
			});
		});
	}

	// get today's date
	$scope.date = function() {
		var date = new Date();
		var dd = $filter('date')(date, 'yyyy/MM/dd');
		return dd;
	}
	$scope.formatDate = function(date) {
		var dateOut = new Date(date);
		return dateOut;
	}

	$scope.addTodo = function() {
		$scope.toDo.$add({'id': $scope.incrementId+1, 'title':$scope.newTodo, 'due': $scope.date(), 'done': false, "archive": false, "editingMode": false});
		$scope.newTodo = '';
		$scope.length++;
		$scope.incrementId++;
	}
	$scope.deleteItem = function(index, todo, id) {
		todo.archive = true;
		$scope.toDo.$save(todo);
		$scope.length--;
		$scope.updateCompletedCount('', 'delete', '');
	}
	$scope.editTodo = function(todo) {
		if(todo.editingMode == false) {
			todo.editingMode = true;
		}
		else {
			todo.editingMode = false;
		}
	}
	$scope.saveTodo = function(todo) {
		$scope.toDo.$save(todo);
	}
	$scope.removePerm = function(index, archive) {
		$scope.toDo.$remove(archive);
	}
	$scope.editDate = function(todo) {
		var getNewDueDate = $("#date_due_"+todo.id).val();
		//console.log(getNewDueDate);
		var formatDate = $scope.formatDate(getNewDueDate);
		formatDate = $filter('date')(formatDate, 'yyyy/MM/dd');
		todo.due = formatDate;
	}
	$scope.clearFinishedTodos = function() {		
		
		angular.forEach($scope.toDo, function(todo, index) {
			if(todo.done) {
				todo.archive = true;
			}
			$scope.toDo.$save(todo);
		}); 
		
		$scope.calculateTodoLength();
		$scope.recalCompletedCount();	
	}

	// detect keyboard press
	$scope.keyboardPressed = function(e){
		var unicode = e.keyCode;
		if(unicode == 13) { // 'Enter' key pressed
			$scope.addTodo();
		}
	}
	$scope.archiveRestore = function(archive, id) {
		archive.archive = false;
		$scope.length++;
		archive.done = false;
		$scope.toDo.$save(archive);
	}
	$scope.archiveDeleteAll = function() {
		angular.forEach($scope.toDo, function(todo, index) {
			if(todo.archive) {
				$scope.toDo.$remove(todo);
			}
		});
	}
}]);
