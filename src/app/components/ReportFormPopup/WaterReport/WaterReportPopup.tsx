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

interface WaterEntry {
  date: string;
  amountInMilliliters: number;
}

interface WaterReportPopupProps {
  setShowWaterReportPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WaterReportPopup: React.FC<WaterReportPopupProps> = ({
  setShowWaterReportPopup,
}) => {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [waterAmount, setWaterAmount] = React.useState<number | null>(null);
  const [records, setRecords] = React.useState<WaterEntry[]>([]);

  const saveWaterData = async () => {
    if (!date || !waterAmount) {
      toast.error("Please provide both date and water amount");
      return;
    }

    try {
      const formattedDate = date.toISOString();

      const payload = {
        date: formattedDate,
        amountInMilliliters: waterAmount,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/waterTrack/addwaterentry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Water data added successfully");
        getWaterData();
        setWaterAmount(null);
      } else {
        toast.error(data.message || "Failed to save water data");
      }
    } catch (error) {
      console.error("Error saving water data:", error);
      toast.error("An error occurred while saving water data");
    }
  };

  const getWaterData = async () => {
    try {
      const formattedDate = date?.toISOString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/waterTrack/getwaterbydate`,
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
        toast.error(data.message || "Failed to fetch water data");
      }
    } catch (error) {
      console.error("Error fetching water data:", error);
      toast.error("An error occurred while fetching water data");
    }
  };

  const deleteWaterEntry = async (entry: WaterEntry) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/waterTrack/deletewaterentry`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ date: entry.date }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Water entry deleted successfully");
        getWaterData();
      } else {
        toast.error(data.message || "Failed to delete water entry");
      }
    } catch (error) {
      console.error("Error deleting water entry:", error);
      toast.error("An error occurred while deleting water entry");
    }
  };

  React.useEffect(() => {
    getWaterData();
  }, [date]);

  return (
    <div className="popupout">
      <div className="popupbox">
        <button
          className="close"
          onClick={() => setShowWaterReportPopup(false)}
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
          label="Water Amount (in milliliters)"
          variant="outlined"
          color="primary"
          type="number"
          value={waterAmount || ""}
          onChange={(e) => setWaterAmount(parseFloat(e.target.value))}
        />

        <Button variant="contained" color="primary" onClick={saveWaterData}>
          Save
        </Button>

        <div className="hrline"></div>

        <div className="items">
          {records.length > 0 ? (
            records.map((record, index) => (
              <div className="item" key={index}>
                <h3>Date: {dayjs(record.date).format("DD MMM YYYY")}</h3>
                <h3>Amount: {record.amountInMilliliters} ml</h3>
                <button onClick={() => deleteWaterEntry(record)}>
                  <AiFillDelete />
                </button>
              </div>
            ))
          ) : (
            <p>No water records found for the selected date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterReportPopup;
