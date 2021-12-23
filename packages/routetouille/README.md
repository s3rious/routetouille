# Routetouille

Routetouille (route + ratatouille): the new breed of JavaScript router: hackable, extendable, framework-agnostic, isomorphic, and with the lifecycle.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Router](#router)
  - [Options](#options)
    - [`root: AbstractRoute`](#root-abstractroute)
    - [`history: HistoryInterface`](#history-historyinterface)
    - [`optimistic?: boolean`](#optimistic-boolean)
  - [Methods](#methods)
    - [`init: () => Promise<void>`](#init---promisevoid)
    - [`urlTo: (activator: Activator, params: Params) => string`](#urlto-activator-activator-params-params--string)
    - [`goTo: (activator: Activator, options?: {}) => Promise<void>`](#goto-activator-activator-options---promisevoid)
    - [`activate: (activator: Activator, optimistic?: boolean) => Promise<void>`](#activate-activator-activator-optimistic-boolean--promisevoid)
    - [`set: (path: string, optimistic?: boolean) => Promise<void>`](#set-path-string-optimistic-boolean--promisevoid)
    - [`getMap: () => Map<RouteMapKey, RouteMapRoute>`](#getmap---maproutemapkey-routemaproute)
    - [`on: (event, callback: (active) => () => void`](#on-event-callback-active----void)
  - [Fields](#fields)
    - [`root: AbstractRoute`](#root-abstractroute-1)
    - [`active: Array<AbstractRoute>`](#active-arrayabstractroute)
    - [`params: Array<{ [param: string]: string }>`](#params-array-param-string-string-)
    - [`pathname: string`](#pathname-string)
    - [`history: HistoryInterface`](#history-historyinterface-1)
- [Routes](#routes)
  - [Route](#route)
  - [ModuleRoute](#moduleroute)
  - [FallbackRoute](#fallbackroute)
  - [Options](#options-1)
    - [`name: string`](#name-string)
    - [`path: Slug | Search | Hash`](#path-slug--search--hash)
    - [`children?: AbstractRoute[]`](#children-abstractroute)
    - [`beforeMount?: () => Promise<void>`](#beforemount---promisevoid)
    - [`afterMount?: () => Promise<void>`](#aftermount---promisevoid)
    - [`afterUnmount?: () => Promise<void>`](#afterunmount---promisevoid)
    - [`afterUnmount?: () => Promise<void>`](#afterunmount---promisevoid-1)
    - [`redirects?: Redirect[]`](#redirects-redirect)
  - [Fields](#fields-1)
    - [`name: string`](#name-string-1)
    - [`path: string`](#path-string)
    - [`mounted: boolean`](#mounted-boolean)
    - [`children?: AbstractRoute[]`](#children-abstractroute-1)
- [History](#history)
  - [BrowserHistory](#browserhistory)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

#### `root: AbstractRoute`

The root route should be any of the `Route`‘s, like `Route`, `ModuleRoute`, or any custom one.

#### `history: HistoryInterface`

The router history interface should be `HistoryInterface` or any custom one.

#### `optimistic?: boolean`

When `true` will change `active` routes to the next active state instantly, and only then will try to unmount the previous and mount the next state. Optional, defaults to `false`.

Because of this any of the promises, like, `.goTo`, `.set` and `.activate`, will be fulfilled instantly.

Recommended using as `true` for client-side routing, for better UX.

### Methods

#### `init: () => Promise<void>`

Bounds the router to the history that was passed as an option.

Should be triggered at the application initialization.

#### `urlTo: (activator: Activator, params: Params) => string`

Will return the pathname of the route you've asked to.

`activator: Activator`: the name or names of the routes which pathname should be returned. Can be:
* `string`: route name (`'post'`)
* `string` route names separated with `.` (`'dashboard.posts.post'`)
* `string[]`: array of route names (`['dashboard', 'posts', 'post']`)

`params: Array<{ [param: string]: string }>`: array of the params if route is parametrized
* in the example `urlTo('posts.post', [{ postId: '123' }])` will return `/dashboard/posts/123/`

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

#### `activate: (activator: Activator, optimistic?: boolean) => Promise<void>`

Will activate the route that asked.

`activator: Activator`: the name or names of the routes which pathname should be activated. Can be
* `string`: route name (`'post'`)
* `string`: route names separated with `.` (`'dashboard.posts.post'`)
* `string[]`: the array of route names (`['dashboard', 'posts', 'post']`)

`optimistic?: boolean`
* will force the `optimistic` behavior of the router options just for one activation, when not passed defaults to the router option.

#### `set: (path: string, optimistic?: boolean) => Promise<void>`

Will activate the route that asked.

`set: string`, the pathname which should be activated:
* pathname (`'/dashboard/posts/123/'`)

`optimistic?: boolean`
* will force the `optimistic` behavior of the router options just for one activation, when not passed defaults to the router option.

#### `getMap: () => Map<RouteMapKey, RouteMapRoute>`

Return the map of all routes in the application.

* `RouteMapKey` is the route names separated with `.` always starting from the root route (`'root'`, `'root.dashboard.posts.post'`. etc)
* `RouteMapRoute` is an object with these parameters:
  * `route: AbstactRoute` is the actual route object of the current route.
  * `parent?: RouteMapKey` the parent of the route if there is.
  * `children?: Array<RouteMapKey>` the array of the route children if there is.
  * `fallback?: RouteMapKey` the array of the route fallback if there is.

#### `on: (event, callback: (active) => () => void`

The way to subscribe and do something before activation or after.

The default type of `event` is `'beforeActivate' | 'afterActivate'`, but can differ if any custom behavior is used.

The callback receives the array of active routes as an `active: Array<string>` argument, which is an array of routes before or after the activation respectfully.

Returns the `unbind: () => void` function which, when called, unbinds the event.

### Fields

#### `root: AbstractRoute`

The current `root` of the router, basically returns the route passed as the `root` option.

#### `active: Array<AbstractRoute>`

An array of currently active routes.

#### `params: Array<{ [param: string]: string }>`

An array of params of the currently active routes.

#### `pathname: string`

The current active pathname of the router.

#### `history: HistoryInterface`

The current `history` interface of the router, basically returns the history passed as the `root` option.

## Routes

### Route

`Route` is is the classic route with a specific path.

For example:

```typescript
Route({
  name: 'post',
  path: ':postId/',
  afterMount: async () => {
    const id = getParam(router.params, 'id') 
    
    await fetchPost(id)
  },
})
```

Is a route with a specific path which used to show data of one specific post and will fetch its data after the route is mounted.

### ModuleRoute

`ModuleRoute` is a route without a path that is used to group specific logic, usually a business domain one, and has specific `Route`‘s inside.

For example:

```typescript
ModuleRoute({
  name: 'posts',
  afterMount: fetchAuthors,
  children: [
    postRoute,
  ]
})
```

Is a route that will fetch all the authors when mounted, and it will be mounted when every of its child routes will be mounted.

### FallbackRoute

`FallbackRoute` is a specific route that will be mounted if the user tried to visit any of the routes which path is not specified in the tree.

For example:

```typescript
Route({
  name: 'root',
  path: '/',
  children: [
    Route({
      name: 'foo',
      path: 'foo/'
    }),
    FallbackRoute({
      name: '404',
      component: Fallback,
    }),
  ]
})
```

When the user tries to visit the `/bar/` route or any other than `/foo/`, the fallback will be mounted.

### Options

#### `name: string`

`name: string` is the simple name of the route. Required in any routes.

it can be any string, just don‘t use the `.` symbol inside, but, I recommend using `kebab-case`.

#### `path: Slug | Search | Hash`

`path: Slug | Search | Hash` is the path of the route. Required in `Route`.

Should always be the string, but should be one of three specific ones:

* `Slug` is the string that ends with `/`
  Just the normal part of the pathname, e.g. `/`, `posts/`, `:postId`.
* `Search` is the string that starts with `?`.
  The query parameter route name, e.g. `?edit`, `?postId=123`.
  Non-initial query parameters, like `&edit` will also be matched by the `?edit` route, the position isn't important.
* `Hash` is the string that starts with `#`
  The hash route name, e.g. `#edit`, '#share'.

Every route can be parametrized with `:<name>`, e.g.:
* `/:postId`
* `/author-:name`
* `?postId=:postId`
* `?:key=:value`
* `#:action`

#### `children?: AbstractRoute[]`

The array of children routes. Optional.

`AbstractRoute` can be any of the default routes or custom routes, but it should have a `name` field.

#### `beforeMount?: () => Promise<void>`

Is a lifecycle callback that will be triggered just before the route is mounted. Optional.

Used to perform some action that doesn't need to wait until the whole tree is rendered, like, for example:
* Initialize a framework or a library, like `React`
* Fetch data in blocking fashion

#### `afterMount?: () => Promise<void>`

Is a lifecycle callback that will be triggered right after the route is mounted. Optional.

Used to perform some action in async with mounting:
* Fetch data for a route view
* Call some analytics page view

#### `afterUnmount?: () => Promise<void>`

Is a lifecycle callback that will be triggered just before the route is unmounted. Optional.

It's rare, but can be used to perform some action that validates the page inputs or something:
* Check if the user fulfilled the required field of the form page, and if not, redirect it back to the page

#### `afterUnmount?: () => Promise<void>`

Is a lifecycle callback that will be triggered right after a route is unmounted. Optional.

Used to perform some action in async with unmounting:
* Destroy a framework or a library, like `React`
* Invalidate or reset store data to default values

#### `redirects?: Redirect[]`

Is a highly specific superset of `beforeMount` callbacks which used to redirect a user from a route to another route if some condition was met. Optional.

`Redirect: [ShouldWe, WhatTo]` is a tuple of two async functions:
* `ShouldWe: () => Promise<boolean>` is an async function that returns a boolean
* `WhatTo: () => Promise<void>` is an async function that called if `ShouldWe` returned `true`, used to call and return `router.goTo` method.

I consider deleting that from the `1.0` release cuz it's rare to use and kinda redundant.

### Fields

#### `name: string`

Returns the route name that was passed as an option.

#### `path: string`

Returns the route path that was passed as an option.

#### `mounted: boolean`

Returns the boolean that indicated is the route is mounted or not.

#### `children?: AbstractRoute[]`

Returns the routes array that was passed as an option or the `undefined`.

## History

History provider could vary, but it should be any object-like structure matching that interface:

```typescript
type HistoryInterface = {
  pathname: string | null
  push: (pathname: string | null, state?: unknown) => void
  replace: (pathname: string | null, state?: unknown) => void
  emitter: Emitter<Events>
}
```

Right now there is only one first-party provider, the `BrowserHistory`, but you can write your matching that matches the interface.

### BrowserHistory

Is the provider that used to play along with the browser‘s History API, it emits `pushState` and `replaceState` events when `push` or `replace` happens, and subscribes to the `popstate` event to handle the browser‘s “Back” and “Forward” buttons.
