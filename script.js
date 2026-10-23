const app = document.getElementById('app')
const description = document.querySelector('meta[name="description"]')
const homeDescription = description.content

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function formatDate(iso) {
  const date = new Date(iso + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function sortedPosts() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
}

function renderHome() {
  const all = sortedPosts()

  if (all.length === 0) {
    app.innerHTML = `
      <div class="empty-state">
        <h2>No posts yet</h2>
        <p>Check back soon. There's writing on the way.</p>
      </div>`
    return
  }

  const cards = all
    .map(
      (post) => `
        <a class="post-card" href="#post/${post.id}" aria-labelledby="post-title-${post.id}">
          <p class="post-meta">
            <span class="post-author">${escapeText(post.author)}</span>
            <span class="dot">&middot;</span>
            <time datetime="${post.date}">${formatDate(post.date)}</time>
          </p>
          <h2 class="post-card-title" id="post-title-${post.id}">${escapeText(post.title)}</h2>
          <p class="post-excerpt">${escapeText(post.excerpt)}</p>
          <span class="read-link">Read the full post</span>
        </a>`,
    )
    .join('')

  app.innerHTML = `
    <h1 class="section-label">Latest writing</h1>
    <div class="post-list">${cards}</div>`
}

function renderPost(id) {
  const post = posts.find((p) => p.id === id)

  if (!post) {
    document.title = 'Post not found | Second Wind'
    app.innerHTML = '<h1>Post not found</h1><p>This article link is unavailable.</p><a class="back-link" href="#">Back to all posts</a>'
    return
  }

  document.title = `${post.title} | Second Wind`
  description.content = post.excerpt
  const paragraphs = post.body.map((text) => `<p>${escapeText(text)}</p>`).join('')

  app.innerHTML = `
    <a class="back-link" href="#" data-home>&larr; Back to all posts</a>
    <article class="article">
      <header class="article-head">
        <h1 class="article-title">${escapeText(post.title)}</h1>
        <p class="post-meta">
          <span class="post-author">${escapeText(post.author)}</span>
          <span class="dot">&middot;</span>
          <time datetime="${post.date}">${formatDate(post.date)}</time>
        </p>
      </header>
      <div class="article-body">${paragraphs}</div>
      <a class="back-link back-link-bottom" href="#" data-home>&larr; Back to all posts</a>
    </article>`

  window.scrollTo(0, 0)
}

function renderRoute(moveFocus = false) {
  document.title = 'Second Wind'
  description.content = homeDescription
  const match = /^#post\/([1-9]\d*)$/.exec(window.location.hash)
  if (window.location.hash && window.location.hash !== '#') renderPost(match ? Number(match[1]) : NaN)
  else renderHome()
  if (moveFocus) {
    app.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }
}

window.addEventListener('hashchange', () => renderRoute(true))
renderRoute()
