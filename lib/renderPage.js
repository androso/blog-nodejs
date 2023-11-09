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
    //  dark mode
   

    function saveThemePreference() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      localStorage.setItem('theme', currentTheme);
    
    }
    const detectSystemTheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    detectSystemTheme();

    function loadThemePreference() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Call this function when the page loads
    loadThemePreference();



    document.addEventListener("DOMContentLoaded", () => {
      const $toggleButton = document.getElementById("toggle-theme");

      $toggleButton.addEventListener("click", (event) => {
        const theme = document.documentElement.getAttribute("data-theme");

        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'light');
          $toggleButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='M12 17q-2.075 0-3.538-1.463T7 12q0-2.075 1.463-3.538T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17ZM2 13q-.425 0-.713-.288T1 12q0-.425.288-.713T2 11h2q.425 0 .713.288T5 12q0 .425-.288.713T4 13H2Zm18 0q-.425 0-.713-.288T19 12q0-.425.288-.713T20 11h2q.425 0 .713.288T23 12q0 .425-.288.713T22 13h-2Zm-8-8q-.425 0-.713-.288T11 4V2q0-.425.288-.713T12 1q.425 0 .713.288T13 2v2q0 .425-.288.713T12 5Zm0 18q-.425 0-.713-.288T11 22v-2q0-.425.288-.713T12 19q.425 0 .713.288T13 20v2q0 .425-.288.713T12 23ZM5.65 7.05L4.575 6q-.3-.275-.288-.7t.288-.725q.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7t-.275.7q-.275.3-.687.288T5.65 7.05ZM18 19.425l-1.05-1.075q-.275-.3-.275-.713t.275-.687q.275-.3.688-.287t.712.287L19.425 18q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.288-.687t.288-.713L18 4.575q.275-.3.7-.288t.725.288q.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275t-.7-.275ZM4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.712-.275t.688.275q.3.275.288.688t-.288.712L6 19.425q-.275.3-.7.288t-.725-.288Z'/></svg>"
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          $toggleButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21Z'/></svg>"
        }
        console.log(theme)        
        localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
      });
    })
  </script>
  </head>
  <body >
    <header>
      <a href="/">Anibal Andrade</a>     
      <div>
        <nav>
          <a href="/about">About</a>
          <a href="https://twitter.com/AnibalAndrade_">Twitter</a>
          <a href="mailto:anibal.andrade.sv@gmail.com">Email</a>
          <a href="https://replit.com/@androsoa3">Replit</a>
          <a href="https://github.com/androso">Github</a>
          <a href="https://anibalandrade.com/rss">RSS</a>
        </nav>
        <img class="site-logo" src="/public/images/jiro-1.jpg"/>
      </div>
    </header>
    <!--
    <span class="replit">
     <img src="/public/images/jiro-1.jpg"/>
     </span>
     -->
    ${content}
    <button type="button" id="toggle-theme" class="toggle-theme" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21Z"/></svg> 
    </button>
  </body>
</html>
`;
};
