module.exports = {
  apps : [{
    script: './server.js',
    watch: ['routes','views','ecosystem.config.cjs','utils','swagger','database'],
    treekill: false,
  }]
}