import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { IssueItem } from "./IssueItem"
// import fetchWithError from "../helpers/fetchWithError"
import Loader from "../helpers/Loader"
import { Issue, Labels } from "../api/types"
import api from "../api/api"
import { fetchIssuesWithLabelsAndStaus, searchIssues } from "../api/issuesApi"
import { GoComment, GoIssueClosed, GoIssueOpened } from "react-icons/go"
import {
  defaultIssue,
  defaultLabels,
  defaultUsers,
} from "../helpers/defaultData"
import { Label } from "./Label"
import { relativeDate } from "../helpers/relativeDate"
import { Link } from "react-router-dom"

type IssueListProp = {
  labels: string[] //array of ids
  status: string
  pageNum?: number
  setPageNum: (pageNo: number) => void
}

export default function IssuesList({
  labels,
  status,
  pageNum,
  setPageNum,
}: IssueListProp) {
  const { assignee } = defaultIssue
  const { profilePictureUrl, name } = defaultUsers[0]
  // const queryClient = useQueryClient()
  const issuesQuery = useQuery(
    ["issues", { labels, status, pageNum }],
    async ({ signal }) => {
      const statusString = status ? `&status=${status}` : ""
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&")

      return fetchIssuesWithLabelsAndStaus(statusString, labelsString, {
        signal,
      })

      // const paginationString = pageNum ? `&page=${pageNum}` : ""

      // const results = await api.get<Issue[]>(
      //   `/api/issues?${labelsString}${statusString}`,
      //   {
      //     signal,
      //   }
      // )

      // results.forEach((issue) => {
      //   queryClient.setQueryData(["issues", issue.number.toString()], issue)
      // })

      // return results
    },
    {
      keepPreviousData: true,
    }
  )
  const [searchValue, setSearchValue] = useState("")

  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    ({ signal }) => searchIssues(searchValue, { signal }),
    {
      enabled: searchValue.length > 0,
    }
  )

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSearchValue(event.target.elements.search.value)
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(event) => {
            if (event.target.value.length === 0) {
              setSearchValue("")
            }
          }}
        />
      </form>
      <div className="issues-header">
        <h3>
          Issues {issuesQuery.fetchStatus === "fetching" ? <Loader /> : null}
        </h3>
      </div>
      <ul className="issues-list">
        <li
        // onMouseEnter={() => {
        //   queryClient.prefetchQuery(["issues", number.toString()], () =>
        //     fetchIssueDetail(number)
        //   )
        // queryClient.prefetchInfiniteQuery(
        //   ["issues", number.toString(), "comments"],
        //   () => fetchWithError(`/api/issues/${number}/comments?page=1`)
        // )
        // }}
        >
          <div>
            {status === "done" || status === "cancelled" ? (
              <GoIssueClosed style={{ color: "red" }} />
            ) : (
              <GoIssueOpened style={{ color: "green" }} />
            )}
          </div>
          <div className="issue-content">
            <span>
              <Link to={`/issue/1000`}>hello</Link>
              {defaultLabels.map((label) => (
                <Label label={label} />
              ))}
            </span>
            <small>#2000 opened {relativeDate(new Date())} `by Ukesh`</small>
          </div>
          {assignee ? (
            <img
              src={profilePictureUrl}
              className="assigned-to"
              alt={`Assigned to`}
            />
          ) : null}
          <span className="comment-count">
            {/* {commentCount > 0 ? ( */}
            <>
              <GoComment />
              {282}
            </>
            {/* ) : null} */}
          </span>
        </li>
      </ul>
    </div>
  )
}

// {issuesQuery.isLoading ? (
//   <p>Loading...</p>
// ) : issuesQuery.isError ? (
//   <p>There was problem fetching issues</p>
// ) : searchQuery.fetchStatus === "idle" &&
//   searchQuery.isLoading === true ? (
//   <>
//     <ul className="issues-list">
//       {issuesQuery.data.data.map((issue) => (
//         <IssueItem
//           key={issue.id}
//           comments={issue.comments}
//           id={issue.id}
//           title={issue.title}
//           number={issue.number}
//           assignee={issue.assignee}
//           commentCount={issue.comments.length}
//           createdBy={issue.createdBy}
//           createdDate={issue.createdDate}
//           labels={issue.labels}
//           status={issue.status}
//         />
//       ))}

//       <li
//       // onMouseEnter={() => {
//       //   queryClient.prefetchQuery(["issues", number.toString()], () =>
//       //     fetchIssueDetail(number)
//       //   )
//       // queryClient.prefetchInfiniteQuery(
//       //   ["issues", number.toString(), "comments"],
//       //   () => fetchWithError(`/api/issues/${number}/comments?page=1`)
//       // )
//       // }}
//       >
//         <div>
//           {status === "done" || status === "cancelled" ? (
//             <GoIssueClosed style={{ color: "red" }} />
//           ) : (
//             <GoIssueOpened style={{ color: "green" }} />
//           )}
//         </div>
//         <div className="issue-content">
//           <span>
//             <Link to={`/issue/1000`}>hello</Link>
//             {defaultLabels.map((label) => (
//               <Label label={label} />
//             ))}
//           </span>
//           <small>
//             #2000 opened {relativeDate(new Date())} `by Ukesh`
//           </small>
//         </div>
//         {assignee ? (
//           <img
//             src={profilePictureUrl}
//             className="assigned-to"
//             alt={`Assigned to`}
//           />
//         ) : null}
//         <span className="comment-count">
//           {/* {commentCount > 0 ? ( */}
//           <>
//             <GoComment />
//             {282}
//           </>
//           {/* ) : null} */}
//         </span>
//       </li>
//     </ul>
//     {/* <div className="pagination">
//       <button
//         onClick={() => {
//           if (pageNum - 1 > 0) {
//             setPageNum(pageNum - 1)
//           }
//         }}
//         disabled={pageNum === 1}
//       >
//         Previous
//       </button>
//       <p>
//         Page {pageNum} {issuesQuery.isFetching ? "..." : ""}
//       </p>
//       <button
//         disabled={
//           issuesQuery.data?.length === 0 || issuesQuery.isPreviousData
//         }
//         onClick={() => {
//           if (
//             issuesQuery.data?.length !== 0 &&
//             !issuesQuery.isPreviousData
//           ) {
//             setPageNum(pageNum + 1)
//           }
//         }}
//       >
//         Next
//       </button>
//     </div> */}
//   </>
// ) : (
//   <>
//     <h2>Search Results</h2>
//     {searchQuery.isLoading ? (
//       <p>Loading...</p>
//     ) : (
//       <>
//         <p>{searchQuery.data?.data.count} Results</p>
//         <ul className="issues-list">
//           {searchQuery.data?.data.items.map((issue) => (
//             <IssueItem
//               key={issue.id}
//               id={issue.id}
//               comments={issue.comments}
//               title={issue.title}
//               number={issue.number}
//               assignee={issue.assignee}
//               commentCount={issue.comments.length}
//               createdBy={issue.createdBy}
//               createdDate={issue.createdDate}
//               labels={issue.labels}
//               status={issue.status}
//             />
//           ))}
//         </ul>
//       </>
//     )}
//   </>
// )}
