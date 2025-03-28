"use client"

import * as React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

const ChartTooltip = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("border bg-background p-2 shadow-sm rounded-lg", className)} {...props} />
))
ChartTooltip.displayName = "ChartTooltip"

const ChartLegend = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-wrap items-center justify-center gap-4", className)} {...props} />
))
ChartLegend.displayName = "ChartLegend"

const ChartLegendItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-1", className)} {...props} />
))
ChartLegendItem.displayName = "ChartLegendItem"

const ChartLegendColor = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("h-2 w-2", className)} {...props} />
))
ChartLegendColor.displayName = "ChartLegendColor"

const ChartLegendLabel = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("text-xs font-medium", className)} {...props} />
))
ChartLegendLabel.displayName = "ChartLegendLabel"

function BarChart({ data, index, categories, colors, valueFormatter, className }) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={index} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          tickFormatter={(value) => valueFormatter(value)}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltip>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <div className="font-semibold">{payload[0].payload[index]}</div>
                    </div>
                    <div className="grid gap-1">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{entry.name}:</span>
                            <span className="text-sm">{valueFormatter(entry.value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartTooltip>
              )
            }
            return null
          }}
        />
        <Legend
          content={({ payload }) => {
            if (payload && payload.length) {
              return (
                <ChartLegend>
                  {payload.map((entry, index) => (
                    <ChartLegendItem key={`item-${index}`}>
                      <ChartLegendColor style={{ backgroundColor: entry.color }} />
                      <ChartLegendLabel>{entry.value}</ChartLegendLabel>
                    </ChartLegendItem>
                  ))}
                </ChartLegend>
              )
            }
            return null
          }}
        />
        {categories.map((category, index) => (
          <Bar key={`bar-${index}`} dataKey={category} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

function LineChart({ data, index, categories, colors, valueFormatter, className }) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={index} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          tickFormatter={(value) => valueFormatter(value)}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltip>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <div className="font-semibold">{payload[0].payload[index]}</div>
                    </div>
                    <div className="grid gap-1">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{entry.name}:</span>
                            <span className="text-sm">{valueFormatter(entry.value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartTooltip>
              )
            }
            return null
          }}
        />
        <Legend
          content={({ payload }) => {
            if (payload && payload.length) {
              return (
                <ChartLegend>
                  {payload.map((entry, index) => (
                    <ChartLegendItem key={`item-${index}`}>
                      <ChartLegendColor style={{ backgroundColor: entry.color }} />
                      <ChartLegendLabel>{entry.value}</ChartLegendLabel>
                    </ChartLegendItem>
                  ))}
                </ChartLegend>
              )
            }
            return null
          }}
        />
        {categories.map((category, index) => (
          <Line
            key={`line-${index}`}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

function PieChart({ data, index, category, colors, valueFormatter, className }) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey={category}
          nameKey={index}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltip>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <div className="font-semibold">{payload[0].name}</div>
                    </div>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{valueFormatter(payload[0].value)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({(payload[0].percent * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ChartTooltip>
              )
            }
            return null
          }}
        />
        <Legend
          content={({ payload }) => {
            if (payload && payload.length) {
              return (
                <ChartLegend>
                  {payload.map((entry, index) => (
                    <ChartLegendItem key={`item-${index}`}>
                      <ChartLegendColor style={{ backgroundColor: entry.color }} />
                      <ChartLegendLabel>{entry.value}</ChartLegendLabel>
                    </ChartLegendItem>
                  ))}
                </ChartLegend>
              )
            }
            return null
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export { BarChart, LineChart, PieChart }

