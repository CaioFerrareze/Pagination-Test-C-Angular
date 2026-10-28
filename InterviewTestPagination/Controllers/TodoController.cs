using System;
using System.Web.Http;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;

namespace InterviewTestPagination.Controllers {
    public class TodoController : ApiController {
        private readonly IModelService<Todo> _todoService = new TodoService();

        [HttpGet]
        [Route("api/Todo/Todos")]
        public IHttpActionResult Todos(int page = 1, int pageSize = 20,
            string sortBy = "createdDate", string sortDirection = "desc") {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try {
                return Ok(_todoService.List(page, pageSize, sortBy, sortDirection));
            } catch (ArgumentException error) {
                return BadRequest(error.Message);
            }
        }
    }
}
