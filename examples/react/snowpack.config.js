/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  routes: [
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
    },
  ],
  alias: {
    // effector: /* __SNOWPACK_ENV__.MODE === */ 'effector-logger' /* ? 'effector-logger' : 'effector' */,
    'local_modules/': './src/local_modules',
    'components/': './src/components',
    'domains/': './src/domains',
    'router/': './src/router',
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-typescript', '@snowpack/plugin-sass'],
  devOptions: {
    open: 'none',
  },
}
