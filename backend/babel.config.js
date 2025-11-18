export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      },
      modules: false // Keep ES modules instead of converting to CommonJS
    }]
  ]
};




