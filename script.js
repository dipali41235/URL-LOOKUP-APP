function handleKeyPress(event) {
  if (event.key === "Enter") {
    lookupURL();
  }
}

async function lookupURL() {
  const urlInput = document.getElementById("urlInput");
  const url = urlInput.value.trim();
  const resultCard = document.getElementById("result");
  const errorDiv = document.getElementById("error");
  const loading = document.getElementById("loading");
  const searchBtn = document.getElementById("searchBtn");

  // Reset states
  resultCard.classList.add("hidden");
  errorDiv.classList.add("hidden");
  document.getElementById("disclaimer").classList.add("hidden");
  loading.classList.remove("hidden");
  searchBtn.disabled = true;
  searchBtn.textContent = "Analyzing..."

  if (!url) {
    showError("Please enter a valid URL or domain name.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/urllookup?url=${encodeURIComponent(url)}`,
      {
        headers: { "X-Api-Key": "hKet4JwkoNuRDFTiZmRatQ==YZD7DT6vrhZZ4Iq2" },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    loading.classList.add("hidden");
    searchBtn.disabled = false;
    searchBtn.textContent = "Analyze";

    if (!data) {
      showError("No data received from the API. Please try again.");
      return;
    }

    // Populate results
    document.getElementById("res-url").textContent = data.url || url;

    const validElement = document.getElementById("res-valid");
    if (data.is_valid) {
      validElement.textContent = "Valid";
      validElement.className =
        "status-valid px-3 py-1 rounded-full text-xs font-medium inline-block";
    } else {
      validElement.textContent = "Invalid";
      validElement.className =
        "status-invalid px-3 py-1 rounded-full text-xs font-medium inline-block";
    }

    document.getElementById("res-isp").textContent =
      data.isp || "Not available";
    document.getElementById("res-city").textContent =
      data.city || "Not available";
    document.getElementById("res-region").textContent = data.region
      ? `${data.region}${data.region_code ? ` (${data.region_code})` : ""}`
      : "Not available";
    document.getElementById("res-country").textContent = data.country
      ? `${data.country}${data.country_code ? ` (${data.country_code})` : ""}`
      : "Not available";
    document.getElementById("res-zip").textContent =
      data.zip || "Not available";

    const coordinates =
      data.lat && data.lon ? `${data.lat}, ${data.lon}` : "Not available";
    document.getElementById("res-coordinates").textContent = coordinates;

    document.getElementById("res-timezone").textContent =
      data.timezone || "Not available";

    resultCard.classList.remove("hidden");

    // Scroll to results on mobile
    setTimeout(() => {
      resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  } catch (error) {
    console.error("Lookup error:", error);
    showError(
      "Unable to analyze the URL. Please check your connection and try again."
    );
  }
}

function showError(message) {
  const errorDiv = document.getElementById("error");
  const errorMessage = document.getElementById("errorMessage");
  const loading = document.getElementById("loading");
  const searchBtn = document.getElementById("searchBtn");

  loading.classList.add("hidden");
  errorMessage.textContent = message;
  errorDiv.classList.remove("hidden");
  searchBtn.disabled = false;
  searchBtn.textContent = "Analyze";

  // Show disclaimer again when there's an error
  document.getElementById("disclaimer").classList.remove("hidden");
}



