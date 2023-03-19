import { Link } from "react-router-dom"
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go"
import { relativeDate } from "../helpers/relativeDate"
import { fetchIssueDetail } from "../api/issuesApi"
// import { useUserData } from "../helpers/useUserData"
// import { Label } from "./Label"
import { useQueryClient } from "@tanstack/react-query"
// import fetchWithError from "../helpers/fetchWithError"
import { Issue, IssueCommentsProps } from "../api/types"
import { useUserData } from "../helpers/useUserData"
import { Label } from "./Label"

export function IssueItem({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}: Issue & { commentCount: number }) {
  const assigneeUser = useUserData(assignee)
  const createdByUser = useUserData(createdBy)
  const queryClient = useQueryClient()
  return (
    <li
      onMouseEnter={() => {
        queryClient.prefetchQuery(["issues", number.toString()], () =>
          fetchIssueDetail(number)
        )
        // queryClient.prefetchInfiniteQuery(
        //   ["issues", number.toString(), "comments"],
        //   () => fetchWithError(`/api/issues/${number}/comments?page=1`)
        // )
      }}
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
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <Label label={label} />
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)}{" "}
          {createdByUser.isSuccess ? `by ${createdByUser.data.name}` : ""}
        </small>
      </div>
      {assignee ? (
        <img
          src={
            assigneeUser.isSuccess ? assigneeUser.data.profilePictureUrl : ""
          }
          className="assigned-to"
          alt={`Assigned to ${
            assigneeUser.isSuccess ? assigneeUser.data.name : "avatar"
          }`}
        />
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  )
}
