using System;
using System.Linq;

namespace InterviewTestPagination.Models.Todo {
    public class TodoService : IModelService<Todo> {
        public IModelRepository<Todo> Repository { get; set; } = new TodoRepository();

        /// <summary>Sort before paging. Page size zero means all items.</summary>
        public PagedResult<Todo> List(int page = 1, int pageSize = 20,
            string sortBy = "createdDate", string sortDirection = "desc") {
            if (page < 1) throw new ArgumentException("Page must be at least 1.");
            if (pageSize != 0 && pageSize != 10 && pageSize != 20 && pageSize != 30)
                throw new ArgumentException("Page size must be 10, 20, 30 or 0 (all).");
            if (sortDirection != "asc" && sortDirection != "desc")
                throw new ArgumentException("Sort direction must be asc or desc.");
            Func<Todo, object> key;
            switch (sortBy) {
                case "id": key = todo => todo.Id; break;
                case "task": key = todo => todo.Task; break;
                case "createdDate": key = todo => todo.CreatedDate; break;
                default: throw new ArgumentException("Unknown sort property.");
            }
            var items = Repository.All().ToList();
            var sorted = (sortDirection == "asc" ? items.OrderBy(key) : items.OrderByDescending(key))
                .ThenBy(todo => todo.Id);
            var totalPages = pageSize == 0 ? 1 : Math.Max(1, (int)Math.Ceiling(items.Count / (double)pageSize));
            page = Math.Min(page, totalPages);
            return new PagedResult<Todo> {
                Items = (pageSize == 0 ? sorted.AsEnumerable() : sorted.Skip((page - 1) * pageSize).Take(pageSize)).ToList(),
                Page = page, PageSize = pageSize, TotalItems = items.Count, TotalPages = totalPages
            };
        }
    }
}
