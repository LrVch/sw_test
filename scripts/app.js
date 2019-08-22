(function () {
  window.addEventListener('load', function () {
    console.log('make preload now');
    Promise.all([
      fetch('/profile'),
      fetch('/')
    ]).then(() => {
      console.log('prefetched')
    })
  })
}())
