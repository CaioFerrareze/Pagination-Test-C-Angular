using System;
using System.Collections.Generic;
using System.Linq;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace InterviewTestPagination.Tests.Models {
    [TestClass]
    public class TodoServiceTest {
        [TestMethod]
        public void DefaultPageHasTwentyNewestItemsAndTotals() {
            var result = new TodoService().List();
            Assert.AreEqual(20, result.Items.Count());
            Assert.AreEqual(55L, result.Items.First().Id);
            Assert.AreEqual(36L, result.Items.Last().Id);
            Assert.AreEqual(55, result.TotalItems);
            Assert.AreEqual(3, result.TotalPages);
        }

        [TestMethod]
        public void SortingPrecedesPagingAndLastPageIsClamped() {
            var service = new TodoService();
            var second = service.List(2, 10, "id", "asc");
            Assert.AreEqual(11L, second.Items.First().Id);
            Assert.AreEqual(20L, second.Items.Last().Id);
            var last = service.List(999, 20, "id", "asc");
            Assert.AreEqual(3, last.Page);
            Assert.AreEqual(15, last.Items.Count());
            Assert.AreEqual(41L, last.Items.First().Id);
        }

        [TestMethod]
        public void AllItemsUsesOnePage() {
            var result = new TodoService().List(9, 0, "task", "asc");
            Assert.AreEqual(55, result.Items.Count());
            Assert.AreEqual(1, result.Page);
            Assert.AreEqual(1, result.TotalPages);
            CollectionAssert.AreEqual(result.Items.Select(t => t.Task).OrderBy(t => t).ToArray(),
                result.Items.Select(t => t.Task).ToArray());
        }

        [TestMethod]
        public void EmptyRepositoryReturnsOneEmptyPage() {
            var result = new TodoService { Repository = new EmptyRepository() }.List();
            Assert.AreEqual(0, result.TotalItems);
            Assert.AreEqual(1, result.TotalPages);
            Assert.AreEqual(0, result.Items.Count());
        }

        [TestMethod]
        public void RejectsInvalidQueryParameters() {
            var service = new TodoService();
            Reject(() => service.List(0));
            Reject(() => service.List(1, -1));
            Reject(() => service.List(1, 15));
            Reject(() => service.List(1, 20, "unknown"));
            Reject(() => service.List(1, 20, "id", "invalid"));
        }

        private static void Reject(Action action) {
            try { action(); } catch (ArgumentException) { return; }
            Assert.Fail("Expected invalid query to be rejected.");
        }

        private class EmptyRepository : IModelRepository<Todo> {
            public IEnumerable<Todo> All() { return Enumerable.Empty<Todo>(); }
        }
    }
}
