mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: coordinates,
  zoom: 9
});
new mapboxgl.Marker({color:"red"}).setLngLat(coordinates).setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h6>${listing.location}</h6><p>Exact location after booking</p>`)).addTo(map);