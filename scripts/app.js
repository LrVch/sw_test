(function () {
  let fetched = false;

  window.addEventListener('load', function () {
    if (!fetched) {
      console.log('make preload now');
      Promise.all([
        fetch('/profile'),
        fetch('/')
      ]).then(() => {
        fetched = true;
        console.log('prefetched')
      })
    }
  })
}())
