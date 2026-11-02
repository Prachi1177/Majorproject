mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [72.8777, 19.0760],
    zoom: 9
});
new mapboxgl.Marker({color: "red"})
    .setLngLat([72.8777, 19.0760])
    .addTo(map);