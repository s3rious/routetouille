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
    'local_modules/': './src/local_modules',
    'components/': './src/components',
    'modules/': './src/modules',
    'router/': './src/router',
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-typescript'],
}
