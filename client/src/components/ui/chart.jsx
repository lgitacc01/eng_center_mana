"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";

// ========== CONTEXT ==========
const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

// ========== CONTAINER ==========
function ChartContainer({ id, className, children, config, ...props }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-surface]:outline-hidden",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ========== STYLE ==========
const THEMES = {
  light: "",
  dark: ".dark",
};

function ChartStyle({ id, config }) {
  if (!config || typeof config !== "object") return null;
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item.theme || item.color
  );
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const vars = colorConfig
              .map(([key, item]) => {
                const color =
                  (item.theme && item.theme[theme]) || item.color;
                return color ? `  --color-${key}: ${color};` : "";
              })
              .join("\n");
            return `${prefix} [data-chart=${id}] {\n${vars}\n}`;
          })
          .join("\n"),
      }}
    />
  );
}

// ========== TOOLTIP ==========
const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  const [item] = payload;
  const key = labelKey || item?.dataKey || item?.name || "value";
  const itemConfig = getPayloadConfigFromPayload(config, item, key);

  const tooltipLabel =
    hideLabel || !payload?.length ? null : (
      <div className={cn("font-medium", labelClassName)}>
        {labelFormatter
          ? labelFormatter(itemConfig?.label || label, payload)
          : itemConfig?.label || label}
      </div>
    );

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((p, index) => {
          const key = nameKey || p.name || p.dataKey || "value";
          const conf = getPayloadConfigFromPayload(config, p, key);
          const indicatorColor = color || p.payload?.fill || p.color;

          return (
            <div
              key={key + index}
              className={cn("flex w-full items-center gap-2")}
            >
              {!hideIndicator && (
                <div
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: indicatorColor }}
                />
              )}
              <div className="flex flex-1 justify-between">
                <span>{conf?.label || p.name}</span>
                <span className="text-foreground font-mono font-medium">
                  {p.value?.toLocaleString?.() ?? p.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== LEGEND ==========
const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, index) => {
        const key = nameKey || item.dataKey || "value";
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value + index}
            className="flex items-center gap-1.5"
          >
            {!hideIcon && (
              <div
                className="h-2 w-2 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// ========== HELPER ==========
function getPayloadConfigFromPayload(config, payload, key) {
  if (!config || typeof config !== "object") return undefined;
  return config[key] || {};
}

// ========== EXPORT ==========
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
