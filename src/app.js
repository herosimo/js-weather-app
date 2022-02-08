export class App {
  constructor(api) {
    this.api = api;

    this.searchForm = document.querySelector(".search");
    this.searchLoading = document.querySelector(".search__loading");
    this.cityList = document.querySelector(".city-list");
    this.weatherDetails = document.querySelector(".weather-details__content");
    this.weatherDetailsLoading = document.querySelector(".weather-details__loading");

    this.toggleHideView(this.searchLoading, true);
    this.toggleHideView(this.cityList, true);
    this.toggleHideView(this.weatherDetails, true);
    this.toggleHideView(this.weatherDetailsLoading, true);

    this.searchForm.addEventListener("submit", this.onSubmitForm);
  }

  toggleHideView(element, show) {
    element.classList.toggle("hide", show);
  }

  onClickCity = async (e) => {
    this.toggleHideView(this.weatherDetailsLoading, false);

    const oneCallData = await this.api.callOneCall(e.target.dataset.lat, e.target.dataset.lon);
    const AirPollutionData = await this.api.callAirPollution(
      e.target.dataset.lat,
      e.target.dataset.lon
    );
    console.log("a", oneCallData);
    console.log(AirPollutionData);
    this.toggleHideView(this.weatherDetailsLoading, true);
    this.toggleHideView(this.weatherDetails, false);
  };

  onSubmitForm = async (e) => {
    e.preventDefault();
    this.toggleHideView(this.searchLoading, false);
    this.cityList.firstElementChild.innerHTML = "";

    const locations = await this.api.callGeocoding(e.target[0].value);

    if (locations.length > 0) {
      let elements = "";

      locations.forEach((location) => {
        elements += `<li data-lon="${location.lon}" data-lat="${location.lat}" class="city">${location.name}, ${location.state}, ${location.country}</li>`;
      });

      this.cityList.firstElementChild.innerHTML = elements;

      const cities = document.querySelectorAll(".city");
      cities.forEach((city) => city.addEventListener("click", this.onClickCity));
      this.toggleHideView(this.cityList, false);
    } else {
      alert("no result");
    }

    this.toggleHideView(this.searchLoading, true);
  };
}
