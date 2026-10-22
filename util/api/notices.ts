import {
    type ApiClient,
    requirePositiveInt,
    requireText,
    requireUser,
    unwrap,
} from './core';
import type { NoticeBoard } from './types';

export function createNoticesApi(client: ApiClient) {
    /** profiles는 본인 행만 읽을 수 있어서 작성 시점 닉네임을 글/댓글에 함께 저장한다. */
    async function requireAuthor() {
        const user = await requireUser(client);
        const { nickname } = unwrap(
            await client
                .from('profiles')
                .select('nickname')
                .eq('id', user.id)
                .single(),
        );
        return { author_id: user.id, author_nickname: nickname };
    }

    return {
        /** 최신순 전체 목록. 검색/페이지 나누기는 화면에서 한다. */
        async listPosts(board: NoticeBoard) {
            return unwrap(
                await client
                    .from('notice_posts')
                    .select('*')
                    .eq('board', board)
                    .order('created_at', { ascending: false })
                    .order('id', { ascending: false }),
            );
        },
        async getPost(postId: number) {
            return unwrap(
                await client
                    .from('notice_posts')
                    .select('*')
                    .eq('id', requirePositiveInt(postId))
                    .maybeSingle(),
            );
        },
        /** 공지 작성 권한(관리자)은 DB 정책이 확인한다. */
        async createPost(input: {
            board: NoticeBoard;
            title: string;
            content: string;
        }) {
            const author = await requireAuthor();
            return unwrap(
                await client
                    .from('notice_posts')
                    .insert({
                        ...author,
                        board: input.board,
                        title: requireText(input.title, 'title'),
                        content: input.content,
                    })
                    .select('*')
                    .single(),
            );
        },
        /** 본인 글이거나 관리자만 수정된다. 권한이 없으면 .single() 오류가 난다. */
        async updatePost(
            postId: number,
            changes: { title: string; content: string },
        ) {
            await requireUser(client);
            return unwrap(
                await client
                    .from('notice_posts')
                    .update({
                        title: requireText(changes.title, 'title'),
                        content: changes.content,
                    })
                    .eq('id', requirePositiveInt(postId))
                    .select('*')
                    .single(),
            );
        },
        /** 삭제된 id 배열. 권한이 없거나 글이 없으면 빈 배열이다. */
        async deletePost(postId: number) {
            await requireUser(client);
            return unwrap(
                await client
                    .from('notice_posts')
                    .delete()
                    .eq('id', requirePositiveInt(postId))
                    .select('id'),
            );
        },
        async increaseViews(postId: number) {
            unwrap(
                await client.rpc('increase_notice_views', {
                    p_post_id: requirePositiveInt(postId),
                }),
            );
        },
        /** 댓글과 답글을 작성순으로 함께 반환한다. parent_id로 묶는 것은 호출부가 한다. */
        async listComments(postId: number) {
            return unwrap(
                await client
                    .from('notice_comments')
                    .select('*')
                    .eq('post_id', requirePositiveInt(postId))
                    .order('created_at')
                    .order('id'),
            );
        },
        /** 목록 화면용 글별 댓글+답글 개수. 댓글이 없는 글은 키가 없다. */
        async countComments(postIds: readonly number[]) {
            if (postIds.length === 0) return {};
            const rows = unwrap(
                await client
                    .from('notice_comments')
                    .select('post_id')
                    .in('post_id', [...postIds]),
            );
            const counts: Record<number, number> = {};
            rows.forEach(({ post_id }) => {
                counts[post_id] = (counts[post_id] ?? 0) + 1;
            });
            return counts;
        },
        /** parentId가 있으면 그 댓글의 답글이 된다. */
        async createComment(postId: number, text: string, parentId?: number) {
            const author = await requireAuthor();
            return unwrap(
                await client
                    .from('notice_comments')
                    .insert({
                        ...author,
                        post_id: requirePositiveInt(postId),
                        parent_id:
                            parentId === undefined
                                ? null
                                : requirePositiveInt(parentId),
                        text: requireText(text, 'text'),
                    })
                    .select('*')
                    .single(),
            );
        },
        /** 삭제된 id 배열. 답글은 DB에서 함께 삭제된다. */
        async deleteComment(commentId: number) {
            await requireUser(client);
            return unwrap(
                await client
                    .from('notice_comments')
                    .delete()
                    .eq('id', requirePositiveInt(commentId))
                    .select('id'),
            );
        },
    };
}
