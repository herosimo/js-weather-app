function t(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}const e=new class{async callGeocoding(t,e){let i,o;switch(t){case"direct":i=await fetch(`${this.OWM_API_URL}/geo/1.0/direct?q=${e.city}&limit=5&appid=${this.OWM_API_KEY}`),o=await i.json();break;case"reverse":i=await fetch(`${this.OWM_API_URL}/geo/1.0/reverse?lat=${e.lat}&lon=${e.lon}&limit=5&appid=${this.OWM_API_KEY}`),o=await i.json()}return o}async callOneCall(t,e){const i=await fetch(`${this.OWM_API_URL}data/2.5/onecall?lat=${t}&lon=${e}&exclude=alerts,minutely&units=metric&appid=${this.OWM_API_KEY}`);return await i.json()}async callAirPollution(t,e){const i=await fetch(`${this.OWM_API_URL}data/2.5/air_pollution?lat=${t}&lon=${e}&appid=${this.OWM_API_KEY}`);return await i.json()}async searchPhoto(t){const e=await fetch(`${this.UN_API_URL}search/photos?query=${t}&page=1&per_page=1&order_by=relevant&orientation=landscape&client_id=${this.UN_API_KEY}`);return await e.json()}constructor(){t(this,"OWM_API_KEY","10de9c34a8e3607e1892740e51edccca"),t(this,"OWM_API_URL","https://api.openweathermap.org/"),t(this,"UN_API_KEY","rCmYU-DnVhWNujnJdRl7OHw9R5_OnMbr9whez_VeDqk"),t(this,"UN_API_URL","https://api.unsplash.com/")}};new class{toggleHideView(t,e){t.classList.toggle("hide",e)}formatTime(t){return("0"+t).slice(-2)}checkUserLocation(){const t=()=>{this.changeCity({coords:{latitude:"51.5073219",longitude:"-0.1276474",city:"London",state:"England",country:"GB"}})};navigator.geolocation?navigator.geolocation.getCurrentPosition((async t=>{let e=await this.api.callGeocoding("reverse",{lat:t.coords.latitude,lon:t.coords.longitude}),i={coords:{latitude:t.coords.latitude,longitude:t.coords.longitude,city:e[0].name,state:e[0].state,country:e[0].country}};this.changeCity(i)}),t):t()}constructor(e){t(this,"changeCity",(async t=>{var e,i,o,n,r,a,l,s,c,h,d,u,g,_,m;this.toggleHideView(this.modal,!0),this.toggleHideView(this.loadingRoot,!1);let y=(null===(e=t.target)||void 0===e||null===(i=e.dataset)||void 0===i?void 0:i.lat)||(null===(o=t.coords)||void 0===o?void 0:o.latitude),S=(null===(n=t.target)||void 0===n||null===(r=n.dataset)||void 0===r?void 0:r.lon)||(null===(a=t.coords)||void 0===a?void 0:a.longitude),$=(null===(l=t.target)||void 0===l||null===(s=l.dataset)||void 0===s?void 0:s.city)||(null===(c=t.coords)||void 0===c?void 0:c.city),p=(null===(h=t.target)||void 0===h||null===(d=h.dataset)||void 0===d?void 0:d.state)||(null===(u=t.coords)||void 0===u?void 0:u.state),w=(null===(g=t.target)||void 0===g||null===(_=g.dataset)||void 0===_?void 0:_.country)||(null===(m=t.coords)||void 0===m?void 0:m.country);const f=await this.api.callOneCall(y,S),v=await this.api.callAirPollution(y,S),L=await this.api.searchPhoto(p);this.container.style.backgroundImage=`linear-gradient(rgba(87, 87, 87, 0.5), rgba(87, 87, 87, 0.5)), url("${L.results[0].urls.regular}")`;let q=new Date(1e3*f.current.dt);this.leftScreenTemp.innerText=`${f.current.temp}°C`,this.leftScreenTitle.innerText=f.current.weather[0].main,this.leftScreenSubtitle.innerText=f.current.weather[0].description,this.leftScreenFl.innerText=`Feels like ${f.current.feels_like}°C`,this.leftScreenDate.innerText=`${this.formatTime(q.getHours())}:${this.formatTime(q.getMinutes())} - ${q.toLocaleDateString("en-US",{weekday:"long"})}, ${q.getDate()} ${q.toLocaleDateString("en-US",{month:"long"})} ${q.getFullYear()}`,this.leftScreenLocation.innerText=`${$}, ${p}, ${w}`;let b=f.current.visibility/1e3,T=3600*f.current.wind_speed/1e3,H=v.list[0].main.aqi;this.rightScreenAqi.innerText=`${H} / ${["Good","Fair","Moderate","Poor","Very Poor"][H-1]}`,this.rightScreenHumidity.innerText=`${f.current.humidity}%`,this.rightScreenPressure.innerText=`${f.current.pressure}hPa`,this.rightScreenUvi.innerText=`${f.current.uvi}`,this.rightScreenClouds.innerText=`${f.current.clouds}%`,this.rightScreenVisibility.innerText=`${b.toFixed(1)}km`,this.rightScreenWind.innerText=`${T.toFixed(1)}km/h`;let P="";f.hourly.slice(0,18).forEach((t=>{let e=new Date(1e3*t.dt);P+=`\n      <li>\n        <span>${this.formatTime(e.getHours())}:${this.formatTime(e.getMinutes())}</span>\n        <span>${t.weather[0].main} / ${t.temp}°C</span>\n      </li>\n      `})),this.rightScreenNextHours.innerHTML=P;let x="";f.daily.forEach((t=>{let e=new Date(1e3*t.dt);x+=`\n      <li>\n        <span>${e.toLocaleDateString("en-US",{weekday:"long"})}, ${e.getDate()} ${e.toLocaleDateString("en-US",{month:"long"})} ${e.getFullYear()}</span>\n        <span>${t.weather[0].main} / ${t.temp.min}°C / ${t.temp.max}°C</span>\n      </li>\n      `})),this.rightScreenNextDays.innerHTML=x,this.toggleHideView(this.loadingRoot,!0)})),t(this,"onSubmitForm",(async t=>{t.preventDefault(),this.toggleHideView(this.searchLoading,!1),this.cityList.firstElementChild.innerHTML="";const e=await this.api.callGeocoding("direct",{city:t.target[0].value});if(e.length>0){let t="";e.forEach((e=>{t+=`<li data-lon="${e.lon}" data-lat="${e.lat}" data-city="${e.name}" data-state="${e.state}" data-country="${e.country}" class="city">${e.name}, ${e.state}, ${e.country}</li>`})),this.cityList.firstElementChild.innerHTML=t;document.querySelectorAll(".city").forEach((t=>t.addEventListener("click",this.changeCity))),this.toggleHideView(this.cityList,!1)}else alert("No location can be found!");this.toggleHideView(this.searchLoading,!0)})),this.api=e,this.searchIcon=document.querySelector(".left__top__searchIcon"),this.searchForm=document.querySelector(".search"),this.searchLoading=document.querySelector(".search__loading"),this.modal=document.querySelector(".modal"),this.cityList=document.querySelector(".city-list"),this.loadingRoot=document.querySelector(".loading-root"),this.container=document.querySelector(".container"),this.leftScreenTemp=document.querySelector(".left__bottom__temp span"),this.leftScreenTitle=document.querySelector(".left__bottom__temp h2"),this.leftScreenSubtitle=document.querySelector(".left__bottom__temp p"),this.leftScreenFl=document.querySelector(".left__bottom__fl"),this.leftScreenDate=document.querySelector(".left__bottom__footer__date"),this.leftScreenLocation=document.querySelector(".left__bottom__footer__location"),this.rightScreenAqi=document.querySelector(".right__details__aqi"),this.rightScreenHumidity=document.querySelector(".right__details__humidity"),this.rightScreenPressure=document.querySelector(".right__details__pressure"),this.rightScreenUvi=document.querySelector(".right__details__uvi"),this.rightScreenClouds=document.querySelector(".right__details__clouds"),this.rightScreenVisibility=document.querySelector(".right__details__visibility"),this.rightScreenWind=document.querySelector(".right__details__wind"),this.rightScreenNextHours=document.querySelector(".right__nextHours"),this.rightScreenNextDays=document.querySelector(".right__nextDays"),this.toggleHideView(this.searchLoading,!0),this.toggleHideView(this.cityList,!0),this.toggleHideView(this.modal,!0),this.toggleHideView(this.loadingRoot,!0),window.onload=()=>this.checkUserLocation(),this.searchForm.addEventListener("submit",this.onSubmitForm),this.searchIcon.addEventListener("click",(()=>this.toggleHideView(this.modal,!1))),this.modal.addEventListener("click",(t=>{!t.target.matches(".close")&&t.target.closest(".modal__container")||this.toggleHideView(this.modal,!0)}))}}(e);
//# sourceMappingURL=index.73781ffb.js.map