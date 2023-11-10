module.exports = {
  apps : [{
    script: './server.js',
    watch: ['routes','views','ecosystem.config.cjs','utils','swagger','database','server.js'],
    treekill: false,
  }]
}