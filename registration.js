document.getElementById("nav-toggle").addEventListener("click", function () {
  document.getElementById("nav-menu").classList.toggle("active");
});
document.getElementById("nav-close").addEventListener("click", function () {
  document.getElementById("nav-menu").classList.remove("active");
});

document.addEventListener("DOMContentLoaded", function () {
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  const fetchAccessToken = async () => {
    const response = await fetch(
      "https://www.universal-tutorial.com/api/getaccesstoken",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "api-token":
            "r_L48V7DdCWhogl3EOQnO2bLOrYuzJHZO0LwKLllLGYMdxZ4TAliyACQwl5gK36sNkw",
          "user-email": "dcpsfoundation@gmail.com",
        },
      }
    );
    const data = await response.json();
    return data.auth_token;
  };

  const fetchStates = async (token) => {
    const response = await fetch(
      "https://www.universal-tutorial.com/api/states/India",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  };

  const fetchCities = async (token, state) => {
    const response = await fetch(
      `https://www.universal-tutorial.com/api/cities/${state}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  };

  const initializeForm = async () => {
    const token = await fetchAccessToken();

    const states = await fetchStates(token);
    states.forEach((state) => {
      const option = document.createElement("option");
      option.value = state.state_name;
      option.textContent = state.state_name;
      stateSelect.appendChild(option);
    });

    stateSelect.addEventListener("change", async function () {
      const state = stateSelect.value;
      citySelect.innerHTML = '<option value="">Select a city</option>';

      if (state) {
        const cities = await fetchCities(token, state);
        cities.forEach((city) => {
          const option = document.createElement("option");
          option.value = city.city_name;
          option.textContent = city.city_name;
          citySelect.appendChild(option);
        });
      }
    });
  };

  initializeForm();
});
