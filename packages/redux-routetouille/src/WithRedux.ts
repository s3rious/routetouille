/**
 * Creates a composable Redux integration wrapper that provides both state and dispatch.
 *
 * This is a composition of WithReduxDispatch(WithReduxState(...)) that provides both
 * Redux state and dispatch function to components as props and to lifecycle hooks as
 * object parameters with both `state` and `dispatch` properties.
 *
 * @example
 * ```typescript
 * // Standalone usage
 * const reduxHandler = WithRedux()({
 *   store,
 *   beforeMount: async ({ state, dispatch }) => {
 *     if (!state.auth.user) {
 *       dispatch(loadUser());
 *     }
 *   },
 * });
 *
 * // Composed with React component
 * const route = WithRedux(WithReactComponent(Route))({
 *   name: 'dashboard',
 *   path: '/dashboard',
 *   store,
 *   component: ({ state, dispatch }) => (
 *     <div>
 *       <p>User: {state.auth.user?.name}</p>
 *       <button onClick={() => dispatch(logout())}>Logout</button>
 *     </div>
 *   ),
 *   beforeMount: async ({ state, dispatch }) => {
 *     if (!state.auth.isAuthenticated) {
 *       await router.goTo('/login');
 *     }
 *   },
 * });
 * ```
 */
import { WithReduxDispatch } from "./WithReduxDispatch.js";
import { WithReduxState } from "./WithReduxState.js";

// biome-ignore lint/suspicious/noExplicitAny: Required for flexible route composition
const WithRedux = (createRoute?: any) =>
  WithReduxDispatch(WithReduxState(createRoute));

export { WithRedux };
