/* Run with: node InterviewTestPagination.Tests/pagination.test.js */
var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var directives = {};
var moduleStub = { directive: function (name, factory) {
    directives[name] = factory(); return moduleStub;
}};
vm.runInNewContext(fs.readFileSync('InterviewTestPagination/app/main.js', 'utf8'), {
    angular: { isDefined: function (value) { return typeof value !== "undefined"; }, module: function () { return moduleStub; } }, isFinite: isFinite
});
var callbacks = 0;
var pager = { page: 2, totalPages: 6, busy: false,
    onChange: function () { callbacks++; }, $watch: function () {} };
directives.pagination.controller.slice(-1)[0](pager);
pager.go(999);
assert.strictEqual(pager.page, 6);
pager.go(-5);
assert.strictEqual(pager.page, 1);
pager.go(undefined);
assert.strictEqual(pager.inputPage, 1);
pager.busy = true;
pager.go(3);
assert.strictEqual(pager.page, 1);
pager.busy = false;
pager.page = 4;
pager.resize();
assert.strictEqual(pager.page, 1);
assert.strictEqual(callbacks, 3);
var requests = [];
var list = {};
var http = { get: function (url, query) {
    requests.push(query.params);
    return { then: function () { return { finally: function () {} }; } };
}};
directives.todoPaginatedList.controller.slice(-1)[0](list, http);
assert.strictEqual(requests[0].pageSize, 20);
assert.strictEqual(requests[0].sortDirection, 'desc');
list.pageSize = 30;
list.page = 2;
list.sort('id');
assert.strictEqual(list.page, 1);
assert.strictEqual(list.pageSize, 30);
assert.strictEqual(list.sortDirection, 'asc');
list.sort('id');
assert.strictEqual(list.sortDirection, 'desc');
list.sort('task');
assert.strictEqual(list.sortDirection, 'asc');
assert.strictEqual(list.indicator('id'), '');
console.log('Pagination navigation, loading guard, page-size reset and sorting checks passed.');

// The parent still has the old state when the isolated directive emits a change.
var emitted;
pager.onChange = function (values) { emitted = values; list.load(values.page, values.pageSize); };
pager.page = 1;
pager.pageSize = 30;
list.page = 1;
list.pageSize = 10;
pager.resize();
assert.strictEqual(requests[requests.length - 1].pageSize, 30);
assert.strictEqual(emitted.pageSize, 30);
pager.totalPages = 3;
pager.go(2);
assert.strictEqual(requests[requests.length - 1].page, 2);
pager.go(3);
assert.strictEqual(requests[requests.length - 1].page, 3);
console.log('Regression passed: current page size and page reach the API immediately.');
