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

interface StepEntry {
  date: string;
  steps: number;
}

interface StepsReportPopupProps {
  setShowStepsReportPopup: React.Dispatch<React.SetStateAction<boolean>>; // This should stay the same
}

const StepsReportPopup: React.FC<StepsReportPopupProps> = ({
  setShowStepsReportPopup,
}) => {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [steps, setSteps] = React.useState<number | null>(null);
  const [records, setRecords] = React.useState<StepEntry[]>([]);

  const saveStepData = async () => {
    if (!date || !steps) {
      toast.error("Please provide both date and steps count");
      return;
    }

    try {
      const formattedDate = date.toISOString();

      const payload = {
        date: formattedDate,
        steps,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/stepTrack/addstepentry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Steps data added successfully");
        await getStepData(); // Refresh records after saving the data
        setSteps(null); // Reset input field
      } else {
        toast.error(data.message || "Failed to save steps data");
      }
    } catch (error) {
      console.error("Error saving steps data:", error);
      toast.error("An error occurred while saving steps data");
    }
  };

  // Function to get step data for the selected date
  const getStepData = async () => {
    if (!date) return; // Prevent calling API if date is null
    try {
      const formattedDate = date.toISOString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/stepTrack/getstepsbydate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ date: formattedDate }),
        }
      );
  
      const text = await response.text(); // Get the response as text first
      console.log("API Response:", text); // Log the raw response
  
      try {
        const data = JSON.parse(text); // Attempt to parse the response as JSON
        if (response.ok) {
          console.log("Parsed Data:", data); // Check if the data structure is correct
          setRecords(data.data || []);
        } else {
          console.error(data.message || "Failed to fetch steps data");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.error("An error occurred while parsing the response.");
      }
    } catch (error) {
      console.error("Error fetching steps data:", error);
      console.error("An error occurred while fetching steps data");
    }
  };
  

  const deleteStepEntry = async (entry: StepEntry) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/stepTrack/deletestepentry`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ date: entry.date }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Steps entry deleted successfully");
        await getStepData(); // Refresh records after deleting the entry
      } else {
        toast.error(data.message || "Failed to delete steps entry");
      }
    } catch (error) {
      console.error("Error deleting steps entry:", error);
      toast.error("An error occurred while deleting steps entry");
    }
  };

  React.useEffect(() => {
    getStepData();
  }, [date]);

  return (
    <div className="popupout">
      <div className="popupbox">
        <button
          className="close"
          onClick={() => setShowStepsReportPopup(false)} // Close popup when button is clicked
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
          label="Steps Count"
          variant="outlined"
          color="warning"
          type="number"
          value={steps || ""}
          onChange={(e) => setSteps(parseInt(e.target.value))}
        />

        <Button variant="contained" color="warning" onClick={saveStepData}>
          Save
        </Button>

        <div className="hrline"></div>

        <div className="items">
          {records.length > 0 ? (
            records.map((record, index) => (
              <div className="item" key={index}>
                <h3>Date: {dayjs(record.date).format("DD MMM YYYY")}</h3>
                <h3>Steps: {record.steps}</h3>
                <button onClick={() => deleteStepEntry(record)}>
                  <AiFillDelete />
                </button>
              </div>
            ))
          ) : (
            <p>No steps records found for the selected date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepsReportPopup;
