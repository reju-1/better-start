import Link from "next/link";

const PostsTable = ({ posts }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-2 py-2 sm:px-6 sm:py-3 text-start text-base sm:text-sm"
            >
              <span className="font-semibold text-gray-800">Title</span>
            </th>
            <th
              scope="col"
              className="px-2 py-2 sm:px-6 sm:py-3 text-start w-[120px] sm:w-[175px] text-base sm:text-sm"
            >
              <span className="font-semibold text-gray-800">
                Employment Type
              </span>
            </th>
            <th
              scope="col"
              className="px-2 py-2 sm:px-6 sm:py-3 text-start text-base sm:text-sm"
            >
              <span className="font-semibold text-gray-800">
                Job Description
              </span>
            </th>
            <th
              scope="col"
              className="px-2 py-2 sm:px-6 sm:py-3 text-start text-base sm:text-sm"
            >
              <span className="font-semibold text-gray-800">Created At</span>
            </th>
            <th
              scope="col"
              className="px-2 py-2 sm:px-6 sm:py-3 text-start text-base sm:text-sm"
            >
              <span className="font-semibold text-gray-800">End Date</span>
            </th>
            <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3 text-end"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.id} className="bg-white hover:bg-gray-50">
                <td className="whitespace-normal break-words px-2 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm">
                  <Link
                    href={"/dashboard/employee/recruitment_post_applicants"}
                  >
                    <span className="block font-semibold text-gray-800">
                      {post.title}
                    </span>
                  </Link>
                </td>
                <td className="whitespace-normal break-words px-2 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm">
                  <span className="block text-gray-600">
                    {post.employmentType}
                  </span>
                </td>
                <td className="whitespace-normal break-words px-2 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm">
                  <span className="block text-gray-600 line-clamp-2">
                    {post.description}
                  </span>
                </td>
                <td className="whitespace-normal break-words px-2 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm">
                  <span className="block text-gray-600">{post.createdAt}</span>
                </td>
                <td className="whitespace-normal break-words px-2 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm">
                  <span className="block text-gray-600">{post.endDate}</span>
                </td>
                <td className="whitespace-normal break-words px-2 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm">
                  <Link
                    href={`/dashboard/employee/recruitment/edit/${post.id}`}
                    className="inline-flex justify-center items-center gap-2 rounded-lg border border-gray-200 font-medium bg-white text-gray-700 shadow-2xs align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary transition-all px-2 py-1"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No recruitment posts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PostsTable;
