"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme";
import { cn } from "@/lib/utils";

/** Resolved concrete colors for Recharts SVG attributes. */
export interface ChartColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  destructive: string;
  muted: string;
  accent: string;
  card: string;
  border: string;
  foreground: string;
  mutedForeground: string;
  background: string;
}

/** Pre-hydration OKLCH fallbacks per theme (resolved live after mount). */
const FALLBACKS: { light: ChartColors; dark: ChartColors } = {
  light: {
    primary: "oklch(0.58 0.25 264)",
    secondary: "oklch(0.97 0 0)",
    success: "oklch(0.65 0.18 145)",
    warning: "oklch(0.83 0.18 85)",
    destructive: "oklch(0.577 0.245 27.325)",
    muted: "oklch(0.97 0 0)",
    accent: "oklch(0.72 0.15 165)",
    card: "oklch(1 0 0)",
    border: "oklch(0.922 0 0)",
    foreground: "oklch(0.145 0 0)",
    mutedForeground: "oklch(0.556 0 0)",
    background: "oklch(1 0 0)",
  },
  dark: {
    primary: "oklch(0.58 0.25 264)",
    secondary: "oklch(0.269 0 0)",
    success: "oklch(0.65 0.18 145)",
    warning: "oklch(0.83 0.18 85)",
    destructive: "oklch(0.704 0.191 22.216)",
    muted: "oklch(0.269 0 0)",
    accent: "oklch(0.72 0.15 165)",
    card: "oklch(0.205 0 0)",
    border: "oklch(1 0 0 / 10%)",
    foreground: "oklch(0.985 0 0)",
    mutedForeground: "oklch(0.708 0 0)",
    background: "oklch(0.145 0 0)",
  },
};

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/**
 * useChartColors — theme-aware concrete colors for Recharts.
 *
 * Recharts renders SVG attributes, which need resolved color
 * values (CSS `var()` references like the old `hsl(var(--…))`
 * strings never resolved — the tokens are OKLCH). This hook
 * reads the computed design tokens after mount and re-resolves
 * whenever the theme changes, so charts follow light/dark mode.
 * SSR-safe: returns light-mode fallbacks before hydration.
 */
export function useChartColors(): ChartColors {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<ChartColors>({ ...FALLBACKS.light });

  useEffect(() => {
    const fallback =
      resolvedTheme === "dark" ? FALLBACKS.dark : FALLBACKS.light;
    setColors({
      primary: readVar("--primary", fallback.primary),
      secondary: readVar("--secondary", fallback.secondary),
      success: readVar("--color-emerald", fallback.success),
      warning: readVar("--color-amber", fallback.warning),
      destructive: readVar("--destructive", fallback.destructive),
      muted: readVar("--muted", fallback.muted),
      accent: readVar("--accent", fallback.accent),
      card: readVar("--card", fallback.card),
      border: readVar("--border", fallback.border),
      foreground: readVar("--foreground", fallback.foreground),
      mutedForeground: readVar("--muted-foreground", fallback.mutedForeground),
      background: readVar("--background", fallback.background),
    });
  }, [resolvedTheme]);

  return colors;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
  [key: string]: string | number;
}

export interface HourlyPoint {
  hour: number;
  count: number;
  [key: string]: string | number;
}

interface BarChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  nameKey?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function SimpleBarChart({
  data,
  dataKey,
  nameKey = "name",
  height = 200,
  color,
  showGrid = false,
  showTooltip = true,
  className,
}: BarChartProps) {
  const theme = useChartColors();
  const resolvedColor = color ?? theme.primary;
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-[200px] text-muted-foreground",
          className,
        )}
      >
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.muted}
            vertical={false}
          />
        )}
        <XAxis
          dataKey={nameKey}
          tick={{ fontSize: 11, fill: theme.mutedForeground }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: theme.mutedForeground }}
          axisLine={false}
          tickLine={false}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              boxShadow: `0 4px 12px ${theme.border}`,
            }}
            labelStyle={{ color: theme.foreground }}
            formatter={(value: unknown) => [Number(value) || 0, dataKey]}
          />
        )}
        <Bar
          dataKey={dataKey}
          fill={resolvedColor}
          radius={[4, 4, 0, 0]}
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface LineChartProps {
  data: TimeSeriesPoint[];
  dataKey: string;
  nameKey?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showArea?: boolean;
  className?: string;
}

export function SimpleLineChart({
  data,
  dataKey,
  nameKey = "date",
  height = 250,
  color,
  showGrid = true,
  showTooltip = true,
  showArea = false,
  className,
}: LineChartProps) {
  const theme = useChartColors();
  const resolvedColor = color ?? theme.primary;
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-[250px] text-muted-foreground",
          className,
        )}
      >
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {showArea ? (
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.muted}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: theme.mutedForeground }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: theme.mutedForeground }}
            axisLine={false}
            tickLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                boxShadow: `0 4px 12px ${theme.border}`,
              }}
              labelStyle={{ color: theme.foreground }}
              formatter={(value: unknown) => [Number(value) || 0, dataKey]}
            />
          )}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={resolvedColor}
            fill={resolvedColor}
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      ) : (
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.muted}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: theme.mutedForeground }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: theme.mutedForeground }}
            axisLine={false}
            tickLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                boxShadow: `0 4px 12px ${theme.border}`,
              }}
              labelStyle={{ color: theme.foreground }}
              formatter={(value: unknown) => [Number(value) || 0, dataKey]}
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={resolvedColor}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: theme.background }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}

interface PieChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  nameKey?: string;
  height?: number;
  colors?: string[];
  showTooltip?: boolean;
  className?: string;
}

export function SimplePieChart({
  data,
  dataKey,
  nameKey = "name",
  height = 250,
  colors,
  showTooltip = true,
  className,
}: PieChartProps) {
  const theme = useChartColors();
  const resolvedColors = colors ?? [
    theme.primary,
    theme.secondary,
    theme.success,
    theme.warning,
    theme.destructive,
    theme.accent,
  ];
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-[250px] text-muted-foreground",
          className,
        )}
      >
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
          stroke={theme.background}
          strokeWidth={2}
        >
          {data.map((item, index) => (
            <Cell
              key={item.name ?? `cell-${index}`}
              fill={resolvedColors[index % resolvedColors.length]}
            />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              boxShadow: `0 4px 12px ${theme.border}`,
            }}
            formatter={(value: unknown) => [Number(value) || 0, dataKey]}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}

interface ComposedChartProps {
  data: TimeSeriesPoint[];
  bars: { dataKey: string; color: string; name: string }[];
  lines: { dataKey: string; color: string; name: string }[];
  nameKey?: string;
  height?: number;
  className?: string;
}

export function SimpleComposedChart({
  data,
  bars = [],
  lines = [],
  nameKey = "date",
  height = 250,
  className,
}: ComposedChartProps) {
  const theme = useChartColors();
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-[250px] text-muted-foreground",
          className,
        )}
      >
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={theme.muted}
          vertical={false}
        />
        <XAxis
          dataKey={nameKey}
          tick={{ fontSize: 11, fill: theme.mutedForeground }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: theme.mutedForeground }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            boxShadow: `0 4px 12px ${theme.border}`,
          }}
          labelStyle={{ color: theme.foreground }}
        />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.color}
            name={bar.name}
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        ))}
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            name={line.name}
            dot={{ r: 3, strokeWidth: 2, fill: theme.background }}
            activeDot={{ r: 5, strokeWidth: 2 }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

interface HorizontalBarChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  nameKey?: string;
  height?: number;
  color?: string;
  barSize?: number;
  className?: string;
}

export function SimpleHorizontalBarChart({
  data,
  dataKey,
  nameKey = "name",
  height,
  color,
  barSize = 30,
  className,
}: HorizontalBarChartProps) {
  const theme = useChartColors();
  const resolvedColor = color ?? theme.primary;
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-[200px] text-muted-foreground",
          className,
        )}
      >
        No data available
      </div>
    );
  }

  const calculatedHeight = height || Math.max(data.length * 35, 200);

  return (
    <ResponsiveContainer width="100%" height={calculatedHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={theme.muted}
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: theme.mutedForeground }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey={nameKey}
          tick={{ fontSize: 11, fill: theme.mutedForeground }}
          axisLine={false}
          tickLine={false}
          width={140}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            boxShadow: `0 4px 12px ${theme.border}`,
          }}
          formatter={(value: unknown) => [Number(value) || 0, dataKey]}
        />
        <Bar
          dataKey={dataKey}
          fill={resolvedColor}
          radius={[0, 4, 4, 0]}
          barSize={barSize}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
