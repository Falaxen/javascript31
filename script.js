const API_KEY = "rc_live_60b6f79d87eb4e75a11d5d5432c91805";

const USE_CORS_PROXY = false;

const form = document.getElementById("search-form");
const input = document.getElementById("country-input");
const table = document.getElementById("countries-table");
const tableBody = document.getElementById("table-body");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();

  errorMessage.textContent = "";
  tableBody.innerHTML = "";
  table.style.display = "none";

  if (!query) return;

  let targetUrl = `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(query)}`;

  const fetchUrl = USE_CORS_PROXY
    ? `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    : targetUrl;

  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();

    console.log("Odpowiedź z API:", data);

    const countries = data.data?.objects || [];

    if (countries.length === 0) {
      errorMessage.textContent =
        "Nie znaleziono państw pasujących do zapytania.";
      return;
    }

    countries.forEach((country) => {
      const row = document.createElement("tr");

      const name = country.names?.common || "Brak danych";
      const capital = country.capitals?.[0]?.name || "Brak stolicy";
      const population =
        country.population !== undefined
          ? country.population.toLocaleString()
          : "Brak danych";
      const region = country.region || "Brak danych";
      const subregion = country.subregion || "Brak danych";

      row.innerHTML = `
                <td>${name}</td>
                <td>${capital}</td>
                <td>${population}</td>
                <td>${region}</td>
                <td>${subregion}</td>
            `;

      tableBody.appendChild(row);
    });

    table.style.display = "table";
  } catch (error) {
    console.error("Szczegóły błędu:", error);
    errorMessage.textContent = `Wystąpił błąd podczas pobierania danych: ${error.message}. Sprawdź poprawność klucza API lub otwórz aplikację w nowej karcie.`;
  }
});
