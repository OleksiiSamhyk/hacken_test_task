import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { tsxLanguage } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Title from "antd/es/typography/Title";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>

    <Title>App source code</Title>

    <CodeMirror
      value={`import { FC, useState } from "react";

import Title from "antd/es/typography/Title";
import {
  Flex,
  Modal,
  Select,
  Space,
  Table,
  TableProps,
  Typography,
} from "antd";

import { useQuery } from "@tanstack/react-query";

import { DefaultOptionType } from "antd/es/select";
import { Image as AntdImage } from "antd";
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
    const res = await fetch(API_URL + '/coins/markets?' + searchParams);

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

interface DataType {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number | null;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: number | null;
  symbol: string;
  total_supply: number;
  total_volume: number;
}

const CoinFullInfo: FC<{ info: DataType }> = ({ info }) => {
  const { image, ...rest } = info;

  const noramlazedCoinInfo = Object.entries(rest).map(([key, value]) => {
    return [key.replace(/_/g, " "), value];
  });

  return (
    <>
      <div style={{ margin: "0 auto", width: "fit-content" }}>
        <AntdImage src={image} />
      </div>
      {noramlazedCoinInfo.map(([key, value]) => {
        return (
          <Flex key={key} style={{ marginTop: "4px" }} gap="8px">
            <Typography.Text strong style={{ textTransform: "capitalize" }}>
              {key}:{" "}
            </Typography.Text>
            <Typography.Text>{value}</Typography.Text>
          </Flex>
        );
      })}
    </>
  );
};

function App() {
  const [queryParams, setQueryParams] = useState<CoinMarketsParams>({
    order: "market_cap_asc",
    page: 1,
    per_page: 10,
    vs_currency: "usd",
  });
  const [modalData, setModalData] = useState<DataType | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["coinMarkets", queryParams],
    queryFn: () => fetchCoinsMarkets(queryParams),
  });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, data) => (
        <Flex gap="8px">
          <img width={32} height={32} src={data.image} />
          <Typography.Text style={{ lineHeight: "32px" }}>
            {name}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Current Price",
      dataIndex: "current_price",
      key: "current_price",
    },
    {
      title: "Circulating Supply",
      dataIndex: "circulating_supply",
      key: "circulating_supply",
    },
    {
      title: "Actions",
      dataIndex: "name",
      key: "actions",
      render: (_, data) => (
        <Space size="middle">
          <a
            onClick={(e) => {
              e.preventDefault();
              setModalData(data);
            }}
          >
            Show more
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title>Coins & Markets</Title>
      <Flex gap="24px">
        <Flex gap="6px">
          <Typography.Text style={{ lineHeight: "32px" }}>
            Currency:
          </Typography.Text>
          <Select<Currency, DefaultOptionType & { value: Currency }>
            defaultValue={queryParams.vs_currency}
            style={{ width: 120 }}
            onChange={(value) =>
              setQueryParams((prev) => ({ ...prev, vs_currency: value }))
            }
            options={[
              { value: "usd", label: "USD" },
              { value: "eur", label: "EUR" },
            ]}
          />
        </Flex>
        <Flex gap="6px">
          <Typography.Text style={{ lineHeight: "32px" }}>
            Sort by:
          </Typography.Text>
          <Select<
            MarketCupOrdering,
            DefaultOptionType & { value: MarketCupOrdering }
          >
            defaultValue={queryParams.order}
            style={{ width: 200 }}
            onChange={(value) =>
              setQueryParams((prev) => ({ ...prev, order: value }))
            }
            options={[
              { value: "market_cap_asc", label: "Market cap ascnding" },
              { value: "market_cap_desc", label: "Market cap descending" },
            ]}
          />
        </Flex>
      </Flex>
      <Table
        columns={columns}
        pagination={{
          total: 10000,
          onShowSizeChange: (page, size) =>
            setQueryParams((prev) => ({ ...prev, page, per_page: size })),
          defaultPageSize: queryParams.per_page,
          onChange: (value) =>
            setQueryParams((prev) => ({ ...prev, page: value })),
        }}
        loading={isLoading}
        dataSource={data}
      />
      <Modal
        title={modalData?.name}
        open={!!modalData}
        onClose={() => setModalData(null)}
        onOk={() => setModalData(null)}
        okText="Close"
        cancelButtonProps={{ style: { visibility: "hidden" } }}
      >
        {modalData && <CoinFullInfo info={modalData} />}
      </Modal>
    </>
  );
}

export default App;
`}
      height="800px"
      extensions={[tsxLanguage]}
      onChange={() => {}}
    />
    <div style={{ marginTop: "24px" }} />
  </StrictMode>
);
