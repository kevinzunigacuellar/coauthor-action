export function createCoauthorString(user: {
	login: string;
	id: number;
	name: string | null;
	email: string;
}) {
	const email =
		user.email || `${user.id}+${user.login}@users.noreply.github.com`;
	return `Co-authored-by: ${user.name ?? user.login} <${email}>`;
}
