import { notification } from "antd";

function recordToSearchParams(
  record: Record<string, string | number | boolean>
) {
  return new URLSearchParams(
    Object.entries(record).map(([key, value]) => [key, value.toString()])
  );
}

export type Currency = "usd" | "eur";
export type MarketCupOrdering = "market_cap_desc" | "market_cap_asc";

export type CoinMarketsParams = {
  vs_currency: Currency;
  order: MarketCupOrdering;
  page: number;
  per_page: number;
};

export const fetchCoinsMarkets = async (params: CoinMarketsParams) => {
  const API_URL = "https://api.coingecko.com/api/v3";

  const searchParams = recordToSearchParams({ ...params, sparkline: "false" });

  try {
    const res = await fetch(`${API_URL}/coins/markets?${searchParams}`);

    if (res.ok) {
      return res.json();
    }

    throw new Error("Request failed with" + res.status);
  } catch (e) {
    const err = e as Error;
    notification.error({
      message: err.message + "Please wait and try aagin later",
    });
  }
};
