mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: housing.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(housing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${housing.title}</h4><p>${housing.location}</p>`
            )
    )
    .addTo(map)