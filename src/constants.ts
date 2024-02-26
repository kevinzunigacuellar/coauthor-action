export const query = `
query participants($owner: String!, $repo: String!, $pr: Int!, $first: Int = 100) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      participants(first: $first) {
        nodes {
          name,
          login,
          databaseId,
          email,
        }
      }
    }
  }
}`;
