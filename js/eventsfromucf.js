function getEvents()
{
  fetch('https://events.ucf.edu/this-week/feed.json')
    .then(response => response.json())
    .then(data => {
      // Loop through each object in the array
      data.forEach(object => {
        // Send the object to your PHP file using AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://first-web.xyz/API/CreatePEUCF.php');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(object));
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}