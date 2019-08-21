(function () {
  let fetched = false;

  window.addEventListener('load', function () {
    if (!fetched) {
      console.log('make preload now');
      fetch('/profile')
        .then(() => console.log('prefetched'))
    }
  })
}())
