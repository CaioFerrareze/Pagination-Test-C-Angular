namespace InterviewTestPagination.Models {
    public interface IModelService<T> {
        IModelRepository<T> Repository { get; set; }
        PagedResult<T> List(int page = 1, int pageSize = 20,
            string sortBy = "createdDate", string sortDirection = "desc");
    }
}
