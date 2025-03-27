"use client";

import {
  CurrencyDollarIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { AnalyticsData } from "@/types/marketplace";
import { formatCurrency } from "@/utils/formatters";

interface AnalyticsSummaryProps {
  data: AnalyticsData;
}

export default function AnalyticsSummary({ data }: AnalyticsSummaryProps) {
  // Calculate total loads
  const totalLoads = data.loadDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // Get top lane
  const topLane = data.topLanes.length > 0 ? data.topLanes[0] : null;
  const topLaneName = topLane ? `${topLane.origin} → ${topLane.destination}` : 'None';
  const topLaneRate = topLane ? topLane.avgRate : 0;

  // Calculate rate trend
  const rateTrend = data.marketTrends;
  const latestRate = rateTrend.length > 0 ? rateTrend[rateTrend.length - 1].avgRate : 0;
  const previousRate = rateTrend.length > 1 ? rateTrend[rateTrend.length - 2].avgRate : latestRate;
  const rateChange = latestRate - previousRate;
  const rateChangePercent = previousRate !== 0 ? (rateChange / previousRate) * 100 : 0;

  const stats = [
    {
      name: "Average Rate Per Mile",
      value: formatCurrency(latestRate),
      icon: CurrencyDollarIcon,
      change: rateChangePercent.toFixed(2) + "%",
      changeType: rateChange >= 0 ? "increase" : "decrease",
    },
    {
      name: "Total Active Loads",
      value: totalLoads.toString(),
      icon: TruckIcon,
      change: "",
      changeType: "neutral",
    },
    {
      name: "Top Paying Lane",
      value: formatCurrency(topLaneRate) + "/mi",
      icon: MapPinIcon,
      change: topLaneName,
      changeType: "neutral",
    },
    {
      name: "Market Trend",
      value: rateChange >= 0 ? "Increasing" : "Decreasing",
      icon: ArrowTrendingUpIcon,
      change: "Last 4 weeks",
      changeType: rateChange >= 0 ? "increase" : "decrease",
    },
  ];

  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <stat.icon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              {stat.change && (
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : stat.changeType === "decrease"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {stat.changeType === "increase" && (
                    <svg
                      className="h-4 w-4 flex-shrink-0 self-center text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {stat.changeType === "decrease" && (
                    <svg
                      className="h-4 w-4 flex-shrink-0 self-center text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="sr-only">
                    {stat.changeType === "increase"
                      ? "Increased"
                      : "Decreased"
                    } by
                  </span>
                  {stat.change}
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
} 