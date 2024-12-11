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

interface SleepEntry {
  date: string;
  durationInHrs: number;
}

interface SleepReportPopupProps {
  setShowSleepReportPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SleepReportPopup: React.FC<SleepReportPopupProps> = ({
  setShowSleepReportPopup,
}) => {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [sleepDuration, setSleepDuration] = React.useState<number | null>(null);
  const [records, setRecords] = React.useState<SleepEntry[]>([]);

  const saveSleepData = async () => {
    if (!date || !sleepDuration) {
      toast.error("Please provide both date and sleep duration");
      return;
    }

    try {
      const formattedDate = date.toISOString();

      const payload = {
        date: formattedDate,
        durationInHrs: sleepDuration,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/sleepTrack/addsleepentry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Sleep data added successfully");
        getSleepData(); // Refresh records
        setSleepDuration(null); // Reset input field
      } else {
        toast.error(data.message || "Failed to save sleep data");
      }
    } catch (error) {
      console.error("Error saving sleep data:", error);
      toast.error("An error occurred while saving sleep data");
    }
  };

  const getSleepData = async () => {
    try {
      const formattedDate = date?.toISOString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/sleepTrack/getsleepbydate`,
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
        toast.error(data.message || "Failed to fetch sleep data");
      }
    } catch (error) {
      console.error("Error fetching sleep data:", error);
      toast.error("An error occurred while fetching sleep data");
    }
  };

  const deleteSleepEntry = async (entry: SleepEntry) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/sleepTrack/deletesleepentry`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ date: entry.date }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Sleep entry deleted successfully");
        getSleepData(); // Refresh records
      } else {
        toast.error(data.message || "Failed to delete sleep entry");
      }
    } catch (error) {
      console.error("Error deleting sleep entry:", error);
      toast.error("An error occurred while deleting sleep entry");
    }
  };

  React.useEffect(() => {
    getSleepData();
  }, [date]);

  return (
    <div className="popupout">
      <div className="popupbox">
        <button
          className="close"
          onClick={() => setShowSleepReportPopup(false)}
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
          id="outlined-basic"
          label="Sleep Duration (in hours)"
          variant="outlined"
          color="warning"
          type="number"
          value={sleepDuration || ""}
          onChange={(e) => setSleepDuration(parseFloat(e.target.value))}
        />

        <Button variant="contained" color="warning" onClick={saveSleepData}>
          Save
        </Button>

        <div className="hrline"></div>

        <div className="items">
          {records.length > 0 ? (
            records.map((record, index) => (
              <div className="item" key={index}>
                <h3>Date: {dayjs(record.date).format("DD MMM YYYY")}</h3>
                <h3>Duration: {record.durationInHrs} hours</h3>
                <button onClick={() => deleteSleepEntry(record)}>
                  <AiFillDelete />
                </button>
              </div>
            ))
          ) : (
            <p>No sleep records found for the selected date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SleepReportPopup;
