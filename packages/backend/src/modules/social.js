const crypto = require('crypto');
const { parseJsonBody } = require('../lib/body');
const { ok, fail } = require('../lib/response');
const { requireAuth } = require('../lib/auth');
const { writeDb } = require('../lib/db');
const { paginate } = require('../lib/pagination');

function ensureSeedPosts(db) {
  if (Array.isArray(db.posts) && db.posts.length > 0) return;

  const now = Date.now();
  db.posts = [
    {
      id: crypto.randomUUID(),
      userId: 'seed-marcus',
      authorName: 'Marcus Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
      content: 'Hit a strong push session today. 3,240kg total volume. OneMore plan is dialed in.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      likes: ['seed-a', 'seed-b', 'seed-c'],
      comments: [
        {
          id: crypto.randomUUID(),
          userId: 'seed-a',
          authorName: 'Coach_K',
          text: 'Great consistency. Keep progressive overload.',
          createdAt: new Date(now - 1000 * 60 * 24).toISOString(),
        },
      ],
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
    },
  ];
}

function serializePost(post, currentUserId) {
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const likes = Array.isArray(post.likes) ? post.likes : [];

  return {
    id: post.id,
    userId: post.userId,
    authorName: post.authorName,
    authorAvatar: post.authorAvatar,
    content: post.content,
    image: post.image || null,
    createdAt: post.createdAt,
    comments,
    commentsCount: comments.length,
    likeCount: likes.length,
    likedByMe: likes.includes(currentUserId),
  };
}

async function getPosts(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  ensureSeedPosts(db);
  writeDb(db);

  const posts = db.posts
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((post) => serializePost(post, auth.user.id));

  return ok({ posts });
}

async function createPost(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const body = await parseJsonBody(req);
  const content = String(body.content || '').trim();

  if (!content) return fail(400, 'VALIDATION_ERROR', 'Post content cannot be empty.');

  const post = {
    id: crypto.randomUUID(),
    userId: auth.user.id,
    authorName: auth.user.name,
    authorAvatar: auth.user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    content,
    image: body.image ? String(body.image) : null,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  db.posts.push(post);
  writeDb(db);

  return ok({ post: serializePost(post, auth.user.id) }, 201);
}

async function toggleLike(req, postId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const post = db.posts.find((item) => item.id === postId);
  if (!post) return fail(404, 'NOT_FOUND', 'Post not found.');

  if (!Array.isArray(post.likes)) post.likes = [];

  const index = post.likes.indexOf(auth.user.id);
  if (index >= 0) {
    post.likes.splice(index, 1);
  } else {
    post.likes.push(auth.user.id);
  }

  writeDb(db);
  return ok({ post: serializePost(post, auth.user.id) });
}

async function getComments(req, parsedUrl, postId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db } = authCtx;
  const post = db.posts.find((item) => item.id === postId);
  if (!post) return fail(404, 'NOT_FOUND', 'Post not found.');

  const comments = (Array.isArray(post.comments) ? post.comments : [])
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const page = parsedUrl.searchParams.get('page');
  const pageSize = parsedUrl.searchParams.get('pageSize');
  const paged = paginate(comments, page, pageSize, 30);

  return ok({ comments: paged.items, pagination: paged });
}

async function createComment(req, postId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const post = db.posts.find((item) => item.id === postId);
  if (!post) return fail(404, 'NOT_FOUND', 'Post not found.');

  const body = await parseJsonBody(req);
  const text = String(body.text || '').trim();
  if (!text) return fail(400, 'VALIDATION_ERROR', 'Comment cannot be empty.');

  if (!Array.isArray(post.comments)) post.comments = [];

  post.comments.push({
    id: crypto.randomUUID(),
    userId: auth.user.id,
    authorName: auth.user.name,
    text,
    createdAt: new Date().toISOString(),
  });

  writeDb(db);

  return ok({ post: serializePost(post, auth.user.id) });
}

async function deleteComment(req, postId, commentId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const post = db.posts.find((item) => item.id === postId);
  if (!post) return fail(404, 'NOT_FOUND', 'Post not found.');

  if (!Array.isArray(post.comments)) post.comments = [];

  const index = post.comments.findIndex((item) => item.id === commentId);
  if (index < 0) return fail(404, 'NOT_FOUND', 'Comment not found.');

  if (post.comments[index].userId !== auth.user.id) {
    return fail(403, 'FORBIDDEN', 'You can only delete your own comments.');
  }

  post.comments.splice(index, 1);
  writeDb(db);

  return ok({ deleted: true, post: serializePost(post, auth.user.id) });
}

module.exports = {
  getPosts,
  createPost,
  toggleLike,
  getComments,
  createComment,
  deleteComment,
};
