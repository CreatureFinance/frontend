import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/share/trading-view-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  CandlestickData,
  createChart,
  CrosshairMode,
  IChartApi,
  MouseEventParams,
  UTCTimestamp,
  LocalizationOptionsBase,
  LocalizationOptions,
} from "lightweight-charts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/components/providers/store-provider";
import { getCssVariableColor } from "@/utils/tools";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";

type TimeRange = "1m" | "5m" | "15m" | "1h" | "4h" | "1D" | "1W" | "1M";
type KLine = {
  open: number;
  close: number;
  high: number;
  low: number;
  change: number;
  percent: number;
};

const TradingViewChart: React.FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  const [klineInfo, setKlineInfo] = useState<KLine | null>(null);
  const walletName = useStore((state) => state.wallet.walletName);
  const { open, close, high, low, change, percent } = klineInfo ?? {};

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const { width, height } =
          chartContainerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const generateData = (range: TimeRange) => {
    const now = new Date();
    const data: Array<{
      time: UTCTimestamp;
      open: number;
      high: number;
      low: number;
      close: number;
    }> = [];
    let intervalsToGenerate = 0;
    let intervalInMinutes = 1;

    switch (range) {
      case "1m":
        intervalsToGenerate = 60 * 24; // 1 day worth of 1-minute data
        intervalInMinutes = 1;
        break;
      case "5m":
        intervalsToGenerate = 12 * 24; // 1 day worth of 5-minute data
        intervalInMinutes = 5;
        break;
      case "15m":
        intervalsToGenerate = 4 * 24; // 1 day worth of 15-minute data
        intervalInMinutes = 15;
        break;
      case "1h":
        intervalsToGenerate = 24 * 7; // 1 week worth of 1-hour data
        intervalInMinutes = 60;
        break;
      case "4h":
        intervalsToGenerate = 6 * 7; // 1 week worth of 4-hour data
        intervalInMinutes = 240;
        break;
      case "1D":
        intervalsToGenerate = 30; // 1 month worth of daily data
        intervalInMinutes = 1440;
        break;
      case "1W":
        intervalsToGenerate = 52; // 1 year worth of weekly data
        intervalInMinutes = 10080;
        break;
      case "1M":
        intervalsToGenerate = 12; // 1 year worth of monthly data
        intervalInMinutes = 43200;
        break;
    }

    for (let i = intervalsToGenerate; i > 0; i--) {
      const date = new Date(now.getTime() - i * intervalInMinutes * 60 * 1000);
      const prevClose = data.length > 0 ? data[data.length - 1].close : 100;
      const change =
        (Math.random() - 0.5) * (0.1 * Math.sqrt(intervalInMinutes));
      const open = prevClose + change;
      const close =
        open + (Math.random() - 0.5) * (0.05 * Math.sqrt(intervalInMinutes));
      data.push({
        time: (date.getTime() / 1000) as UTCTimestamp,
        open: open,
        high:
          Math.max(open, close) +
          Math.random() * (0.02 * Math.sqrt(intervalInMinutes)),
        low:
          Math.min(open, close) -
          Math.random() * (0.02 * Math.sqrt(intervalInMinutes)),
        close: close,
      });
    }
    return data;
  };

  useEffect(() => {
    if (
      chartContainerRef.current &&
      containerSize.width > 0 &&
      containerSize.height > 0
    ) {
      const backgroundColor = getCssVariableColor("--background");
      const wickUpColor = getCssVariableColor("--wick-up-color");
      const wickDownColor = getCssVariableColor("--wick-down-color");

      const localizationOptions: LocalizationOptions<UTCTimestamp> = {
        locale: language,
        dateFormat: getChartDateFormat(language),
      };

      const chart = createChart(chartContainerRef.current, {
        width: containerSize.width,
        height: containerSize.height,
        layout: {
          background: { color: `hsl(${backgroundColor})` },
          textColor: "#d1d4dc",
        },
        grid: {
          vertLines: { color: "rgba(42, 46, 57, 0.5)" },
          horzLines: { color: "rgba(42, 46, 57, 0.5)" },
        },
        rightPriceScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
        },
        timeScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        localization: localizationOptions,
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: wickUpColor,
        downColor: wickDownColor,
        borderVisible: false,
        wickUpColor: wickUpColor,
        wickDownColor: wickDownColor,
      });

      const data = generateData(timeRange);
      candlestickSeries.setData(data);

      // 顯示最新 K 線資訊
      const lastKline = data[data.length - 1];
      updateKlineInfo(lastKline);

      // 滑鼠移動到 K 線上顯示資訊
      const handleCrosshairMove = (param: MouseEventParams) => {
        const { time, point, seriesData } = param;
        const { width, height } = chart.options();

        if (
          time &&
          point &&
          point.x >= 0 &&
          point.x <= width &&
          point.y >= 0 &&
          point.y <= height
        ) {
          const hoveredKline = seriesData.get(
            candlestickSeries,
          ) as CandlestickData;
          if (hoveredKline) {
            updateKlineInfo(hoveredKline);
          }
        } else {
          // 當滑鼠移出圖表時，顯示最新 K 線資訊
          updateKlineInfo(lastKline);
        }
      };

      chart.subscribeCrosshairMove(handleCrosshairMove);

      chartRef.current = chart;

      return () => {
        chart.unsubscribeCrosshairMove(handleCrosshairMove);
        chart.remove();
      };
    }
  }, [containerSize, timeRange]);

  const updateKlineInfo = (kline: CandlestickData) => {
    const { open, high, low, close } = kline;
    const change = close - open;
    const percent = (change / open) * 100;

    setKlineInfo({
      open: Number(open.toFixed(4)),
      close: Number(close.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      change: Number(change.toFixed(4)),
      percent: Number(percent.toFixed(4)),
    });
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <div className="mb-1 flex h-full w-full flex-col bg-background">
      <div className="flex h-12 shrink-0 items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <div className="cursor-pointer rounded-md p-[6px] hover:bg-secondary/80">
                <Avatar className="h-8 w-8 text-foreground">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{walletName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
            </PopoverTrigger>
            <PopoverContent side="right"></PopoverContent>
          </Popover>

          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <div className="h-full cursor-pointer rounded-md p-2 hover:bg-secondary/80">
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
            </div>
            <SelectContent>
              {["1m", "5m", "15m", "1h", "4h", "1D", "1W", "1M"].map(
                (range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator className="h-1" />
      <div className="relative h-full w-full">
        <div
          ref={chartContainerRef}
          style={{
            flexGrow: 1,
            width: "100%",
            height: "100%",
          }}
        />
        <div className="absolute left-4 top-4 z-50">
          <h2 className="flex items-center gap-1 text-sm">
            {[
              { label: "chart-open", value: open },
              { label: "chart-high", value: high },
              { label: "chart-low", value: low },
              { label: "chart-close", value: close },
            ].map(({ label, value }) => (
              <React.Fragment key={label}>
                <span>
                  {t(label)}
                  <span
                    className={
                      percent && percent > 0
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {value}
                  </span>
                </span>
              </React.Fragment>
            ))}
            <span
              className={
                (percent ?? 0) > 0 ? "text-emerald-500" : "text-red-500"
              }
            >
              {change}
              {` (${percent})`}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;

const getChartDateFormat = (locale: string) => {
  switch (locale) {
    case "zh-TW":
      return "yyyy-MM-dd";
    case "en":
    default:
      return "dd MMM 'yy";
  }
};
