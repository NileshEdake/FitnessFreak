"use client";

import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import "./ReportPage.css";
import { AiFillEdit } from "react-icons/ai";
import WeightReportPopup from "@/components/ReportFormPopup/WeightReport/WeightReportPopup"; 
import WorkoutReportPopup from "@/components/ReportFormPopup/WorkoutReport/WorkoutReportPopup";  // Add the new popup component
import StepReportPopup from "@/components/ReportFormPopup/StepReport/StepReportPopup";
import SleepReportPopup from "@/components/ReportFormPopup/SleepReport/SleepReportPopup";
import CaloriIntakePopup from "@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup";
import WaterTrackPopup from "@/components/ReportFormPopup/WaterReport/WaterReportPopup";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";

const Page = () => {
  const pathname = usePathname();
  const chartsParams = {
    height: 300,
  };

  // States for the data
  const [workoutData, setWorkoutData] = React.useState<any>({ data: [] }); // Workout data
  const [dataS1, setDataS1] = React.useState<any>({ data: [] }); // Steps data
  const [sleepData, setSleepData] = React.useState<any>({ data: [] }); // Sleep data
  const [calorieData, setCalorieData] = React.useState<any>(null); // Calorie data
  const [waterData, setWaterData] = React.useState<any>({ data: [] }); // Water intake data
  const [weightData, setWeightData] = React.useState<any>({ data: [] });

  const [showWorkoutReportPopup, setShowWorkoutReportPopup] = React.useState<boolean>(false);
  const [showStepReportPopup, setShowStepReportPopup] = React.useState<boolean>(false);
  const [showSleepReportPopup, setShowSleepReportPopup] = React.useState<boolean>(false);
  const [showCalorieIntakePopup, setShowCalorieIntakePopup] = React.useState<boolean>(false);
  const [showWaterTrackPopup, setShowWaterTrackPopup] = React.useState<boolean>(false);
  const [showWeightReportPopup, setShowWeightReportPopup] = React.useState<boolean>(false);

  const workoutColor = "#FF5722"; // Color for workout data
  const color = "#3f51b5"; // Blue color for steps data
  const sleepColor = "#4caf50"; // Green for sleep data
  const calorieColor = "#ffc20e"; // Yellow for calorie intake
  const waterColor = "#00bcd4"; // Cyan for water intake
  const weightColor = "#673AB7"; // Purple for weight data

  // Fetch Weight Data
  const getWeightData = async () => {
    if (pathname === "/report/Weight") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/weightTrack/getweightbylimit`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 10 }),
          }
        );

        if (!response.ok) {
          console.error("API request failed with status:", response.status);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          const formattedData = data.data.map((item) => ({
            date: item.date ? new Date(item.date) : new Date(),
            value: item.weight || 0,
            unit: "kg",
          }));

          setWeightData({
            data: formattedData.map((item) => item.value),
            title: "Weight Over Time (Last 10 Days)",
            color: weightColor,
            xAxis: {
              data: formattedData.map((item) => item.date),
              label: "Last 10 Days",
              scaleType: "time",
            },
          });
        } else {
          setWeightData({ data: [] });
        }
      } catch (error) {
        console.error("Error fetching weight data:", error);
      }
    }
  };


  // Fetch Workout Data
  const getWorkoutData = async () => {
    if (pathname === "/report/Workout") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/workoutTrack/getworkoutsbylimit`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 10 }),
          }
        );

        if (!response.ok) {
          console.error("API request failed with status:", response.status);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          const formattedData = data.data.map((item) => ({
            date: item.date ? new Date(item.date) : new Date(),
            value: item.durationInMinutes || 0,
            unit: "minutes",
          }));

          setWorkoutData({
            data: formattedData.map((item) => item.value),
            title: "Workout Duration (Last 10 Days)",
            color: workoutColor,
            xAxis: {
              data: formattedData.map((item) => item.date),
              label: "Last 10 Days",
              scaleType: "time",
            },
          });
        } else {
          setWorkoutData({ data: [] });
        }
      } catch (error) {
        console.error("Error fetching workout data:", error);
      }
    }
  };

  // Fetch Steps Data
  const getDataForS1 = async () => {
    if (pathname === "/report/Steps") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/StepTrack/getstepsbylimit`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 10 }),
          }
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        if (data && Array.isArray(data.data)) {
          const temp = data.data.map((item: any) => ({
            date: dayjs(item.date).toDate(),
            value: item.steps,
            unit: "steps",
          }));

          setDataS1({
            data: temp.map((item: any) => item.value),
            title: "Steps Count (Last 10 Days)",
            color: color,
            xAxis: {
              data: temp.map((item: any) => item.date),
              label: "Last 10 Days",
              scaleType: "time",
            },
          });
        } else {
          setDataS1({ data: [] });
        }
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }
  };

  // Fetch Sleep Data
  const getSleepData = async () => {
    if (pathname === "/report/Sleep") {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_API + "/sleepTrack/getsleepbylimit",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 10 }),
          }
        );
        const data = await response.json();
        if (data.ok && Array.isArray(data.data)) {
          const formattedData = data.data.map((item) => ({
            date: new Date(item.date),
            value: item.durationInHrs,
            unit: "hours",
          }));

          setSleepData({
            data: formattedData.map((item) => item.value),
            title: "Hours of Sleep (Last 10 Days)",
            color: sleepColor,
            xAxis: {
              data: formattedData.map((item) => item.date),
              label: "Last 10 Days",
              scaleType: "time",
            },
          });
        } else {
          setSleepData({ data: [] });
        }
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }
  };

  // Fetch Calorie Intake Data
  const getCalorieData = async () => {
    if (pathname === "/report/Calorie%20Intake") {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_API + "/calorieintake/getcalorieintakebylimit",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 10 }),
          }
        );
        const data = await response.json();
        if (data.ok) {
          const formattedData = data.data.map((item) => ({
            date: new Date(item.date),
            value: item.calorieIntake,
            unit: "kcal",
          }));

          setCalorieData({
            data: formattedData.map((item) => item.value),
            title: "1 Day Calorie Intake",
            color: calorieColor,
            xAxis: {
              data: formattedData.map((item) => item.date),
              label: "Last 10 Days",
              scaleType: "time",
            },
          });
        } else {
          setCalorieData(null);
        }
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }
  };

  // Fetch Water Intake Data
  const getWaterData = async () => {
    if (pathname === "/report/Water") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/waterTrack/getwaterbylimit`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 10 }),
          }
        );

        if (!response.ok) {
          console.error("API request failed with status:", response.status);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          const formattedData = data.data.map((item) => ({
            date: item.date ? new Date(item.date) : new Date(),
            value: item.amountInMilliliters || 0,
          }));

          setWaterData({
            data: formattedData.map((item) => item.value),
            title: "Daily Water Intake (Last 10 Days) in Milliliters",
            color: waterColor,
            xAxis: {
              data: formattedData.map((item) => item.date),
              label: "Last 10 Days",
              scaleType: "time",
            },
          });
        } else {
          setWaterData({ data: [] });
        }
      } catch (error) {
        console.error("Error fetching water data:", error);
      }
    }
  };

  // Fetch data when pathname changes
  React.useEffect(() => {
    getWorkoutData();
    getDataForS1();
    getSleepData();
    getCalorieData();
    getWaterData();
    getWeightData();
  }, [pathname]);

  return (
    <div className="reportpage">
    {/* Workout Report Chart */}
    {pathname === "/report/Workout" && workoutData.data.length > 0 && (
      <div className="s1">
        <LineChart
          xAxis={[
            {
              id: "Day",
              data: workoutData.xAxis.data,
              scaleType: workoutData.xAxis.scaleType,
              label: workoutData.xAxis.label,
              valueFormatter: (date) => date.toLocaleDateString(),
            },
          ]}
          series={[
            {
              data: workoutData.data,
              label: workoutData.title,
              color: workoutData.color,
            },
          ]}
          {...chartsParams}
        />
      </div>
    )}
  
    {/* Water Report Chart */}
    {pathname === "/report/Water" && waterData.data.length > 0 && (
      <div className="s1">
        <LineChart
          xAxis={[
            {
              id: "Day",
              data: waterData.xAxis.data,
              scaleType: waterData.xAxis.scaleType,
              label: waterData.xAxis.label,
              valueFormatter: (date) => date.toLocaleDateString(),
            },
          ]}
          series={[
            {
              data: waterData.data,
              label: waterData.title,
              color: waterData.color,
            },
          ]}
          {...chartsParams}
        />
      </div>
    )}
  
    {/* Sleep Report Chart */}
    {pathname === "/report/Sleep" && sleepData.data.length > 0 && (
      <div className="s1">
        <LineChart
          xAxis={[
            {
              id: "Day",
              data: sleepData.xAxis.data,
              scaleType: sleepData.xAxis.scaleType,
              label: sleepData.xAxis.label,
              valueFormatter: (date) => date.toLocaleDateString(),
            },
          ]}
          series={[
            {
              data: sleepData.data,
              label: sleepData.title,
              color: sleepData.color,
            },
          ]}
          {...chartsParams}
        />
      </div>
    )}
  
    {/* Calorie Intake Report Chart */}
    {pathname === "/report/Calorie%20Intake" && calorieData && (
      <div className="s1">
        <LineChart
          xAxis={[
            {
              id: "Day",
              data: calorieData.xAxis.data,
              scaleType: calorieData.xAxis.scaleType,
              label: calorieData.xAxis.label,
              valueFormatter: (date) => date.toLocaleDateString(),
            },
          ]}
          series={[
            {
              data: calorieData.data,
              label: calorieData.title,
              color: calorieData.color,
            },
          ]}
          {...chartsParams}
        />
      </div>
    )}
  
    {/* Step Report Chart */}
    {pathname === "/report/Steps" && dataS1.data.length > 0 && (
      <div className="s1">
        <LineChart
          xAxis={[
            {
              id: "Day",
              data: dataS1.xAxis.data,
              scaleType: dataS1.xAxis.scaleType,
              label: dataS1.xAxis.label,
              valueFormatter: (date) => date.toLocaleDateString(),
            },
          ]}
          series={[
            {
              data: dataS1.data,
              label: dataS1.title,
              color: dataS1.color,
            },
          ]}
          {...chartsParams}
        />
      </div>
    )}
  
    {/* Weight Report Chart */}
    {pathname === "/report/Weight" && weightData.data.length > 0 && (
      <div className="s1">
        <LineChart
          xAxis={[
            {
              id: "Day",
              data: weightData.xAxis.data,
              scaleType: weightData.xAxis.scaleType,
              label: weightData.xAxis.label,
              valueFormatter: (date) => date.toLocaleDateString(),
            },
          ]}
          series={[
            {
              data: weightData.data,
              label: weightData.title,
              color: weightData.color,
            },
          ]}
          {...chartsParams}
        />
      </div>
    )}
  
    {/* Edit Button */}
    <button
      className="editbutton"
      onClick={() => {
        if (pathname === "/report/Water") {
          setShowWaterTrackPopup(true);
        } else if (pathname === "/report/Sleep") {
          setShowSleepReportPopup(true);
        } else if (pathname === "/report/Calorie%20Intake") {
          setShowCalorieIntakePopup(true);
        } else if (pathname === "/report/Steps") {
          setShowStepReportPopup(true);
        } else if (pathname === "/report/Workout") {
          setShowWorkoutReportPopup(true);
        } else if (pathname === "/report/Weight") {
          setShowWeightReportPopup(true);
        }
      }}
    >
      <AiFillEdit />
    </button>
  
    {/* Popup Modals */}
    {showWaterTrackPopup && (
      <WaterTrackPopup setShowWaterTrackPopup={setShowWaterTrackPopup} />
    )}
    {showStepReportPopup && (
      <StepReportPopup setShowStepReportPopup={setShowStepReportPopup} />
    )}
    {showSleepReportPopup && (
      <SleepReportPopup setShowSleepReportPopup={setShowSleepReportPopup} />
    )}
    {showCalorieIntakePopup && (
      <CalorieIntakePopup setShowCalorieIntakePopup={setShowCalorieIntakePopup} />
    )}
    {showWorkoutReportPopup && (
      <WorkoutReportPopup setShowWorkoutReportPopup={setShowWorkoutReportPopup} />
    )}
    {showWeightReportPopup && (
      <WeightReportPopup setShowWeightReportPopup={setShowWeightReportPopup} />
    )}
  </div>
  
  );
};

export default Page;
