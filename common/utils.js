function generateSlug (title, id) {
  // Convert full-width characters to half-width characters
  title = title.replace(/[\uFF01-\uFF5E]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
  })

  // cover Chinese, English, Japanese, Hiragana and Katakana
  let slug = title.trim().toLowerCase().replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]+/g, ' ').trim().replace(/\s+/g, '-')

  slug += '-' + Math.floor(Math.random() * 100) + id + Math.floor(Math.random() * 10)
  return slug
}

module.exports = {
  generateSlug
}
