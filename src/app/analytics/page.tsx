"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "@/services/marketplaceService";
import { AnalyticsData } from "@/types/marketplace";
import { formatCurrency } from "@/utils/formatters";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const analyticsData = await getAnalyticsData();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-gray-500">Loading analytics data...</p>
        </div>
      ) : (
        analytics && (
          <>
            <AnalyticsSummary data={analytics} />
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Rate Trends Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Rate Trends (Last 4 Weeks)
                </h2>
                <div className="h-64 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full flex flex-col justify-end space-y-2">
                      <div className="flex items-end space-x-1 px-2">
                        {analytics.marketTrends.map((trend, index) => {
                          const height = (trend.avgRate / 3) * 100;
                          return (
                            <div
                              key={index}
                              className="flex-1 flex flex-col items-center"
                            >
                              <div
                                className="w-full bg-blue-500 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                                {new Date(trend.date).toLocaleDateString(
                                  undefined,
                                  { month: "short", day: "numeric" }
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="border-t border-gray-300 pt-2 px-4 flex justify-between text-xs text-gray-500">
                        <div>
                          $
                          {Math.min(
                            ...analytics.marketTrends.map((t) => t.avgRate)
                          ).toFixed(2)}
                        </div>
                        <div>
                          $
                          {Math.max(
                            ...analytics.marketTrends.map((t) => t.avgRate)
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Load Distribution by Equipment Type
                </h2>
                <div className="h-64 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full flex items-center">
                      <div className="w-full">
                        {analytics.loadDistribution.map((item, index) => {
                          // Calculate percentage of total
                          const total = analytics.loadDistribution.reduce(
                            (sum, i) => sum + i.count,
                            0
                          );
                          const percentage = Math.round(
                            (item.count / total) * 100
                          );
                          
                          const colors = [
                            "bg-blue-500",
                            "bg-green-500",
                            "bg-yellow-500",
                            "bg-purple-500",
                          ];
                          
                          return (
                            <div key={index} className="mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  {item.equipment}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {item.count} loads ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`${
                                    colors[index % colors.length]
                                  } h-2.5 rounded-full`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Paying Lanes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Top Paying Lanes (Rate per Mile)
                </h2>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Lane
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Rate per Mile
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(analytics.avgRateByLane)
                        .sort((a, b) => b[1] - a[1])
                        .map(([lane, rate], index) => {
                          const formattedLane = lane
                            .replace("_", ", ")
                            .replace("-", " → ");
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formattedLane}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                {formatCurrency(rate)}/mi
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
} 