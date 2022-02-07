const toggleHideView = (element, show) => {
  element.classList.toggle("hide", show);
};

export const initApp = (api) => {
  const searchForm = document.querySelector("#search");
  const cityList = document.querySelector(".city-list");
  const weatherDetails = document.querySelector(".weather-details");

  const onSubmitForm = async (e) => {
    e.preventDefault();

    cityList.firstElementChild.innerHTML = "";
    let elements = "";

    const locations = await api.callGeocoding(e.target[0].value);
    locations.forEach((location) => {
      elements += `<li data-lon="${location.lon}" data-lat="${location.lat}" class="city">${location.name}, ${location.state}, ${location.country}</li>`;
    });

    cityList.firstElementChild.innerHTML = elements;

    const cities = document.querySelectorAll(".city");
    cities.forEach((city) => city.addEventListener("click", onClickCity));
    toggleHideView(cityList, false);
  };

  const onClickCity = async (e) => {
    const data = await api.callOneCall(e.target.dataset.lat, e.target.dataset.lon);
    console.log(data);
  };

  toggleHideView(cityList, true);
  toggleHideView(weatherDetails, true);

  searchForm.addEventListener("submit", onSubmitForm);
};
