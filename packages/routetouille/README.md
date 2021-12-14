# Routetouille

Routetouille (route + ratatouille): the new breed of JavaScript router: hackable, extendable, framework-agnostic, isomorphic, and with the lifecycle.

## Router

`Router` is the main part of the Routetouille, the router itself.

It's just a plain function and should be created like this:

```typescript
const router = Router({
  root: Route({
    ...,
  }),
  history, BrowserHistory(),
  optimistic: true,
})
```

### Options

---

#### `root: AbstractRoute`

The root route should be any of the `Route`‘s, like `Route`, `ModuleRoute`, or any custom one.

---

#### `history: HistoryInterface`

The router history interface should be `HistoryInterface` or any custom one.

---

#### `optimistic?: boolean`

When `true` will change `active` routes to the next active state instantly, and only then will try to unmount the previous and mount the next state.

Because of this any of the promises, like, `.goTo`, `.set` and `.activate`, will be fulfilled instantly.

Recommended using as `true` for client-side routing, for better UX.

### Methods

---

#### `init: () => Promise<void>`

Bounds the router to the history that passed as an option.

Should be triggered at the application initialization.

---

#### `urlTo: (activator: Activator, params: Params) => string`

Will return the pathname of the route you've asked to.

`activator: Activator`: the name or names of the routes which pathname should be returned. Can be:
* `string`: route name (`'post'`)
* `string` route names separated with `.` (`'dashboard.posts.post'`)
* `string[]`: array of route names (`['dashboard', 'posts', 'post']`)

`params: Array<{ [param: string]: string }>`: array of the params if route is parametrized
* in the example `urlTo('posts.post', [{ postId: '123' }])` will return `/dashboard/posts/123/`

---

#### `goTo: (activator: Activator, options?: {}) => Promise<void>`

The abstraction of `activate` and `set` methods, triggers the router to activate the route that asked.

`activator: Activator`, the pathname, or the name of the route which should be activated. Can be:
* `string`: pathname (`'/dashboard/posts/123/'`)
* `string`: route name (`'post'`)
* `string`: route names separated with `.` (`'dashboard.posts.post'`)
* `string[]`: the array of route names (`['dashboard', 'posts', 'post']`)

`options`, the options object, can be different if you extended or use custom behavior of the router, but in default uses these parameters:
* `params: Array<{ [param: string]: string }>`, array params if route is parametrized.
  * in the example `goTo('posts.post', { params: [{ postId: '123' }] })` will activate the `/dashboard/posts/123/` pathname.
* `optimistic?: boolean`
  * will force the `optimistic` behavior of the router options just for one activation, when not passed defaults to the router option.
* `method?: 'push' | 'replace' | null`:
  * the method to be used with router’s history, when not passed or passed as null defaults to `'push'`
* `state?: { scrollTo: number }`
  * the state pushed to the router’s history, by default has only one option `scrollTo`, which defines the scrollTop position of the router after activation (you should implement that in the UI library yourself)

---

#### `activate: (activator: Activator, optimistic?: boolean) => Promise<void>`

Will activate the route that asked.

`activator: Activator`: the name or names of the routes which pathname should be activated. Can be
* `string`: route name (`'post'`)
* `string`: route names separated with `.` (`'dashboard.posts.post'`)
* `string[]`: the array of route names (`['dashboard', 'posts', 'post']`)

`optimistic?: boolean`
* will force the `optimistic` behavior of the router options just for one activation, when not passed defaults to the router option.

---

#### `set: (path: string, optimistic?: boolean) => Promise<void>`

Will activate the route that asked.

`set: string`, the pathname which should be activated:
* pathname (`'/dashboard/posts/123/'`)

`optimistic?: boolean`
* will force the `optimistic` behavior of the router options just for one activation, when not passed defaults to the router option.

---

#### `getMap: () => Map<RouteMapKey, RouteMapRoute>`

Return the map of all routes in the application.

* `RouteMapKey` is the route names separated with `.` always starting from the root route (`'root'`, `'root.dashboard.posts.post'`. etc)
* `RouteMapRoute` is an object with these parameters:
  * `route: AbstactRoute` is the actual route object of the current route.
  * `parent?: RouteMapKey` the parent of the route if there is.
  * `children?: Array<RouteMapKey>` the array of the route children if there is.
  * `fallback?: RouteMapKey` the array of the route fallback if there is.

---

#### `on: (event, callback: (active) => () => void`

The way to subscribe and do something before activation or after.

The default type of `event` is `'beforeActivate' | 'afterActivate'`, but can differ if any custom behavior is used.

The callback receives the array of active routes as an `active: Array<string>` argument, which is an array of routes before or after the activation respectfully.

Returns the `unbind: () => void` function which, when called, unbinds the event.

### Fields

---

#### `root: AbstractRoute`

The current `root` of the router, basically returns the route passed as the `root` option.

---

#### `active: Array<AbstractRoute>`

An array of currently active routes.

---

#### `params: Array<{ [param: string]: string }>`

An array of params of the currently active routes.

---

#### `pathname: string`

The current active pathname of the router.

---

#### `history: HistoryInterface`

The current `history` interface of the router, basically returns the history passed as the `root` option.
