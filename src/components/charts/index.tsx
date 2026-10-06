"use client";

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
import { cn } from "@/lib/utils";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  muted: "hsl(var(--muted))",
  accent: "hsl(var(--accent))",
};

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
  color = COLORS.primary,
  showGrid = false,
  showTooltip = true,
  className,
}: BarChartProps) {
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
            stroke="hsl(var(--muted))"
            vertical={false}
          />
        )}
        <XAxis
          dataKey={nameKey}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 12px hsl(var(--border))",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: unknown) => [Number(value) || 0, dataKey]}
          />
        )}
        <Bar
          dataKey={dataKey}
          fill={color}
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
  color = COLORS.primary,
  showGrid = true,
  showTooltip = true,
  showArea = false,
  className,
}: LineChartProps) {
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
              stroke="hsl(var(--muted))"
              vertical={false}
            />
          )}
          <XAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px hsl(var(--border))",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: unknown) => [Number(value) || 0, dataKey]}
            />
          )}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={color}
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
              stroke="hsl(var(--muted))"
              vertical={false}
            />
          )}
          <XAxis
            dataKey={nameKey}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px hsl(var(--border))",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: unknown) => [Number(value) || 0, dataKey]}
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
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

const DEFAULT_PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.destructive,
  COLORS.accent,
];

export function SimplePieChart({
  data,
  dataKey,
  nameKey = "name",
  height = 250,
  colors = DEFAULT_PIE_COLORS,
  showTooltip = true,
  className,
}: PieChartProps) {
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
          stroke="hsl(var(--background))"
          strokeWidth={2}
        >
          {data.map((item, index) => (
            <Cell
              key={item.name ?? `cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 12px hsl(var(--border))",
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
          stroke="hsl(var(--muted))"
          vertical={false}
        />
        <XAxis
          dataKey={nameKey}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 12px hsl(var(--border))",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
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
            dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--background))" }}
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
  color = COLORS.primary,
  barSize = 30,
  className,
}: HorizontalBarChartProps) {
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
          stroke="hsl(var(--muted))"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey={nameKey}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={140}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 12px hsl(var(--border))",
          }}
          formatter={(value: unknown) => [Number(value) || 0, dataKey]}
        />
        <Bar
          dataKey={dataKey}
          fill={color}
          radius={[0, 4, 4, 0]}
          barSize={barSize}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
