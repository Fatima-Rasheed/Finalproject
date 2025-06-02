// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/admin-dashboard/supervisors',
        destination: '/admin-dashboard/manage-supervisors',
        permanent: true,
      },
    ]
  },
}
