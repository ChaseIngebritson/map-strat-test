const ghpages = require('gh-pages');

ghpages.publish('build', (err) => {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
})