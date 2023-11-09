const express = require('express');
const renderPage = require('./lib/renderPage');
const marked = require('marked');
const path = require('path');
const app = express();
const fs = require('fs');
const hljs = require('highlight.js');
const _ = require('lodash');
const { Feed } = require('feed');

const renderer = new marked.Renderer();

// Pass html unescaped
renderer.html = str => _.unescape(str);

marked.setOptions({
  renderer: renderer,
  highlight(code, lang) {
    try {
      return hljs.highlight(code, lang).value;
    } catch (e) {
      // Failed to highlight the language
      return hljs.highlightAuto(code).value;
    }
  },
});

const staticOpts = {
  maxAge: 365 * 24 * 60 * 60 * 1000,
};

app.use('/public', express.static(
  path.join(__dirname, 'public'), staticOpts
));

app.use('/androso', express.static(
  path.join(__dirname, 'public/images/androso.jpg'), staticOpts
));

app.use('/natural', express.static(
  path.join(__dirname, 'public/natural.pdf'), staticOpts
));

const essaysDir = path.join(__dirname, 'essays');

function parse(fpath) {
  const post = fs.readFileSync(path.join(essaysDir, fpath), 'utf8');
  let parts = null;

  if (process.platform === "linux") {
    parts = post.split('---\n');
  } else {
    parts = post.split('---\r\n'); // because we're in windows
  }

  const json = parts.shift();
  const essay = (() => {
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error('error parsing json for essay', fpath);
      throw e;
    }
  })();

  const date = Date.parse(essay.date);
  if (isNaN(date)) {
    throw new Error(`Invalid date: ${essay.date} - ${fpath}`);
  }
  essay.date = new Date(date);
  essay.raw = parts.join('---\n');
  essay.content = marked(essay.raw);
  essay.url = path.basename(fpath, '.md');
  essay.description = essay.raw.slice(0, 200).replace(/\n/g, ' ') + '...';
  return essay;
}

const essays = fs.readdirSync(essaysDir)
  .filter(fpath => fpath[0] !== '.')
  .map(parse)
  .sort((a, b) => b.date - a.date);

const feed = new Feed({
  title: "Anibal Andrade",
  description: "Essays",
  id: "https://anibalandrade.com",
  link: "https://anibalandrade.com",
  image: "https://gravatar.com/avatar/5b920c03606b6c232f9c53a666972bdaf7510b5a9d983c1b8bbd61631d30c20e?size=200",
  favicon: "https://gravatar.com/avatar/5b920c03606b6c232f9c53a666972bdaf7510b5a9d983c1b8bbd61631d30c20e?size=200",
  copyright: "All rights reserved 2023, Anibal Andrade",
  generator: "anibalandrade.me",
  feedLinks: {
    json: "https://anibalandrade.com/json",
    rss: "https://anibalandrade.com/rss"
  },
  author: {
    name: "Anibal Andrade",
    email: "anibal.andrade.sv@gmail.com",
    link: "https://anibalandrade.com"
  }
});

for (const essay of essays) {
  if (essay.hidden) continue;

  feed.addItem({
    title: essay.title,
    id: essay.id,
    url: `https://anibalandrade.com/${essay.url}`,
    description: essay.description,
    content: essay.content,
    date: essay.date,
    image: essay.image,
    author: [
      {
        name: "Anibal Andrade",
        email: "anibal.andrade.sv@gmail.com",
        link: "https://anibalandrade.com"
      },
    ],
  });
}

feed.addCategory("Tech");

app.use(function (req, res, next) {
  res.header('X-Rob-Is-Awesom', true);
  next();
});

app.get('/json', (req, res) => {
  res.end(feed.json1());
});

app.get('/rss', (req, res) => {
  res.end(feed.rss2());
});

app.get('/hello', (req, res) => res.end('hello world'));

app.get('/', (req, res) => {
  const essayList = essays.filter(es => !es.hidden).map(es => (
    `<li>
       <a href="${es.url}">${es.title}</a>
     </li>`
  )).join('\n');

  const html = `
  <div class="introduction">
    <div class="introduction__text">
      <h2>Hey, I'm Anibal</h2>
      <p>I'm a software engineer who loves writing software and following my curiosity</p>
      <p>When i'm not hacking, you can find me exploring neuroscience and writing essays around love, friendships and life</p>
    </div>
    <img src="/public/images/androso-2.jpeg" alt="that's me!">
  </div>
  <article class="index postContent">
    <div class="essayList">
      <p>Projects:</p>
      <ul>
        <li>
          <a href="https://kanban.anibalandrade.com">Kanban app</a>
        </li>
        <li>
          <a href="https://ahorcado.anibalandrade.com">Hangman</a>
        </li>
      </ul
    </div>
    <div class="essayList">
      <p>Essays:</p>
      <ul>
        ${essayList}
      </ul>
    </div>
  </article>
  `;
  const page = renderPage({}, html);
  res.send(page);
});

essays.forEach((es) => {
  app.get(`/${es.url}`, (req, res) => {
    const html = `
        <article class="postItem">
          <h1 class="postTitle">
            <a href="/${es.url}">${es.title}</a>
          </h1>
          <h3 class="postAuthor">
            ${es.date.toDateString()}
          </h3>
          <div class="postContent">
            ${es.content}
          </div>
        </article>
        `;

    const page = renderPage({
      title: es.title,
      description: es.description,
      url: `/${es.url}`,
      image: es.image,
    }, html);
    res.send(page);
  });
});

app.get('/about', (req, res) => {
  fs.readFile(
    path.join(__dirname, 'pages', 'about.md'),
    (err, d) => {
      if (err) {
        res.status(500);
        res.text('something went wrong :(');
        return;
      }

      res.set('Content-Type', 'text/html');
      const content = marked(d.toString('utf8'));
      const html = `<article class="postItem postContent">
      ${content}
      </article>`;

      const page = renderPage({}, html);
      res.send(page);
    }
  );
});

app.get('/bio', (req, res) => {
  fs.readFile(
    path.join(__dirname, 'pages', 'bio.md'),
    (err, d) => {
      if (err) {
        res.status(500);
        res.text('something went wrong :(');
        return;
      }

      res.set('Content-Type', 'text/html');
      const content = marked(d.toString('utf8'));
      const html = `<article class="postItem postContent">
      ${content}
      </article>`;

      const page = renderPage({}, html);
      res.send(page);
    }
  );
});

const redirections = {
  '/2012/12/11/stuffjs': '/stuffjs',
};

Object.keys(redirections).forEach((key) => {
  const route = redirections[key];
  app.get(key, (req, res) => {
    res.redirect(301, route);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('running on port', port);
});