import React from "react";
import "../popup.css";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { toast } from "react-toastify";

interface WorkoutEntry {
  date: string;
  exercise: string;
  durationInMinutes: number;
}

interface WorkoutReportPopupProps {
  setShowWorkoutReportPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkoutReportPopup: React.FC<WorkoutReportPopupProps> = ({
  setShowWorkoutReportPopup,
}) => {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [exercise, setExercise] = React.useState<string | null>(null);
  const [duration, setDuration] = React.useState<number | null>(null);
  const [records, setRecords] = React.useState<WorkoutEntry[]>([]);

  const saveWorkoutData = async () => {
    if (!date || !exercise || !duration) {
      toast.error("Please provide date, exercise, and duration");
      return;
    }

    try {
      const formattedDate = date.toISOString();
      const payload = { date: formattedDate, exercise, durationInMinutes: duration };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/workoutTrack/addworkoutentry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Workout data added successfully");
        getWorkoutData();
        setExercise(null);
        setDuration(null);
      } else {
        toast.error(data.message || "Failed to save workout data");
      }
    } catch (error) {
      console.error("Error saving workout data:", error);
      toast.error("An error occurred while saving workout data");
    }
  };

  const getWorkoutData = async () => {
    try {
      const formattedDate = date?.toISOString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/workoutTrack/getworkoutsbydate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ date: formattedDate }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRecords(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch workout data");
      }
    } catch (error) {
      console.error("Error fetching workout data:", error);
      toast.error("An error occurred while fetching workout data");
    }
  };

  const deleteWorkoutEntry = async (entry: WorkoutEntry) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/workoutTrack/deleteworkoutentry`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ date: entry.date }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Workout entry deleted successfully");
        getWorkoutData();
      } else {
        toast.error(data.message || "Failed to delete workout entry");
      }
    } catch (error) {
      console.error("Error deleting workout entry:", error);
      toast.error("An error occurred while deleting workout entry");
    }
  };

  React.useEffect(() => {
    getWorkoutData();
  }, [date]);

  return (
    <div className="popupout">
      <div className="popupbox">
        <button
          className="close"
          onClick={() => setShowWorkoutReportPopup(false)}
        >
          <AiOutlineClose />
        </button>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
          />
        </LocalizationProvider>

        <TextField
          id="exercise"
          label="Exercise"
          variant="outlined"
          color="primary"
          value={exercise || ""}
          onChange={(e) => setExercise(e.target.value)}
        />

        <TextField
          id="duration"
          label="Duration (in minutes)"
          variant="outlined"
          color="primary"
          type="number"
          value={duration || ""}
          onChange={(e) => setDuration(parseFloat(e.target.value))}
        />

        <Button variant="contained" color="primary" onClick={saveWorkoutData}>
          Save
        </Button>

        <div className="hrline"></div>

        <div className="items">
          {records.length > 0 ? (
            records.map((record, index) => (
              <div className="item" key={index}>
                <h3>Date: {dayjs(record.date).format("DD MMM YYYY")}</h3>
                <h3>Exercise: {record.exercise}</h3>
                <h3>Duration: {record.durationInMinutes} minutes</h3>
                <button onClick={() => deleteWorkoutEntry(record)}>
                  <AiFillDelete />
                </button>
              </div>
            ))
          ) : (
            <p>No workout records found for the selected date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutReportPopup;
