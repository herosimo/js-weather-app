export class Api {
  API_KEY = "10de9c34a8e3607e1892740e51edccca";
  API_URL = "http://api.openweathermap.org/";

  async callGeocoding(city) {
    const res = await fetch(
      `${this.API_URL}/geo/1.0/direct?q=${city}&limit=5&appid=${this.API_KEY}`
    );
    const data = await res.json();
    return data;
  }

  async callOneCall(lat, lon) {
    const res = await fetch(
      `${this.API_URL}data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts&units=metric&appid=${this.API_KEY}`
    );

    const data = await res.json();
    return data;
  }
}
