module.exports = {
  apps: [{
    name: 'clinics',
    script: 'dist/main.js',
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}


