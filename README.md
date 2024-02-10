# Generate coauthors

A GitHub Action that generates a list of coauthors from a pull request and writes them to a comment.

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
      - uses: kevinzunigacuellar/coauthor-action@main
```

## Inputs

| Name             | Description                                               | Default        |
|------------------|-----------------------------------------------------------|----------------|
| `token`          | GITHUB_TOKEN (pull-requests: write) or a repo scoped PAT. | `GITHUB_TOKEN` |
| `trigger-phrase` | A comment that triggers the action.                       | `!coauthor`    |
