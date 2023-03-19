import { AxiosRequestConfig, AxiosResponse } from "axios"
import api from "./api"
import { Issue, IssueNumberProps, Labels, SearchType, User } from "./types"

export const fetchIssues = async () => {
  return api.get<Issue>("/api/issues").then((res) => res.data)
}
export const fetchIssuesWithLabelsAndStaus = async (
  statusString: string,
  labelString: string,
  config: AxiosRequestConfig = {}
) => {
  return api.get<Issue[]>(`/api/issues?${labelString}${statusString}`, config)
}

export const fetchIssueDetail = async (issueNumber: number) => {
  return api
    .get<IssueNumberProps>(`/api/issues/${issueNumber}`)
    .then((res) => res.data)
}

export const fetchUsers = async (userId: string) =>
  api.get<User>(`/api/users/${userId}`).then((res) => res.data)

export const fetchAllLabels = async () => {
  return api.get<Labels[]>("/api/labels").then((res) => res.data)
}

export const searchIssues = async (
  searchValue: string,
  config: AxiosRequestConfig = {}
) => {
  return api.get<SearchType>(`/api/search/issues?q=${searchValue}`, config)
}

export const fetchIssueComments = async (
  issueNumber: number,
  pageParam: number | string = ""
) => {
  api
    .get(`api/issues/${issueNumber}/comments?page=${pageParam}`)
    .then((res) => res.data)
}

export const fetchAllPossibleStatus = async () =>
  api.get(`/api/possibleStatus`).then((res) => res.data)
