# Routetouille

Routetouille (route + ratatouille): the new breed of JavaScript router: hackable, extendable, framework-agnostic, isomorphic, and with the lifecycle.

## Principles:

* ### The route should have its lifecycle.

    The lifecycle proved to be a great strategy for UI libraries and it's used in the core of Routetouille.

    Every route can (and by default has) live cycle methods, such as `beforeMount`, `afterMount`, `beforeUnmount`, and `afterUnmount`, so you can fetch data, log info, initialize and destroy instances of any framework in any way you want.

* ### Everything should be hackable and extendable.

    If you need to add some specific functionality that extends the behavior of some route, e.g. render react component, log the data to the custom logger, and so on – you can easily write a new route behavior and use it with any route or router.

    If you don't like how any behavior of the router or the route, even the core one, e.g, the way the route mounts, you can rework and replace that behavior.

    You can combine default and custom behaviors of router or route into custom router or route at any time.

* ### The router should be framework-agnostic.

    The Routetouille by itself isn't tied to any framework, you can write (but probably shouldn't) a vanilla js application with just the Routetouille, but it's designed to play nicely with any of the major frameworks out there.
    
    It can handle multiple instances of one or many frameworks, it's built with microfrontends in mind.

* ### The router should be isomorphic.

    Right now there is only Browser’s history API as a first-class module, but Routetouille is designed to handle any kind of history (memory, hashbang, or else) with just a simple function.

## Documentation

### Installation

Via npm:
```sh
npm install routetouille --save
```

Or yarn npm:
```sh
yarn add routetouille
```

### Quick start

TDB

### Detailed

For more detailed documentation please take a look at the readme of the specific package:

* [Routetouille](packages/routetouille)
* [React-Routetouille](packages/react-routetouille)

## Examples

* [React application with single react root](examples/react) 