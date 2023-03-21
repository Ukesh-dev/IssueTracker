import { Link } from "react-router-dom"
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go"
import { relativeDate } from "../helpers/relativeDate"
import {
  fetchIssueDetail,
  fetchIssues,
  fetchLabelsWithId,
} from "../api/issuesApi"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Issue, IssueCommentsProps, Labels } from "../api/types"
import { useUserData } from "../helpers/hooks/useUserData"
import { Label } from "./Label"

export function IssueItem({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  label_id,
  status,
}: Issue & { commentCount: number }) {
  const assigneeUser = useUserData(assignee)
  assigneeUser && console.log(assigneeUser.data?.profilePictureUrl)
  console.log(label_id)
  const assignedLabels = useQuery<Labels>(["labels", label_id], () =>
    fetchLabelsWithId(label_id)
  )
  console.log("assignedLables", assignedLabels.data)
  const createdByUser = useUserData(createdBy)
  const queryClient = useQueryClient()
  return (
    <li
      onMouseEnter={() => {
        queryClient.prefetchQuery(["issues", number.toString()], () =>
          fetchIssueDetail(`${number}`)
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
          <Link to={`/api/issues/${number}`}>{title}</Link>
          {assignedLabels.data && (
            <Label key={assignedLabels.data.id} label={assignedLabels.data} />
          )}
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
