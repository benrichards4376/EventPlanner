function getEventsFromUCF() {
  fetch('https://events.ucf.edu/this-month/feed.json')
    .then(response => response.json())
    .then(data => {
      // Loop through each object in the array
      data.forEach(object => {
        const location = object.location;
        // Send a request to the Google Maps Geocoding API to get the longitude and latitude
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyBBZYNvOkenwpXai6IUlxcLNPlDq0KpOKQ`);
        xhr.onload = function() {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.status === 'OK') {
              // Add the longitude and latitude to the object
              object.longitude = response.results[0].geometry.location.lng;
              object.latitude = response.results[0].geometry.location.lat;
              console.log(object);
              // Send the object to your PHP file using AJAX
              const xhr2 = new XMLHttpRequest();
              xhr2.open('POST', 'http://first-web.xyz/API/CreatePEUCF.php');
              xhr2.setRequestHeader('Content-Type', 'application/json');
              xhr2.send(JSON.stringify(object));
            } else {
              // console.error('Error getting longitude and latitude:', response.status);
              console.log(object);
              object.longitude = "N/A";
              object.latitude = "N/A";
              // Send the object to your PHP file using AJAX
              const xhr2 = new XMLHttpRequest();
              xhr2.open('POST', 'http://first-web.xyz/API/CreatePEUCF.php');
              xhr2.setRequestHeader('Content-Type', 'application/json');
              xhr2.send(JSON.stringify(object));
            }
          } else {
            console.error('Error getting longitude and latitude:', xhr.statusText);
          }
        };
        xhr.onerror = function() {
          console.error('Error getting longitude and latitude');
        };
        xhr.send();
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
