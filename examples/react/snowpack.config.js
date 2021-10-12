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
    'components/': './src/components',
    'domains/': './src/domains',
    'services/': './src/services',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-babel',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-sass',
  ],
  devOptions: {
    open: 'none',
  },
}
