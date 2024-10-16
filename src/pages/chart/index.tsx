import TradingViewChart from "@/components/share/trading-view-chart";
import { getI18nProps } from "@/utils/i18n";
import React from "react";

const Chart = () => {
  return (
    <div className="flex h-screen w-screen">
      <TradingViewChart />
    </div>
  );
};

export default Chart;

export const getStaticProps = getI18nProps;
