module.exports = {
  apps : [{
    script: './server.js',
    watch: ['routes','views','ecosystem.config.cjs','utils','ml','swagger','database'],
    treekill: false,
  }]
}