export class Api {
  OWM_API_KEY = "10de9c34a8e3607e1892740e51edccca";
  OWM_API_URL = "https://api.openweathermap.org/";

  UN_API_KEY = "rCmYU-DnVhWNujnJdRl7OHw9R5_OnMbr9whez_VeDqk";
  UN_API_URL = "https://api.unsplash.com/";

  async callGeocoding(mode, loc) {
    let res, data;

    switch (mode) {
      case "direct":
        res = await fetch(
          `${this.OWM_API_URL}/geo/1.0/direct?q=${loc.city}&limit=5&appid=${this.OWM_API_KEY}`
        );
        data = await res.json();
        break;

      case "reverse":
        res = await fetch(
          `${this.OWM_API_URL}/geo/1.0/reverse?lat=${loc.lat}&lon=${loc.lon}&limit=5&appid=${this.OWM_API_KEY}`
        );
        data = await res.json();
        break;
    }

    return data;
  }

  async callOneCall(lat, lon) {
    const res = await fetch(
      `${this.OWM_API_URL}data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts,minutely&units=metric&appid=${this.OWM_API_KEY}`
    );

    const data = await res.json();
    return data;
  }

  async callAirPollution(lat, lon) {
    const res = await fetch(
      `${this.OWM_API_URL}data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.OWM_API_KEY}`
    );

    const data = await res.json();
    return data;
  }

  async searchPhoto(loc) {
    const res = await fetch(
      `${this.UN_API_URL}search/photos?query=${loc}&page=1&per_page=1&order_by=relevant&orientation=landscape&client_id=${this.UN_API_KEY}`
    );

    const data = await res.json();
    return data;
  }
}
