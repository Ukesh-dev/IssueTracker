import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { IssueItem } from "./IssueItem"
import Loader from "../helpers/Loader"
import { fetchIssuesWithLabelsAndStaus, searchIssues } from "../api/issuesApi"
import { Issue, SearchType } from "../api/types"
import { debounceFn } from "../helpers/debounceFn"

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
  const issuesQuery = useQuery<Issue[]>(
    ["issues", { labels, status, pageNum }],
    async ({ signal }) => {
      const statusString = status ? `&status=${status}` : ""
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&")
      const paginationString = pageNum ? `&page=${pageNum}` : ""

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
  issuesQuery.data && console.log("issueqeury", issuesQuery.data)
  const [searchValue, setSearchValue] = useState("")
  const [searchQueryValue, setSearchQueryValue] = useState<string>("")

  const searchQuery = useQuery<SearchType>(
    ["issues", "search", searchQueryValue],
    ({ signal }) => searchIssues(searchQueryValue, { signal }),
    {
      enabled: searchQueryValue.length > 0,
    }
  )
  const initSearchApiRequest = useMemo(() => {
    return debounceFn(async (q: string) => {
      setSearchQueryValue(q)
    }, 1000)
  }, [])
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setSearchValue(q)
    initSearchApiRequest(q)
  }

  return (
    <div>
      <form
      // onSubmit={(event) => {
      //   event.preventDefault()
      //   setSearchValue(event.target.elements.search.value)
      // }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          value={searchValue}
          onChange={(event) => {
            onChangeValue(event)
          }}
        />
      </form>
      <div className="issues-header">
        <h3>
          Issues {issuesQuery.fetchStatus === "fetching" ? <Loader /> : null}
        </h3>
      </div>

      {issuesQuery.isLoading ? (
        <p style={{ paddingBlock: "1.5rem" }}>Loading...</p>
      ) : issuesQuery.isError ? (
        <p style={{ paddingBlock: "1.5rem" }}>
          There was problem fetching issues
        </p>
      ) : searchQuery.fetchStatus === "idle" &&
        searchQuery.isLoading === true ? (
        <>
          <ul className="issues-list">
            {issuesQuery.data.map((issue) => (
              <IssueItem
                key={issue.id}
                comments={issue.comments}
                id={issue.id}
                title={issue.title}
                number={issue.number}
                // assignee={issue.assignee}
                assignee={issue.id}
                commentCount={issue.comments}
                createdBy={issue.createdBy}
                createdDate={issue.createdDate}
                label_id={issue.label_id}
                status={issue.status}
              />
            ))}
          </ul>
          {/* <div className="pagination">
      <button
        onClick={() => {
          if (pageNum - 1 > 0) {
            setPageNum(pageNum - 1)
          }
        }}
        disabled={pageNum === 1}
      >
        Previous
      </button>
      <p>
        Page {pageNum} {issuesQuery.isFetching ? "..." : ""}
      </p>
      <button
        disabled={
          issuesQuery.data?.length === 0 || issuesQuery.isPreviousData
        }
        onClick={() => {
          if (
            issuesQuery.data?.length !== 0 &&
            !issuesQuery.isPreviousData
          ) {
            setPageNum(pageNum + 1)
          }
        }}
      >
        Next
      </button>
    </div> */}
        </>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data?.count} Results</p>
              <ul className="issues-list">
                {searchQuery.data?.items.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    id={issue.id}
                    comments={issue.comments}
                    title={issue.title}
                    number={issue.number}
                    assignee={issue.assignee}
                    commentCount={issue.comments}
                    createdBy={issue.createdBy}
                    createdDate={issue.createdDate}
                    label_id={issue.label_id}
                    status={issue.status}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
