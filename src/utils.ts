export function createCoauthorString(user: {
	login: string;
	id: number;
	name: string | null;
}) {
	return `Co-authored-by: ${user.name ?? user.login} <${user.id}+${
		user.login
	}@users.noreply.github.com>`;
}
