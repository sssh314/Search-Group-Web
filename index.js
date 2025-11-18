// 위도/경도로 주소 변환 함수
function showUserAddress(lat, lng, callback){
    const geocoder = new google.maps.Geocoder(); // 위도/경도를 주소로 변환하는 Geocoder 객체 생성
    const location = { lat: lat, lng: lng }; // 변환할 위치 객체

    geocoder.geocode({ location: location }, function(results, status) {
        if (status === "OK" && results[0]) {
            const address = results[0].formatted_address;

            document.getElementById("user-address").textContent =
                "현재위치: " + address; // 화면 하단에 주소 표시
 
            localStorage.setItem("user_address", address);

            if(callback) callback(address); // InfoWindow에 표시하기 위해 콜백
        } else {
            document.getElementById("user-address").textContent =
                "주소를 가져올 수 없습니다.";

            if(callback) callback(null);
        }
    });
}

function initAllMaps(){
    initPlaceMap();  // 모임 장소 선택 지도만 초기화
}

let placeMap;
let placeMarker;
let geocoder;

window.onload = function() {
    const addressSpan = document.getElementById("user-address");
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                // 위도/경도 → 주소 변환
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        const address = results[0].formatted_address;
                        addressSpan.textContent = address;
                        localStorage.setItem("user_address", address);
                        localStorage.setItem("user_lat", lat);
                        localStorage.setItem("user_lng", lng);
                    } else {
                        addressSpan.textContent = "주소를 가져올 수 없습니다.";
                        console.error(status);
                    }
                });
            },
            (err) => {
                addressSpan.textContent = "위치 권한 거부 또는 오류";
                console.error(err);
            }
        );
    } else {
        addressSpan.textContent = "위치 정보를 지원하지 않는 브라우저";
    }
};


function initPlaceMap() {
    geocoder = new google.maps.Geocoder();

    // 기본 지도 위치 (현재 사용자 위치를 저장한 localStorage 기반)
    const defaultLat = parseFloat(localStorage.getItem("user_lat")) || 37.5665;
    const defaultLng = parseFloat(localStorage.getItem("user_lng")) || 126.9780;

    placeMap = new google.maps.Map(document.getElementById("map-place"), {
        center: { lat: defaultLat, lng: defaultLng },
        zoom: 15,
        disableDefaultUI: true,
    });

    placeMap.addListener("click", (e) => {
        const latLng = e.latLng;

        // 마커 표시
        if (!placeMarker) {
            placeMarker = new google.maps.Marker({
                position: latLng,
                map: placeMap
            });
        } else {
            placeMarker.setPosition(latLng);
        }

        // 주소 변환
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
                const address = results[0].formatted_address;

                // input에 표시
                document.getElementById("group-location-input").value = address;

                // localStorage 저장
                localStorage.setItem("selected_group_location", address);
                localStorage.setItem("selected_group_lat", latLng.lat());
                localStorage.setItem("selected_group_lng", latLng.lng());
            }
        });
    });
}



