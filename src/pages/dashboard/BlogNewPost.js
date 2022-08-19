// material
import {Container} from '@material-ui/core';
// hooks
import useSettings from 'shared/hooks/useSettings';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import {BlogNewPostForm} from '../../components/_dashboard/blog';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function BlogNewPost() {
	const {themeStretch} = useSettings();

	return (
		<Page title="Blog: New Post | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading="Create a new post"
					links={[
						{name: 'Dashboard', href: PATH_DASHBOARD.root},
						{name: 'Blog', href: PATH_DASHBOARD.blog.root},
						{name: 'New Post'}
					]}
				/>

				<BlogNewPostForm />
			</Container>
		</Page>
	);
}
