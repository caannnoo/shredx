import "./dashboard.css";
import { API_URL } from "../../api";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [dateRange, setDateRange] = useState("30d");
  const [calorieData, setCalorieData] = useState([]);
  const [macroData, setMacroData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [weightData, setWeightData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCalorieData = async () => {
      const days = Number(dateRange.replace("d", ""));

      const endDate = new Date();
      const startDate = new Date();

      startDate.setDate(endDate.getDate() - (days - 1));

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      };

      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/calories?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load calorie data");
        }

        const data = await response.json();

        const caloriesByDate = new Map(
          data.calorieData.map((entry) => [entry.date, Number(entry.calories)]),
        );

        const completeData = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(endDate);
          date.setDate(endDate.getDate() - i);

          const dateString = formatDate(date);

          completeData.push({
            date: dateString,
            calories: caloriesByDate.get(dateString) ?? 0,
          });
        }

        setCalorieData(completeData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading calorie data:", error);
        }
      }
    };

    loadCalorieData();

    return () => controller.abort();
  }, [dateRange]);

  useEffect(() => {
    const controller = new AbortController();

    const loadMacroData = async () => {
      const days = Number(dateRange.replace("d", ""));

      const endDate = new Date();
      const startDate = new Date();

      startDate.setDate(endDate.getDate() - (days - 1));

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      };

      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/macros?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load macro data");
        }

        const data = await response.json();

        const macrosByDate = new Map(
          data.macroData.map((entry) => [entry.date, entry]),
        );

        const completeMacroData = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(endDate);
          date.setDate(endDate.getDate() - i);

          const dateString = formatDate(date);
          const entry = macrosByDate.get(dateString);

          completeMacroData.push({
            date: dateString,
            protein: entry ? Number(entry.protein) : 0,
            carbs: entry ? Number(entry.carbs) : 0,
            fat: entry ? Number(entry.fat) : 0,
          });
        }

        setMacroData(completeMacroData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading macro data:", error);
        }
      }
    };

    loadMacroData();

    return () => controller.abort();
  }, [dateRange]);

  useEffect(() => {
    const controller = new AbortController();

    const loadActivityData = async () => {
      const days = Number(dateRange.replace("d", ""));

      const endDate = new Date();
      const startDate = new Date();

      startDate.setDate(endDate.getDate() - (days - 1));

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      };

      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/activity-calories?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load activity data");
        }

        const data = await response.json();

        const activitiesByDate = new Map(
          data.activityCalories.map((entry) => [
            entry.date,
            Number(entry.calories_burned),
          ]),
        );

        const completeActivityData = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(endDate);
          date.setDate(endDate.getDate() - i);

          const dateString = formatDate(date);

          completeActivityData.push({
            date: dateString,
            calories_burned: activitiesByDate.get(dateString) ?? 0,
          });
        }

        setActivityData(completeActivityData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading activity data:", error);
        }
      }
    };

    loadActivityData();

    return () => controller.abort();
  }, [dateRange]);

  useEffect(() => {
    const controller = new AbortController();

    const loadWeightData = async () => {
      const days = Number(dateRange.replace("d", ""));

      const endDate = new Date();
      const startDate = new Date();

      startDate.setDate(endDate.getDate() - (days - 1));

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      };

      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/weight?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load weight data");
        }

        const data = await response.json();

        const weightByDate = new Map(
          data.weightData.map((entry) => [entry.date, Number(entry.weight)]),
        );

        const completeWeightData = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(endDate);
          date.setDate(endDate.getDate() - i);

          const dateString = formatDate(date);

          completeWeightData.push({
            date: dateString,
            weight: weightByDate.get(dateString) ?? 0,
          });
        }

        setWeightData(completeWeightData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading weight data:", error);
        }
      }
    };

    loadWeightData();

    return () => controller.abort();
  }, [dateRange]);

  return (
    <main className="dashboard">
      <div className="dashboard-section">
        <div className="dashboard-header">
          <div className="dashboard-header-text">
            <h4>YOUR PROGRESS</h4>
            <h1>Every step counts.</h1>
          </div>

          <div className="dashboard-date-filter">
            <h3>Progress Overview</h3>

            <div className="dashboard-date-options">
              {[
                { label: "7 Days", value: "7d" },
                { label: "10 Days", value: "10d" },
                { label: "30 Days", value: "30d" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={dateRange === option.value ? "active" : ""}
                  onClick={() => setDateRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-header">
              <h3>Calorie Intake</h3>
              <p>Your daily calorie consumption</p>
            </div>

            <div className="dashboard-chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={calorieData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -25,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    stroke="#e5e9e7"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#6f7b77"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    interval={dateRange === "30d" ? 5 : 0}
                    minTickGap={15}
                    tickFormatter={(date) => {
                      const [, month, day] = date.split("-");
                      return `${day}.${month}.`;
                    }}
                  />

                  <YAxis
                    stroke="#6f7b77"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e9e7",
                      borderRadius: "12px",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                    }}
                    labelStyle={{
                      color: "#6f7b77",
                      marginBottom: "6px",
                    }}
                    itemStyle={{
                      color: "#17211e",
                      fontWeight: 700,
                    }}
                    formatter={(value) => [
                      `${Number(value).toLocaleString("de-DE")} kcal`,
                      "Calories",
                    ]}
                    labelFormatter={(date) => {
                      const [year, month, day] = date.split("-");
                      return `${day}.${month}.${year}`;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#17211e"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#17211e",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="dashboard-chart-header macro-chart-header">
              <div>
                <h3>Macronutrients</h3>
                <p>Your daily protein, carbs and fat intake</p>
              </div>

              <div className="macro-legend">
                <span className="macro-legend-item">
                  <span className="macro-legend-line protein"></span>
                  Protein
                </span>

                <span className="macro-legend-item">
                  <span className="macro-legend-line carbs"></span>
                  Carbs
                </span>

                <span className="macro-legend-item">
                  <span className="macro-legend-line fat"></span>
                  Fat
                </span>
              </div>
            </div>

            <div className="dashboard-chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={macroData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -25,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    stroke="#e5e9e7"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#6f7b77"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    interval={dateRange === "30d" ? 5 : 0}
                    minTickGap={15}
                    tickFormatter={(date) => {
                      const [, month, day] = date.split("-");
                      return `${day}.${month}.`;
                    }}
                  />

                  <YAxis
                    stroke="#6f7b77"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    unit="g"
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e9e7",
                      borderRadius: "12px",
                    }}
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString("de-DE")} g`,
                      name,
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="protein"
                    name="Protein"
                    stroke="#17211e"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="carbs"
                    name="Carbs"
                    stroke="#6f7b77"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="fat"
                    name="Fat"
                    stroke="#b5bdb9"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="dashboard-chart-header">
              <h3>Activities</h3>
              <p>Your daily calories burned</p>
            </div>

            <div className="dashboard-chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={activityData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -25,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    stroke="#e5e9e7"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#6f7b77"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    interval={dateRange === "30d" ? 5 : 0}
                    minTickGap={15}
                    tickFormatter={(date) => {
                      const [, month, day] = date.split("-");
                      return `${day}.${month}.`;
                    }}
                  />

                  <YAxis
                    stroke="#6f7b77"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e9e7",
                      borderRadius: "12px",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [
                      `${Number(value).toLocaleString("de-DE")} kcal`,
                      "Calories Burned",
                    ]}
                    labelFormatter={(date) => {
                      const [year, month, day] = date.split("-");
                      return `${day}.${month}.${year}`;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="calories_burned"
                    name="Calories Burned"
                    stroke="#17211e"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#17211e",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="dashboard-chart-header">
              <h3>Weight Progress</h3>
              <p>Your body weight over time</p>
            </div>

            <div className="dashboard-chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={weightData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -25,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    stroke="#e5e9e7"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#6f7b77"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    interval={dateRange === "30d" ? 5 : 0}
                    minTickGap={15}
                    tickFormatter={(date) => {
                      const [, month, day] = date.split("-");
                      return `${day}.${month}.`;
                    }}
                  />

                  <YAxis
                    stroke="#6f7b77"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    unit="kg"
                    domain={["auto", "auto"]}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e9e7",
                      borderRadius: "12px",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [
                      `${Number(value).toLocaleString("de-DE")} kg`,
                      "Weight",
                    ]}
                    labelFormatter={(date) => {
                      const [year, month, day] = date.split("-");
                      return `${day}.${month}.${year}`;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight"
                    stroke="#17211e"
                    strokeWidth={3}
                    connectNulls={true}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#17211e",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
