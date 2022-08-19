import plusFill from '@iconify/icons-eva/plus-fill';
import {Icon} from '@iconify/react';
// material
import {Box, Button, Container, Grid, Skeleton, Stack} from '@material-ui/core';
import {orderBy} from 'lodash';
import {useCallback, useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Link as RouterLink} from 'react-router-dom';
// hooks
import useSettings from 'shared/hooks/useSettings';
import {getMorePosts, getPostsInitial} from 'shared/redux/slices/blog';
// redux
import {useDispatch, useSelector} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import {BlogPostCard, BlogPostsSearch, BlogPostsSort} from '../../components/_dashboard/blog';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
	{value: 'latest', label: 'Latest'},
	{value: 'popular', label: 'Popular'},
	{value: 'oldest', label: 'Oldest'}
];

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
	if (sortBy === 'latest') {
		return orderBy(posts, ['createdAt'], ['desc']);
	}
	if (sortBy === 'oldest') {
		return orderBy(posts, ['createdAt'], ['asc']);
	}
	if (sortBy === 'popular') {
		return orderBy(posts, ['view'], ['desc']);
	}
	return posts;
};

const SkeletonLoad = (
	<Grid container spacing={3} sx={{mt: 2}}>
		{[...Array(4)].map((_, index) => (
			<Grid item xs={12} md={3} key={index}>
				<Skeleton variant="rectangular" width="100%" sx={{height: 200, borderRadius: 2}} />
				<Box sx={{display: 'flex', mt: 1.5}}>
					<Skeleton variant="circular" sx={{width: 40, height: 40}} />
					<Skeleton variant="text" sx={{mx: 1, flexGrow: 1}} />
				</Box>
			</Grid>
		))}
	</Grid>
);

export default function BlogPosts() {
	const {themeStretch} = useSettings();
	const dispatch = useDispatch();
	const [filters, setFilters] = useState('latest');
	const {posts, hasMore, index, step} = useSelector((state) => state.blog);
	const sortedPosts = applySort(posts, filters);
	const onScroll = useCallback(() => dispatch(getMorePosts()), [dispatch]);

	useEffect(() => {
		dispatch(getPostsInitial(index, step));
	}, [dispatch, index, step]);

	const handleChangeSort = (event) => {
		setFilters(event.target.value);
	};

	return (
		<Page title="Blog: Posts | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading="Blog"
					links={[
						{name: 'Dashboard', href: PATH_DASHBOARD.root},
						{name: 'Blog', href: PATH_DASHBOARD.blog.root},
						{name: 'Posts'}
					]}
					action={
						<Button
							variant="contained"
							component={RouterLink}
							to={PATH_DASHBOARD.blog.newPost}
							startIcon={<Icon icon={plusFill} />}
						>
							New Post
						</Button>
					}
				/>

				<Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
					<BlogPostsSearch />
					<BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
				</Stack>

				<InfiniteScroll
					next={onScroll}
					hasMore={hasMore}
					loader={SkeletonLoad}
					dataLength={posts.length}
					style={{overflow: 'inherit'}}
				>
					<Grid container spacing={3}>
						{sortedPosts.map((post, index) => (
							<BlogPostCard key={post.id} post={post} index={index} />
						))}
					</Grid>
				</InfiniteScroll>
			</Container>
		</Page>
	);
}
