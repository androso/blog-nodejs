const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function hashFile(fpath) {
  const content = fs.readFileSync(fpath, 'utf8');
  return crypto.createHash('md5')
               .update(content, 'utf8')
               .digest('hex');
}

/* eslint max-len: off */
module.exports = ({
  title = 'Anibal Andrade',
  description = 'Anibal Andrade\'s site',
  url = '/',
  image = '/public/pic.png',
}, content) => {
  const staticCssHash = hashFile(
    path.join(__dirname, '..', 'public', 'css', 'main.css')
  );

  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://anibalandrade.com${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:site_name" content="anibalandrade.com" />
    <meta property="fb:app_id" content="1775481339348651" />
    <meta name="author" property="og:author" content="anibalandrade.com" />
    <meta charset="UTF-8" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@AnibalAndrade_" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="alternate" type="application/rss+xml" href="https://anibalandrade.com/rss" />
    <link rel="icon" type="image/png" href="//www.gravatar.com/avatar/5b920c03606b6c232f9c53a666972bdaf7510b5a9d983c1b8bbd61631d30c20e.png?s=32" />
    <link href="//fonts.googleapis.com/css?family=Lato:300,400|Questrial|Raleway:400,100" rel='stylesheet' type='text/css' />
    <link type="text/css" rel="stylesheet" href="/public/css/main.css?${staticCssHash}"/>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/default.min.css" />

   <script type="text/javascript">

  // var _gaq = _gaq || [];
  // _gaq.push(['_setAccount', 'UA-32547130-1']);
  // _gaq.push(['_trackPageview']);

  // (function() {
  //   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  //   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  //   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  // })();

  </script>
  </head>
  <body>
    <header>
      <a href="/">Anibal Andrade</a>     
    </header>
     <a target="_blank" href="/__repl" class="replit"><img src="https://repl.it/public/images/logo-grayscale.png" />
     </a>     
    ${content}
  </body>
</html>
`;
};
