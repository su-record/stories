const SitemapPlugin = require('sitemap-webpack-plugin').default;
const postAll = require('./public/posts/index.json');
const paths = postAll.map(post => {
  return {
    path: `/${post.name}/`,
    lastmod: post.lastmod || post.date,
    changefreq: 'yearly',
  };
});

module.exports = [
  new SitemapPlugin({
    base: process.env.VUE_APP_BASE_URL,
    paths,
  }),
];
