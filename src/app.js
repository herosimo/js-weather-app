export class App {
  constructor(api) {
    this.api = api;

    this.searchIcon = document.querySelector(".left__top__searchIcon");
    this.searchForm = document.querySelector(".search");
    this.searchLoading = document.querySelector(".search__loading");
    this.modal = document.querySelector(".modal");
    this.cityList = document.querySelector(".city-list");
    this.loadingRoot = document.querySelector(".loading-root");
    this.container = document.querySelector(".container");

    // Left screen temperature details
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
    this.toggleHideView(this.modal, true);
    this.toggleHideView(this.loadingRoot, true);

    // Call check user location on the first screen
    window.onload = () => this.checkUserLocation();

    // Event listeners
    this.searchForm.addEventListener("submit", this.onSubmitForm);
    this.searchIcon.addEventListener("click", () => this.toggleHideView(this.modal, false));
    this.modal.addEventListener("click", (e) => {
      if (e.target.matches(".close") || !e.target.closest(".modal__container")) {
        this.toggleHideView(this.modal, true);
      }
    });
  }

  /*
   * Helper function to hide an element
   */
  toggleHideView(element, hide) {
    element.classList.toggle("hide", hide);
  }

  /*
   * Helper function to format time to always have 2 digits value
   */
  formatTime(time) {
    return ("0" + time).slice(-2);
  }

  /*
   * Check user's location with navigator.geolocation
   */
  checkUserLocation() {
    // When user grants access to their location
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

    // Default location when user doesn't allow geolocation
    const onFail = () => {
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

    // Check with geolocation if device supports
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onFail);
    } else {
      onFail();
    }
  }

  /*
   * Function to invoke when user chooses a city
   */
  changeCity = async (data) => {
    // Close modal and show loading screen
    this.toggleHideView(this.modal, true);
    this.toggleHideView(this.loadingRoot, false);

    // Check if data is coming from  user's location or search form
    let lat = data.target?.dataset?.lat || data.coords?.latitude;
    let lon = data.target?.dataset?.lon || data.coords?.longitude;
    let city = data.target?.dataset?.city || data.coords?.city;
    let state = data.target?.dataset?.state || data.coords?.state;
    let country = data.target?.dataset?.country || data.coords?.country;

    // Call api to OpenWeather
    const oneCallData = await this.api.callOneCall(lat, lon);
    const airPollutionData = await this.api.callAirPollution(lat, lon);

    // Call api to Unsplash & set background image
    const bgPhoto = await this.api.searchPhoto(state);
    this.container.style.backgroundImage = `linear-gradient(rgba(87, 87, 87, 0.5), rgba(87, 87, 87, 0.5)), url("${bgPhoto.results[0].urls.regular}")`;

    // Change left screen value
    let date = new Date(oneCallData.current.dt * 1000);

    this.leftScreenTemp.innerText = `${oneCallData.current.temp}°C`;
    this.leftScreenTitle.innerText = oneCallData.current.weather[0].main;
    this.leftScreenSubtitle.innerText = oneCallData.current.weather[0].description;
    this.leftScreenFl.innerText = `Feels like ${oneCallData.current.feels_like}°C`;
    this.leftScreenDate.innerText = `${this.formatTime(date.getHours())}:${this.formatTime(
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

    // Change right screen value -> next hours
    let nextHourELements = "";
    let hourlyData = oneCallData.hourly.slice(0, 18);

    hourlyData.forEach((data) => {
      let date = new Date(data.dt * 1000);

      nextHourELements += `
      <li>
        <span>${this.formatTime(date.getHours())}:${this.formatTime(date.getMinutes())}</span>
        <span>${data.weather[0].main} / ${data.temp}°C</span>
      </li>
      `;
    });

    this.rightScreenNextHours.innerHTML = nextHourELements;

    // Change right screen value -> next hourdays
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

    this.rightScreenNextDays.innerHTML = nextDayELements;

    // Hide loading screen after operation finished
    this.toggleHideView(this.loadingRoot, true);
  };

  /*
   * When user searchs a city
   */
  onSubmitForm = async (e) => {
    // Show loading screen
    e.preventDefault();
    this.toggleHideView(this.searchLoading, false);
    this.cityList.firstElementChild.innerHTML = "";

    // Call api to OpenWeather for searching a location
    const locations = await this.api.callGeocoding("direct", { city: e.target[0].value });

    if (locations.length > 0) {
      // Show location if exist
      let elements = "";

      // Create a list for ul
      locations.forEach((location) => {
        elements += `<li data-lon="${location.lon}" data-lat="${location.lat}" data-city="${location.name}" data-state="${location.state}" data-country="${location.country}" class="city">${location.name}, ${location.state}, ${location.country}</li>`;
      });
      this.cityList.firstElementChild.innerHTML = elements;

      // Add event listener when user chooses a city
      const cities = document.querySelectorAll(".city");
      cities.forEach((city) => city.addEventListener("click", this.changeCity));

      // Show the list
      this.toggleHideView(this.cityList, false);
    } else {
      // If there is no location
      alert("No location can be found!");
    }

    // Hide loading screen
    this.toggleHideView(this.searchLoading, true);
  };
}
