'use client'
import { createContext, useContext, useId, type ReactNode } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Disclosure } from '../components/primitives/disclosure.js'
import { Table } from '../components/primitives/table.js'
import { Alert, EmptyState, Spinner } from '../components/primitives/feedback.js'
import { Button } from '../components/primitives/button.js'
import { tokens } from '../tokens.js'
export type ChartColour = 'primary' | 'secondary' | 'tertiary'
export interface ChartSeries {
  key: string
  label: string
  colour?: ChartColour
}
export type ChartConfig = Record<string, { label: string; colour?: ChartColour }>
const colours: ChartColour[] = ['primary', 'secondary', 'tertiary']
const seriesColour = (colour: ChartColour) => `var(--cui-chart-series-${colour})`
const ChartContext = createContext<ChartConfig>({})
export interface ChartContainerProps {
  config: ChartConfig
  label: string
  children: ReactNode
  height?: number
}
/** Convert styling and responsive sizing around composable Recharts components. */
export function ChartContainer({ config, label, children, height = 280 }: ChartContainerProps) {
  const safeHeight = Number.isFinite(height) ? Math.max(120, height) : 280
  return (
    <ChartContext.Provider value={config}>
      <div className="cui-root cui-chart-viewport" role="group" aria-label={label} style={{ height: safeHeight }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 640, height: safeHeight }}
        >
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}
export interface ChartTooltipContentProps {
  active?: boolean
  label?: ReactNode
  payload?: readonly { dataKey?: unknown; name?: string | number; value?: unknown; color?: string }[]
  formatValue?: (value: number) => string
}
export function ChartTooltipContent({ active, label, payload, formatValue = formatNumber }: ChartTooltipContentProps) {
  const config = useContext(ChartContext)
  if (!active || !payload?.length) return null
  return (
    <div className="cui-chart-tooltip">
      {label != null && <strong>{label}</strong>}
      <dl>
        {payload.map((item, i) => (
          <div key={i}>
            <dt>{config[String(item.dataKey)]?.label || item.name || 'Value'}</dt>
            <dd>{typeof item.value === 'number' ? formatValue(item.value) : 'Not available'}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
export function ChartLegend({ items }: { items: readonly { label: string; colour: ChartColour; dashed?: boolean }[] }) {
  return (
    <ul className="cui-chart-legend" aria-label="Chart legend">
      {items.map((item, i) => (
        <li key={i}>
          <span
            aria-hidden="true"
            className={item.dashed ? 'cui-legend-line cui-legend-dashed' : 'cui-legend-line'}
            style={{ borderColor: seriesColour(item.colour) }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
export interface ChartDatum {
  [key: string]: string | number | null
}
export interface DataChartProps {
  title: string
  summary: string
  data: ChartDatum[]
  xKey: string
  series: readonly ChartSeries[]
  kind?: 'line' | 'area' | 'bar' | 'stacked-bar' | 'donut'
  height?: number
  formatValue?: (value: number) => string
  state?: 'ready' | 'loading' | 'error'
  onRetry?: () => void
}
const formatNumber = (value: number) => new Intl.NumberFormat('en-AU', { maximumFractionDigits: 2 }).format(value)
/** Ready-to-use chart recipe with a textual summary and exact data table. */
export function DataChart({
  title,
  summary,
  data,
  xKey,
  series,
  kind = 'line',
  height,
  formatValue = formatNumber,
  state = 'ready',
  onRetry,
}: DataChartProps) {
  const id = useId()
  const config = Object.fromEntries(
    series.map((s, i) => [s.key, { label: s.label, colour: s.colour || colours[i % colours.length]! }]),
  )
  const numeric = data.some((d) => series.some((s) => typeof d[s.key] === 'number' && Number.isFinite(d[s.key])))
  const safeData = data.map((d) =>
    Object.fromEntries(
      Object.entries(d).map(([key, value]) => [
        key,
        typeof value === 'number' && !Number.isFinite(value) ? null : value,
      ]),
    ),
  )
  const primary = series[0]
  const invalidDonut =
    kind === 'donut' &&
    (series.length !== 1 ||
      data.some((d) => primary && typeof d[primary.key] === 'number' && (d[primary.key] as number) < 0))
  const axes = (
    <>
      <CartesianGrid vertical={false} stroke="var(--cui-chart-grid)" />
      <XAxis
        dataKey={xKey}
        tickLine={false}
        axisLine={false}
        tick={{ fill: 'var(--cui-chart-label)' }}
        minTickGap={24}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tick={{ fill: 'var(--cui-chart-label)' }}
        tickFormatter={formatValue}
        width={64}
      />
      <Tooltip content={<ChartTooltipContent formatValue={formatValue} />} />
    </>
  )
  const common = { data: safeData, accessibilityLayer: true, margin: { top: 16, right: 16, bottom: 0, left: 0 } }
  const strokeWidth = parseFloat(tokens['chart.stroke'])
  const visual =
    kind === 'line' ? (
      <LineChart {...common}>
        {axes}
        {series.map((s, i) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stroke={seriesColour(config[s.key]!.colour)}
            strokeWidth={strokeWidth}
            strokeDasharray={i % 3 === 1 ? '6 4' : i % 3 === 2 ? '2 3' : undefined}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    ) : kind === 'area' ? (
      <AreaChart {...common}>
        {axes}
        {series.map((s, i) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stroke={seriesColour(config[s.key]!.colour)}
            fill={seriesColour(config[s.key]!.colour)}
            fillOpacity={0.12}
            strokeWidth={strokeWidth}
            strokeDasharray={i % 2 ? '6 4' : undefined}
            connectNulls={false}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    ) : kind === 'donut' && primary ? (
      <PieChart accessibilityLayer>
        <Pie
          data={safeData}
          dataKey={primary.key}
          nameKey={xKey}
          innerRadius="58%"
          outerRadius="85%"
          stroke="var(--cui-surface-card)"
          strokeWidth={strokeWidth}
          isAnimationActive={false}
        >
          {safeData.map((_, i) => (
            <Cell key={i} fill={seriesColour(colours[i % colours.length]!)} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent formatValue={formatValue} />} />
      </PieChart>
    ) : (
      <BarChart {...common}>
        {axes}
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={seriesColour(config[s.key]!.colour)}
            stackId={kind === 'stacked-bar' ? 'total' : undefined}
            radius={
              kind === 'stacked-bar'
                ? 0
                : [parseFloat(tokens['chart.radius']), parseFloat(tokens['chart.radius']), 0, 0]
            }
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    )
  return (
    <figure className="cui-root cui-data-chart" aria-labelledby={id}>
      <figcaption id={id} className="cui-stack">
        <strong className="cui-card-heading">{title}</strong>
        <p className="cui-secondary">{summary}</p>
      </figcaption>
      {state === 'loading' ? (
        <Spinner label="Loading chart" />
      ) : state === 'error' ? (
        <Alert title="Chart could not be loaded" tone="error">
          {onRetry ? <Button onClick={onRetry}>Try again</Button> : 'Try again later.'}
        </Alert>
      ) : invalidDonut ? (
        <Alert title="This data needs a different chart" tone="warning">
          Donut charts require one series of non-negative values.
        </Alert>
      ) : !numeric || (kind === 'donut' && primary && !data.some((d) => Number(d[primary.key]) > 0)) ? (
        <EmptyState title="No chart data" description="Values will appear here when available." />
      ) : (
        <>
          <ChartContainer config={config} label={title} height={height}>
            {visual}
          </ChartContainer>
          <ChartLegend
            items={
              kind === 'donut'
                ? data.map((d, i) => ({ label: String(d[xKey] ?? ''), colour: colours[i % colours.length]! }))
                : series.map((s, i) => ({
                    label: s.label,
                    colour: config[s.key]!.colour,
                    dashed: (kind === 'line' || kind === 'area') && i % 3 !== 0,
                  }))
            }
          />
          <Disclosure title="View chart data">
            <Table caption={`${title}: exact values`} density="compact">
              <thead>
                <tr>
                  <th scope="col">{xKey}</th>
                  {series.map((s) => (
                    <th scope="col" key={s.key} className="cui-numeric">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {safeData.map((d, i) => (
                  <tr key={i}>
                    <th scope="row">{d[xKey]}</th>
                    {series.map((s) => (
                      <td className="cui-numeric" key={s.key}>
                        {typeof d[s.key] === 'number' ? formatValue(d[s.key] as number) : 'Not available'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Disclosure>
        </>
      )}
    </figure>
  )
}
export function Sparkline({ values, label }: { values: readonly (number | null)[]; label: string }) {
  return (
    <div className="cui-sparkline" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height={64} initialDimension={{ width: 240, height: 64 }}>
        <LineChart
          data={values.map((value) => ({ value: typeof value === 'number' && Number.isFinite(value) ? value : null }))}
          accessibilityLayer={false}
        >
          <Line
            dataKey="value"
            stroke="var(--cui-chart-series-primary)"
            strokeWidth={parseFloat(tokens['chart.stroke'])}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
