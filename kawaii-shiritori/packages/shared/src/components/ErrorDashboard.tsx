/**
 * Error Dashboard - Monitor errors across all modules
 */

import React, { useState, useEffect } from "react";
import { ErrorTracking, LogEntry } from "../logger";

interface ErrorStats {
  module: string;
  count: number;
  lastError?: LogEntry;
}

export function ErrorDashboard() {
  const [errors, setErrors] = useState<Record<string, LogEntry[]>>({});
  const [stats, setStats] = useState<Record<string, ErrorStats>>({});
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadErrors();
  }, [refreshKey]);

  const loadErrors = () => {
    const allErrors = ErrorTracking.getAllErrors();
    const errorStats = ErrorTracking.getErrorStats();

    setErrors(allErrors);
    setStats(errorStats);
  };

  const clearAllErrors = () => {
    if (confirm("Clear all error logs?")) {
      ErrorTracking.clearAll();
      setRefreshKey(prev => prev + 1);
    }
  };

  const clearModuleErrors = (module: string) => {
    if (confirm(`Clear errors for ${module}?`)) {
      ErrorTracking.clearModule(module);
      setRefreshKey(prev => prev + 1);
    }
  };

  const totalErrors = Object.values(stats).reduce((sum, stat) => sum + stat.count, 0);
  const modulesWithErrors = Object.keys(stats).length;

  return (
    <div className="error-dashboard p-6 bg-gray-900 text-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">🐛 Error Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Monitor errors across all modules</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            🔄 Refresh
          </button>
          <button
            onClick={clearAllErrors}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">Total Errors</div>
          <div className="text-3xl font-bold mt-2">{totalErrors}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">Modules with Errors</div>
          <div className="text-3xl font-bold mt-2">{modulesWithErrors}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">Status</div>
          <div className="text-3xl font-bold mt-2">
            {totalErrors === 0 ? (
              <span className="text-green-500">✅ Healthy</span>
            ) : (
              <span className="text-red-500">❌ Issues</span>
            )}
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(stats).map(([module, stat]) => (
          <div
            key={module}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
            onClick={() => setSelectedModule(module === selectedModule ? null : module)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">📦 @shiritori/{module}</h3>
                <p className="text-sm text-gray-400">
                  {stat.count} error{stat.count !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    stat.count === 0
                      ? "bg-green-900 text-green-300"
                      : stat.count < 5
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                  }`}
                >
                  {stat.count === 0 ? "✅ OK" : stat.count < 5 ? "⚠️ Warning" : "❌ Critical"}
                </span>
              </div>
            </div>

            {stat.lastError && (
              <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-900 rounded">
                <div className="font-medium text-gray-300">Last error:</div>
                <div className="truncate">{stat.lastError.message}</div>
                <div className="text-gray-500 mt-1">
                  {new Date(stat.lastError.timestamp).toLocaleString()}
                </div>
              </div>
            )}

            {selectedModule === module && (
              <div className="mt-3">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    clearModuleErrors(module);
                  }}
                  className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Clear Module Errors
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Error View */}
      {selectedModule && errors[selectedModule] && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">📋 Error Log: @shiritori/{selectedModule}</h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {errors[selectedModule].map((error, idx) => (
              <div key={idx} className="bg-gray-900 rounded p-3 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-red-400">{error.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(error.timestamp).toLocaleString()}
                  </div>
                </div>

                {error.metadata && (
                  <div className="text-sm text-gray-400 mb-2">
                    <pre className="bg-gray-950 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(error.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                {error.stack && (
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-400">Stack trace</summary>
                    <pre className="mt-2 bg-gray-950 p-2 rounded overflow-x-auto">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalErrors === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-bold mb-2">No Errors!</h3>
          <p className="text-gray-400">All modules are running smoothly. Great work!</p>
        </div>
      )}
    </div>
  );
}

export default ErrorDashboard;
