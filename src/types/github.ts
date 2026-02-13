export interface GitHubUser {
  login: string
  avatar_url: string
  html_url: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  owner: GitHubUser
  html_url: string
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string | null
  state: "open" | "closed"
  user: GitHubUser
  comments: number
  created_at: string
  html_url: string
  labels: { name: string; color: string }[]
  assignee: GitHubUser | null
  pull_request?: {
    url: string
  }
}
