# Generate coauthors

A GitHub Action to generate a list of coauthors from a pull request using a label. The coauthor string is written to the pull request as a comment.

## Usage

```yaml
name: Write coauthors to pull request
on:
  pull_request:
    types: [labeled]
permissions:
  pull-requests: write
jobs:
  generate-coauthors:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: kevinzunigacuellar/coauthor-action@main
```

## Inputs

| Name    | Description                                               | Default         |
| ------- | --------------------------------------------------------- | --------------- |
| `token` | GITHUB_TOKEN (pull-requests: write) or a repo scoped PAT. | `GITHUB_TOKEN`  |
| `label` | A label to trigger the action.                            | `add-coauthors` |
