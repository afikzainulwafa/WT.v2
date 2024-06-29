document.addEventListener("DOMContentLoaded", function () {
    const imeiData = [
        { imei: "350317171460474", name: "Mugiran", type: "harvester" },
        { imei: "350317171466992", name: "Munandar", type: "harvester" },
        { imei: "350317171462827", name: "Jamal Priuda", type: "harvester" },
        { imei: "350317171466729", name: "Sutriono Eka Saputra", type: "harvester" },
        { imei: "350317171467230", name: "Nasruzi", type: "harvester" },
        { imei: "350424069964201", name: "Desriansyah Eka Putra",type: "harvester" },
        { imei: "350317171455607", name: "Edi Yansyah", type: "harvester" },
        { imei: "350424069963732", name: "Surakat", type: "harvester" },
        { imei: "350317171466414", name: "Sularto", type: "harvester" },
        { imei: "350317171473667", name: "Shobirin", type: "harvester" },
        { imei: "350317171467065", name: "Dedi Haryanto", type: "harvester" },
        { imei: "350424069957874", name: "Oik Kaz Wiliadi", type: "harvester" },
        { imei: "350317171466588", name: "Ismail", type: "harvester" },
        { imei: "350424062657638", name: "Sugianto", type: "harvester" },
        { imei: "350424069963872", name: "Muhammad Syaini", type: "harvester" },
        { imei: "350317171463031", name: "Wasli", type: "harvester" },
        { imei: "350317171470804", name: "Slamet R", type: "harvester" },
        { imei: "350317171475530", name: "Suyono", type: "harvester" },
        { imei: "350424069957817", name: "Suhri", type: "harvester" },
        { imei: "350317171473576", name: "Subada", type: "harvester" },
        { imei: "350424062482490", name: "Roni Suwarno", type: "harvester" },
        { imei: "350424069963708", name: "Suryadi", type: "harvester" },
        { imei: "350317171474814", name: "Leo Kapisa", type: "harvester" },
        { imei: "350424069964029", name: "Tri Harjono", type: "harvester" },
        { imei: "350317171475308", name: "Bambang Susanto", type: "harvester" },
        { imei: "350317171468121", name: "Mahfudin", type: "harvester" },
        { imei: "350544500636629", name: "Sukirman", type: "harvester" },
        { imei: "350317171468469", name: "Komarudin", type: "harvester" },
        { imei: "350317171475407", name: "Rudini", type: "harvester" },
        { imei: "350544501851904", name: "Parlan", type: "harvester" },
        { imei: "350317171460409", name: "Dian Aswari", type: "harvester" },
        { imei: "350317171450129", name: "Agus Jalaludin Dili", type: "harvester" },
        { imei: "350424069963807", name: "A.Yani", type: "mandor" },
        { imei: "350317171466570", name: "Hendry", type: "mandor" },
        { imei: "350424062650401", name: "B3", type: "backup" },
        { imei: "350317171460250", name: "B4", type: "backup" },
        { imei: "350317171466356", name: "B5", type: "backup" },
        { imei: "350424069957734", name: "B6", type: "backup" },
        { imei: "350317171431756", name: "B7", type: "backup" },
        { imei: "350317171462819", name: "B8", type: "backup" },
        { imei: "350317171451127", name: "B9", type: "backup" }
    ];

    document.getElementById("date-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const date = document.getElementById("date").value;
        if (date) {
            fetchDataAndDisplayOnMap(date);
        } else {
            alert("Please select a date.");
        }
    });

    document.getElementById("refresh-map").addEventListener("click", function () {
        const date = document.getElementById("date").value;
        if (date) {
            fetchDataAndDisplayOnMap(date);
        } else {
            alert("Please select a date.");
        }
    });

    async function fetchDataAndDisplayOnMap(date) {
        try {
            const response = await fetch(`/api/data?date=${date}`);
            const data = await response.json();

            if (data && data.result && data.result.result) {
                const coordinates = data.result.result;
                displayDataOnMap(coordinates);
            } else {
                alert("No data found for the selected date.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data. Please try again later.");
        }
    }

    function displayDataOnMap(coordinates) {
        document.getElementById("map").innerHTML = "<div id='map' style='height: 600px; width: 100%;'></div>";

        const map = L.map("map").setView([-2.94358, 104.455615], 15);

        // Define the base layers
        const esriSatellite = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
                maxZoom: 18,
            }
        );

        const osmStreets = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }
        );

        const mapboxSatellite = L.tileLayer(
            "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_ACCESS_TOKEN",
            {
                attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
                maxZoom: 22,
                tileSize: 512,
                zoomOffset: -1
            }
        );

        const mapTilerSatellite = L.tileLayer(
            "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=YOUR_MAPTILER_API_KEY",
            {
                attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
                maxZoom: 20
            }
        );

        const stamenToner = L.tileLayer(
            "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
            {
                attribution: '&copy; <a href="http://maps.stamen.com/">Stamen</a>',
                maxZoom: 20
            }
        );

        // Add the Esri satellite layer to the map by default
        esriSatellite.addTo(map);

        // Create a layers control
        const baseLayers = {
            "Satellite": esriSatellite,
            "OSM Streets": osmStreets,
            // "Mapbox Satellite": mapboxSatellite,
            // "MapTiler Satellite": mapTilerSatellite,
            // "Stamen Toner": stamenToner
        };

        // Add the layers control to the map
        L.control.layers(baseLayers).addTo(map);

        
        

        const imeiGroups = coordinates.reduce((groups, coord) => {
            if (!groups[coord.imei]) {
                groups[coord.imei] = [];
            }
            groups[coord.imei].push([coord.lat, coord.lon]);
            return groups;
        }, {});

        const polylines = {};

        Object.keys(imeiGroups).forEach(imei => {
            const color = getRandomColor();
            const imeiInfo = imeiData.find(item => item.imei === imei);
            const popupContent = `IMEI: ${imei}<br>Name: ${imeiInfo ? imeiInfo.name : 'Unknown'}<br>Type: ${imeiInfo ? imeiInfo.type : 'Unknown'}`;

            polylines[imei] = L.polyline(imeiGroups[imei], { color })
                .addTo(map)
                .bindPopup(popupContent);
        });

        function togglePolylines(visible) {
            Object.values(polylines).forEach(polyline => {
                if (visible) {
                    map.addLayer(polyline);
                } else {
                    map.removeLayer(polyline);
                }
            });
        }

        document.getElementById("showPolylines").addEventListener("change", function () {
            togglePolylines(this.checked);
        });

        togglePolylines(document.getElementById("showPolylines").checked);
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
