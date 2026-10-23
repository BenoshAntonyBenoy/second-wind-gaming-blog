const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

function page(hash = '', fixture) {
  const app = { innerHTML: '', focus() { this.focused = true } }
  const description = { content: 'Home description' }
  const listeners = {}
  const window = { location: { hash }, scrollTo() {}, addEventListener(name, fn) { listeners[name] = fn } }
  const document = { title: '', getElementById: () => app, querySelector: () => description }
  const context = vm.createContext({ window, document })
  vm.runInContext(fixture ? `const posts = ${JSON.stringify(fixture)}` : fs.readFileSync('posts.js', 'utf8'), context)
  vm.runInContext(fs.readFileSync('script.js', 'utf8'), context)
  return { app, description, document, navigate(hash) { window.location.hash = hash; listeners.hashchange() } }
}

test('direct article URLs survive initial loads and restore browser metadata', () => {
  const p = page('#post/1')
  assert.match(p.document.title, /Balatro/)
  assert.match(p.app.innerHTML, /class="article-body"/)
  assert.notEqual(p.description.content, 'Home description')
  p.navigate('')
  assert.equal(p.document.title, 'Second Wind')
  assert.equal(p.description.content, 'Home description')
  assert.match(p.app.innerHTML, /href="#post\/1"/)
  assert.equal(p.app.focused, true)
  p.navigate('#post/2')
  assert.match(p.document.title, /Steam Deck/)
})

test('unknown and malformed article URLs have a recovery link', () => {
  for (const hash of ['#post/999', '#post/1oops', '#post/-1', '#unavailable']) {
    const p = page(hash)
    assert.match(p.app.innerHTML, /Post not found/)
    assert.match(p.app.innerHTML, /href="#"/)
  }
})

test('post strings are rendered as text instead of executable markup', () => {
  const p = page('#post/1', [{ id: 1, title: '<img src=x onerror=alert(1)>', author: 'A & B', date: '2026-01-01', excerpt: '"quoted"', body: ['<script>alert(1)</script>'] }])
  assert.doesNotMatch(p.app.innerHTML, /<img|<script/)
  assert.match(p.app.innerHTML, /&lt;script&gt;/)
  assert.match(p.app.innerHTML, /A &amp; B/)
})
