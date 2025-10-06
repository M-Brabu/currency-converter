document.addEventListener("DOMContentLoaded", async () => {
  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");
  const resultBox = document.getElementById("result");
  const convertBtn = document.getElementById("convert-btn");

  let currencyRates = {};

  async function loadCurrencies() {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();

      if (!data.rates) {
        resultBox.textContent = "⚠️ Failed to load currencies.";
        return;
      }

      currencyRates = data.rates;

      const codes = Object.keys(currencyRates).sort();
      codes.forEach(code => {
        const option1 = document.createElement("option");
        const option2 = document.createElement("option");
        option1.value = option2.value = code;
        option1.textContent = option2.textContent = code;
        fromSelect.appendChild(option1);
        toSelect.appendChild(option2);
      });

      fromSelect.value = "USD";
      toSelect.value = "INR";
      resultBox.textContent = "✅ Currencies loaded successfully!";
    } catch (err) {
      console.error(err);
      resultBox.textContent = "⚠️ Error loading currency data.";
    }
  }

  function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
      resultBox.textContent = "⚠️ Please enter a valid amount.";
      return;
    }

    if (!currencyRates[from] || !currencyRates[to]) {
      resultBox.textContent = "⚠️ Currencies not loaded yet.";
      return;
    }

    const usdAmount = amount / currencyRates[from]; 
    const converted = usdAmount * currencyRates[to]; 
    resultBox.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
  }

  convertBtn.addEventListener("click", convertCurrency);
  await loadCurrencies();
});
