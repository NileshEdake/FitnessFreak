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

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightReportPopupProps {
  setShowWeightReportPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WeightReportPopup: React.FC<WeightReportPopupProps> = ({
  setShowWeightReportPopup,
}) => {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [weight, setWeight] = React.useState<number | null>(null);
  const [records, setRecords] = React.useState<WeightEntry[]>([]);

  const saveWeightData = async () => {
    if (!date || !weight) {
      toast.error("Please provide both date and weight");
      return;
    }

    try {
      const formattedDate = date.toISOString();
      const payload = { date: formattedDate, weightInKg: weight };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/weightTrack/addweightentry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Weight data added successfully");
        getWeightData();
        setWeight(null);
      } else {
        toast.error(data.message || "Failed to save weight data");
      }
    } catch (error) {
      console.error("Error saving weight data:", error);
      toast.error("An error occurred while saving weight data");
    }
  };

  const getWeightData = async () => {
    try {
      const formattedDate = date?.toISOString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/weightTrack/getweightbydate`,
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
        toast.error(data.message || "Failed to fetch weight data");
      }
    } catch (error) {
      console.error("Error fetching weight data:", error);
      toast.error("An error occurred while fetching weight data");
    }
  };

  const deleteWeightEntry = async (entry: WeightEntry) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/weightTrack/deleteweightentry`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ date: entry.date }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Weight entry deleted successfully");
        getWeightData();
      } else {
        toast.error(data.message || "Failed to delete weight entry");
      }
    } catch (error) {
      console.error("Error deleting weight entry:", error);
      toast.error("An error occurred while deleting weight entry");
    }
  };

  React.useEffect(() => {
    getWeightData();
  }, [date]);

  return (
    <div className="popupout">
      <div className="popupbox">
        <button
          className="close"
          onClick={() => setShowWeightReportPopup(false)}
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
          id="weight"
          label="Weight (in kg)"
          variant="outlined"
          color="primary"
          type="number"
          value={weight || ""}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
        />

        <Button variant="contained" color="primary" onClick={saveWeightData}>
          Save
        </Button>

        <div className="hrline"></div>

        <div className="items">
          {records.length > 0 ? (
            records.map((record, index) => (
              <div className="item" key={index}>
                <h3>Date: {dayjs(record.date).format("DD MMM YYYY")}</h3>
                <h3>Weight: {record.weight} kg</h3>
                <button onClick={() => deleteWeightEntry(record)}>
                  <AiFillDelete />
                </button>
              </div>
            ))
          ) : (
            <p>No weight records found for the selected date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightReportPopup;
