import { Router, Route, FallbackRoute, BrowserHistory } from "routetouille";

const router = Router({
  history: BrowserHistory()
});

router.root = Route({
  name: "main",
  path: "/",
  afterMount: () => {
    document.getElementById("root").innerHTML = `
      <h1>
        Main page
      </h1>
      <ul>
        <li>
          <a href="/foo/">
            Foo
          </a>
        </li>
        <li>
          <a href="/bar/">
            Bar
          </a>
        </li>
        <li>
          <a href="/baz/">
            Baz
          </a>
        </li>
      </ul>
    `;
  },
  children: [
    Route({
      name: "foo",
      path: "foo/",
      afterMount: () => {
        document.getElementById("root").innerHTML = `
          <h1>
            Foo
          </h1>
          <a href="/">
            Main page
          </a>
        `;
      }
    }),
    Route({
      name: "bar",
      path: "bar/",
      afterMount: () => {
        document.getElementById("root").innerHTML = `
          <h1>
            Bar
          </h1>
          <a href="/">
            Main page
          </a>
        `;
      }
    }),
    FallbackRoute({
      name: "404",
      afterMount: () => {
        document.getElementById("root").innerHTML = `
          <h1>
            Oopsie, Daisy! That‘s 404.
          </h1>
          <a href="/">
            Main page
          </a>
        `;
      }
    })
  ]
});

router.init(); 