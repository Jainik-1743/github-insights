# GitHub Insights Dashboard

A professional-grade GitHub repository analytics dashboard built with Next.js
(App Router), TanStack Query, and shadcn/ui. This application provides real-time
insights into repositories, issues, and contributors using the GitHub REST API.

## 🚀 Features

- **Repository Analytics:** Server-side rendered dashboard showing key metrics
  (Stars, Forks, Contributors).
- **Advanced Issue Browser:**
  - Paginated table with caching (prefetching next pages).
  - Filtering by State (Open/Closed) and Assignee (Assigned/Unassigned).
  - Sorting by Date and Comment count.
  - distinct visual indicators for Issues vs. Pull Requests.
- **Optimistic Mutations:** "Close Issue" action updates the UI instantly and
  rolls back automatically if the API request fails (e.g., Permission Denied).
- **Robust Error Handling:** graceful handling of GitHub Rate Limits (403),
  Network Errors, and 404s.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **State Management:** TanStack Query v5 (Server State) + React Hooks (Local
  State)
- **Styling:** Tailwind CSS + shadcn/ui
- **API Integration:** GitHub REST API via Server Actions

## 🏃‍♂️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jainik-1743/github-insights.git
   cd github-insights
   ```
