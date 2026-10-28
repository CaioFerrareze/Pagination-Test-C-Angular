(function (angular) {
    "use strict";
    angular.module("todoApp")
        .directive("todoPaginatedList", function () {
            return {
                restrict: "E", templateUrl: "app/templates/todo.list.paginated.html?v=3", scope: {},
                controller: ["$scope", "$http", function ($scope, $http) {
                    var requestId = 0;
                    $scope.todos = [];
                    $scope.page = 1;
                    $scope.pageSize = 20;
                    $scope.totalPages = 1;
                    $scope.totalItems = 0;
                    $scope.sortBy = "createdDate";
                    $scope.sortDirection = "desc";
                    $scope.sortSelected = false;
                    $scope.load = function (page, pageSize) {
                        if (angular.isDefined(page)) $scope.page = page;
                        if (angular.isDefined(pageSize)) $scope.pageSize = pageSize;
                        var currentRequest = ++requestId;
                        $scope.loading = true;
                        $scope.error = null;
                        return $http.get("api/Todo/Todos", { params: {
                            page: $scope.page, pageSize: $scope.pageSize,
                            sortBy: $scope.sortBy, sortDirection: $scope.sortDirection
                        }}).then(function (response) {
                            // Ignore a response if a newer query has already been issued.
                            if (currentRequest !== requestId) return;
                            $scope.todos = response.data.items;
                            $scope.page = response.data.page;
                            $scope.totalPages = response.data.totalPages;
                            $scope.totalItems = response.data.totalItems;
                        }, function () {
                            if (currentRequest !== requestId) return;
                            $scope.todos = [];
                            $scope.error = "Could not load tasks. Please try again.";
                        }).finally(function () {
                            if (currentRequest === requestId) $scope.loading = false;
                        });
                    };
                    $scope.sort = function (property) {
                        $scope.sortDirection = $scope.sortSelected && $scope.sortBy === property &&
                            $scope.sortDirection === "asc" ? "desc" : "asc";
                        $scope.sortBy = property;
                        $scope.sortSelected = true;
                        $scope.page = 1;
                        $scope.load();
                    };
                    $scope.indicator = function (property) {
                        return $scope.sortSelected && $scope.sortBy === property ?
                            ($scope.sortDirection === "asc" ? " (ascending)" : " (descending)") : "";
                    };
                    $scope.load();
                }]
            };
        })
        .directive("pagination", function () {
            return {
                restrict: "E", templateUrl: "app/templates/pagination.html?v=3",
                scope: { page: "=", pageSize: "=", totalPages: "=", totalItems: "=", busy: "=", onChange: "&" },
                controller: ["$scope", function ($scope) {
                    $scope.sizes = [10, 20, 30, 0];
                    $scope.go = function (page) {
                        if ($scope.busy) return;
                        if (typeof page !== "number" || !isFinite(page)) {
                            $scope.inputPage = $scope.page;
                            return;
                        }
                        page = Math.max(1, Math.min($scope.totalPages, Math.floor(page)));
                        $scope.inputPage = page;
                        if (page === $scope.page) return;
                        $scope.page = page;
                        $scope.onChange({ page: $scope.page, pageSize: $scope.pageSize });
                    };
                    $scope.resize = function () {
                        $scope.page = 1;
                        $scope.onChange({ page: $scope.page, pageSize: $scope.pageSize });
                    };
                    $scope.$watch("page", function (page) { $scope.inputPage = page; });
                }]
            };
        });
})(angular);


