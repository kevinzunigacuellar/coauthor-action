# Generate Co-authors

A GitHub Action that compiles a list of coauthors involved in a pull request and posts the "Coauthor-by" string as a comment.

## Usage

```yaml
name: Write coauthors to a pull request
permissions:
  pull-requests: write
  
on:
  issue_comment:
    types:
      - created
      
jobs:
  generate-coauthors:
    name: Generate Coauthor
    if: ${{ github.event.issue.pull_request }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: kevinzunigacuellar/coauthor-action@v0.1.3
```

## Inputs

| Name             | Description                                               | Default        |
|------------------|-----------------------------------------------------------|----------------|
| `token`          | GITHUB_TOKEN (pull-requests: write) or a repo scoped PAT. | `GITHUB_TOKEN` |
| `trigger-phrase` | A comment that triggers the action.                       | `!coauthor`    |
