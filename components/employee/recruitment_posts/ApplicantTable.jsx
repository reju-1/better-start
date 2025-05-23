import {
  Search,
  ArrowLeft,
  ArrowRight,
  Download,
  MoreHorizontal,
  FileSpreadsheet,
  FileText,
  FilePdf,
} from "lucide-react";

const ApplicantTable = ({
  search,
  setSearch,
  currentItems,
  renderStars,
  handleStatusChange,
  itemsPerPage,
  handleItemsPerPageChange,
  totalItems,
  goToPrevPage,
  goToNextPage,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-8 mx-auto">
      {/* Card */}
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                {/* Search Input */}
                <div className="sm:col-span-1">
                  <label htmlFor="applicant-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="applicant-search"
                      name="applicant-search"
                      className="py-2 px-3 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-primary"
                      placeholder="Search applicants..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                      <Search className="shrink-0 size-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 md:grow">
                  <div className="flex justify-end gap-x-2">
                    {/* Export Button */}
                    <div className="hs-dropdown relative inline-block">
                      <button
                        id="export-dropdown"
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <Download className="shrink-0 size-3" />
                        Export
                      </button>
                    </div>

                    {/* Filter Button */}
                    <div className="hs-dropdown relative inline-block">
                      <button
                        id="filter-dropdown"
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <span className="inline-flex items-center">
                          <svg
                            className="shrink-0 size-3.5 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M7 12h10" />
                            <path d="M10 18h4" />
                          </svg>
                          Filter
                        </span>
                        <span className="ps-2 text-xs font-semibold text-blue-600 border-s border-gray-200">
                          1
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Header */}

              {/* Table */}
              <table className="min-w-full table-fixed w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start w-48">
                      <span className="text-xs font-semibold uppercase text-gray-800">
                        Candidate Name
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start w-36">
                      <span className="text-xs font-semibold uppercase text-gray-800">
                        Phone
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start w-[200px]">
                      <span className="text-xs font-semibold uppercase text-gray-800">
                        Email
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start w-32">
                      <span className="text-xs font-semibold uppercase text-gray-800">
                        Rating
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-800">
                        Feedback
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start w-[200px]">
                      <span className="text-xs font-semibold uppercase text-gray-800">
                        Status
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-end w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="size-px whitespace-nowrap">
                        <div className="ps-6 py-2">
                          <span className="text-sm text-gray-600">
                            {applicant.name}
                          </span>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-2">
                          <span className="text-sm text-gray-600">
                            {applicant.phone}
                          </span>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-2">
                          <span className="text-sm text-gray-600">
                            {applicant.email}
                          </span>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-2 flex gap-x-1">
                          {renderStars(applicant.rating)}
                        </div>
                      </td>
                      <td className="size-px whitespace-normal max-w-xs">
                        <div className="px-6 py-2">
                          <span className="text-sm text-gray-600 break-words max-w-xs block">
                            {applicant.feedback}
                          </span>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-2">
                          {/* Status Dropdown */}
                          <div className="hs-dropdown relative inline-block">
                            <button
                              type="button"
                              id={`status-dropdown-${applicant.id}`}
                              data-hs-dropdown-toggle={`#status-dropdown-menu-${applicant.id}`}
                              className="py-1.5 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  applicant.status === "accepted"
                                    ? "bg-green-500"
                                    : applicant.status === "pending"
                                    ? "bg-yellow-400"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              {applicant.status === "accepted"
                                ? "Accepted"
                                : applicant.status === "pending"
                                ? "Pending"
                                : "Rejected"}
                              <svg
                                className="size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="m6 10 2 2 2-2"
                                />
                              </svg>
                            </button>
                            <div
                              id={`status-dropdown-menu-${applicant.id}`}
                              className="hs-dropdown-menu transition-[opacity,margin] duration-300 hidden min-w-32 z-10 bg-white shadow-md rounded-lg p-2 mt-2"
                            >
                              <button
                                className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-xs text-gray-800 hover:bg-gray-100 w-full"
                                onClick={() =>
                                  handleStatusChange(applicant.id, "accepted")
                                }
                              >
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                Accepted
                              </button>
                              <button
                                className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-xs text-gray-800 hover:bg-gray-100 w-full"
                                onClick={() =>
                                  handleStatusChange(applicant.id, "pending")
                                }
                              >
                                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
                                Pending
                              </button>
                              <button
                                className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-xs text-gray-800 hover:bg-gray-100 w-full"
                                onClick={() =>
                                  handleStatusChange(applicant.id, "rejected")
                                }
                              >
                                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                                Rejected
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <div className="px-6 py-1.5 flex justify-end">
                          <button className="py-1.5 px-2 inline-flex justify-center items-center text-sm font-semibold rounded-md bg-white text-gray-800 border border-gray-200 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            <Download className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {currentItems.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No applicants found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* End Table */}

              {/* Footer */}
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                <div className="inline-flex items-center gap-x-2">
                  <p className="text-sm text-gray-600">Showing:</p>
                  <div className="max-w-sm space-y-3">
                    <select
                      className="py-2 px-3 pe-9 block w-full border-gray-500 rounded-lg text-sm focus:border-primary focus:ring-primary"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={9}>9</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600">of {totalItems}</p>
                </div>

                <div>
                  <div className="inline-flex gap-x-2">
                    <button
                      type="button"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <ArrowLeft className="shrink-0 size-4" />
                      Prev
                    </button>

                    <button
                      type="button"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Next
                      <ArrowRight className="shrink-0 size-4" />
                    </button>
                  </div>
                </div>
              </div>
              {/* End Footer */}
            </div>
          </div>
        </div>
      </div>
      {/* End Card */}
    </div>
  );
};

export default ApplicantTable;
