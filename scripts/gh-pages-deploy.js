const ghpages = require('gh-pages');

ghpages.publish('dist', (err) => {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
})