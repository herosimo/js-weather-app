export class App {
  constructor(api) {
    this.api = api;

    this.body = document.body;
    this.searchIcon = document.querySelector(".left__top__searchIcon");
    this.searchForm = document.querySelector(".search");
    this.searchLoading = document.querySelector(".search__loading");
    this.closeIcon = document.querySelector(".close");
    this.modal = document.querySelector(".modal");
    this.cityList = document.querySelector(".city-list");
    this.loadingRoot = document.querySelector(".loading-root");
    this.container = document.querySelector(".container");
    // this.weatherDetails = document.querySelector(".weather-details__content");
    // this.weatherDetailsLoading = document.querySelector(".weather-details__loading");

    // Temperature details
    this.leftScreenTemp = document.querySelector(".left__bottom__temp span");
    this.leftScreenTitle = document.querySelector(".left__bottom__temp h2");
    this.leftScreenSubtitle = document.querySelector(".left__bottom__temp p");
    this.leftScreenFl = document.querySelector(".left__bottom__fl");
    this.leftScreenDate = document.querySelector(".left__bottom__footer__date");
    this.leftScreenLocation = document.querySelector(".left__bottom__footer__location");

    // Right screen weather details
    this.rightScreenAqi = document.querySelector(".right__details__aqi");
    this.rightScreenHumidity = document.querySelector(".right__details__humidity");
    this.rightScreenPressure = document.querySelector(".right__details__pressure");
    this.rightScreenUvi = document.querySelector(".right__details__uvi");
    this.rightScreenClouds = document.querySelector(".right__details__clouds");
    this.rightScreenVisibility = document.querySelector(".right__details__visibility");
    this.rightScreenWind = document.querySelector(".right__details__wind");
    this.rightScreenNextHours = document.querySelector(".right__nextHours");
    this.rightScreenNextDays = document.querySelector(".right__nextDays");

    this.toggleHideView(this.searchLoading, true);
    this.toggleHideView(this.cityList, true);
    // this.toggleHideView(this.weatherDetails, true);
    // this.toggleHideView(this.weatherDetailsLoading, true);
    this.toggleHideView(this.modal, true);
    this.toggleHideView(this.loadingRoot, true);

    // check user location call
    window.onload = () => this.checkUserLocation();
    this.searchForm.addEventListener("submit", this.onSubmitForm);
    this.searchIcon.addEventListener("click", () => this.toggleHideView(this.modal, false));

    this.modal.addEventListener("click", (e) => {
      if (e.target.matches(".close") || !e.target.closest(".modal__container")) {
        this.toggleHideView(this.modal, true);
      }
    });
  }

  toggleHideView(element, hide) {
    element.classList.toggle("hide", hide);
  }

  checkUserLocation() {
    const onSuccess = async (data) => {
      let loc = await this.api.callGeocoding("reverse", {
        lat: data.coords.latitude,
        lon: data.coords.longitude,
      });

      let newData = {
        coords: {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          city: loc[0].name,
          state: loc[0].state,
          country: loc[0].country,
        },
      };

      this.changeCity(newData);
    };

    const onFail = () => {
      // Default location when user doesn't allow geolocation
      const defaultData = {
        coords: {
          latitude: "51.5073219",
          longitude: "-0.1276474",
          city: "London",
          state: "England",
          country: "GB",
        },
      };

      this.changeCity(defaultData);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onFail);
    } else {
      onFail();
    }
  }

  changeCity = async (data) => {
    this.toggleHideView(this.modal, true);
    this.toggleHideView(this.loadingRoot, false);

    // this.toggleHideView(this.weatherDetailsLoading, false);
    let lat = data.target?.dataset?.lat || data.coords?.latitude;
    let lon = data.target?.dataset?.lon || data.coords?.longitude;
    let city = data.target?.dataset?.city || data.coords?.city;
    let state = data.target?.dataset?.state || data.coords?.state;
    let country = data.target?.dataset?.country || data.coords?.country;

    const oneCallData = await this.api.callOneCall(lat, lon);
    const airPollutionData = await this.api.callAirPollution(lat, lon);

    const bgPhoto = await this.api.searchPhoto(state);

    this.container.style.backgroundImage = `linear-gradient(rgba(87, 87, 87, 0.5), rgba(87, 87, 87, 0.5)), url("${bgPhoto.results[0].urls.regular}")`;

    // Format time to always have 2 digits
    const formatTime = (time) => {
      return ("0" + time).slice(-2);
    };

    // Change left screen value
    let date = new Date(oneCallData.current.dt * 1000);

    this.leftScreenTemp.innerText = `${oneCallData.current.temp}°C`;
    this.leftScreenTitle.innerText = oneCallData.current.weather[0].main;
    this.leftScreenSubtitle.innerText = oneCallData.current.weather[0].description;
    this.leftScreenFl.innerText = `Feels like ${oneCallData.current.feels_like}°C`;
    this.leftScreenDate.innerText = `${formatTime(date.getHours())}:${formatTime(
      date.getMinutes()
    )} - ${date.toLocaleDateString("en-US", {
      weekday: "long",
    })}, ${date.getDate()} ${date.toLocaleDateString("en-US", {
      month: "long",
    })} ${date.getFullYear()}`;
    this.leftScreenLocation.innerText = `${city}, ${state}, ${country}`;

    // Change right screen value
    let visibility = oneCallData.current.visibility / 1000;
    let windSpeed = (oneCallData.current.wind_speed * (60 * 60)) / 1000;

    let airPollutionDataVal = airPollutionData.list[0].main.aqi;
    const airPollutionDataDetails = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    this.rightScreenAqi.innerText = `${airPollutionDataVal} / ${
      airPollutionDataDetails[airPollutionDataVal - 1]
    }`;
    this.rightScreenHumidity.innerText = `${oneCallData.current.humidity}%`;
    this.rightScreenPressure.innerText = `${oneCallData.current.pressure}hPa`;
    this.rightScreenUvi.innerText = `${oneCallData.current.uvi}`;
    this.rightScreenClouds.innerText = `${oneCallData.current.clouds}%`;
    this.rightScreenVisibility.innerText = `${visibility.toFixed(1)}km`;
    this.rightScreenWind.innerText = `${windSpeed.toFixed(1)}km/h`;

    // Next hours
    let nextHourELements = "";
    let hourlyData = oneCallData.hourly.slice(0, 18);
    hourlyData.forEach((data) => {
      let date = new Date(data.dt * 1000);

      nextHourELements += `
      <li>
        <span>${formatTime(date.getHours())}:${formatTime(date.getMinutes())}</span>
        <span>${data.weather[0].main} / ${data.temp}°C</span>
      </li>
      `;
    });

    this.rightScreenNextHours.innerHTML = nextHourELements;

    // Next days
    let nextDayELements = "";
    oneCallData.daily.forEach((data) => {
      let date = new Date(data.dt * 1000);

      nextDayELements += `
      <li>
        <span>${date.toLocaleDateString("en-US", {
          weekday: "long",
        })}, ${date.getDate()} ${date.toLocaleDateString("en-US", {
        month: "long",
      })} ${date.getFullYear()}</span>
        <span>${data.weather[0].main} / ${data.temp.min}°C / ${data.temp.max}°C</span>
      </li>
      `;
    });

    console.log(oneCallData);

    this.rightScreenNextDays.innerHTML = nextDayELements;
    // this.toggleHideView(this.weatherDetailsLoading, true);
    // this.toggleHideView(this.weatherDetails, false);

    this.toggleHideView(this.loadingRoot, true);
  };

  onSubmitForm = async (e) => {
    e.preventDefault();
    this.toggleHideView(this.searchLoading, false);
    this.cityList.firstElementChild.innerHTML = "";

    const locations = await this.api.callGeocoding("direct", { city: e.target[0].value });

    if (locations.length > 0) {
      let elements = "";

      locations.forEach((location) => {
        elements += `<li data-lon="${location.lon}" data-lat="${location.lat}" data-city="${location.name}" data-state="${location.state}" data-country="${location.country}" class="city">${location.name}, ${location.state}, ${location.country}</li>`;
      });

      this.cityList.firstElementChild.innerHTML = elements;

      const cities = document.querySelectorAll(".city");
      cities.forEach((city) => city.addEventListener("click", this.changeCity));
      this.toggleHideView(this.cityList, false);
    } else {
      alert("no result");
    }

    this.toggleHideView(this.searchLoading, true);
  };
}
