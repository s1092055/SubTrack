import { useState, useEffect } from "react";

export function useExchangeRate(currency, onFetchError) {
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    if (currency !== "USD" || exchangeRate !== null) return;
    fetch("https://open.er-api.com/v6/latest/TWD")
      .then((res) => res.json())
      .then((data) => setExchangeRate(data.rates.USD))
      .catch(() => onFetchError?.());
  }, [currency, exchangeRate, onFetchError]);

  return exchangeRate;
}
