using System.Collections.Generic;

namespace InterviewTestPagination.Models {
    /// <summary>Page metadata. An empty list has one empty page.</summary>
    public class PagedResult<T> {
        public IEnumerable<T> Items { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
