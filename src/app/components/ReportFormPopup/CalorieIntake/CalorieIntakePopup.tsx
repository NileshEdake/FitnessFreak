import React from "react";
import "../popup.css";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { toast } from "react-toastify";

interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({
  setShowCalorieIntakePopup,
}) => {
  const color = "#ffc20e";

  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [time, setTime] = React.useState<Dayjs | null>(dayjs());

  const [calorieIntake, setCalorieIntake] = React.useState<any>({
    item: "",
    date: "",
    quantity: "",
    quantityType: "g",
  });

  const [items, setItems] = React.useState<any>([1]);

  const saveCalorieIntake = async () => {
    try {
      // Combine date and time into a single Date object
      const tempdate = date?.toDate(); // Convert Dayjs to a JS Date object
      const temptime = time?.toDate(); // Convert Dayjs to a JS Date object

      const combinedDateTime = new Date(
        tempdate.getFullYear(),
        tempdate.getMonth(),
        tempdate.getDate(),
        temptime.getHours(),
        temptime.getMinutes(),
        temptime.getSeconds()
      );

      const formattedDate = combinedDateTime.toString(); // Convert to required string format

      const payload = {
        item: calorieIntake.item,
        date: formattedDate, // Use the formatted date string
        quantity: parseFloat(calorieIntake.quantity), // Ensure it's a number
        quantitytype: calorieIntake.quantityType, // Correct field name
      };

      console.log("Payload being sent:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/calorieintake/addcalorieintake`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok && data.ok) {
        toast.success("Calorie intake added successfully");
        await getCalorieIntake();
      } else {
        console.error("Backend response:", data);
        toast.error(data.message || "Error in adding calorie intake");
      }
    } catch (error) {
      console.error("Error in saving calorie intake:", error);
      toast.error("Error in adding calorie intake");
    }
  };

  const getCalorieIntake = async () => {
    setItems([]);
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API +
        "/calorieintake/getcalorieintakebydate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date: date,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          console.log(data.data);
          setItems(data.data);
        } else {
          toast.error("Error in getting calorie intake");
        }
      })
      .catch((err) => {
        toast.error("Error in getting calorie intake");
        console.log(err);
      });
  };

  const deleteCalorieIntake = async (item: any) => {
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API +
        "/calorieintake/deletecalorieintake",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          item: item.item,
          date: item.date,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success("Calorie intake item deleted successfully");
          getCalorieIntake();
        } else {
          toast.error("Error in deleting calorie intake");
        }
      })
      .catch((err) => {
        toast.error("Error in deleting calorie intake");
        console.log(err);
      });
  };

  React.useEffect(() => {
    getCalorieIntake();
  }, [date]);

  const selectedDay = (val: Dayjs | null) => {
    setDate(val);
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        <button
          className="close"
          onClick={() => {
            setShowCalorieIntakePopup(false);
          }}
        >
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={date}
            onChange={(newValue) => {
              selectedDay(newValue);
            }}
          />
        </LocalizationProvider>

        <TextField
          id="outlined-basic"
          label="Food item name"
          variant="outlined"
          color="warning"
          onChange={(e) => {
            setCalorieIntake({ ...calorieIntake, item: e.target.value });
          }}
        />

        <TextField
          id="outlined-basic"
          label="Food item amount (in gms)"
          variant="outlined"
          color="warning"
          type="number"
          onChange={(e) => {
            setCalorieIntake({ ...calorieIntake, quantity: e.target.value });
          }}
        />

        <div className="timebox">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Time picker"
              value={time}
              onChange={(newValue) => setTime(newValue)}
            />
          </LocalizationProvider>
        </div>

        <Button variant="contained" color="warning" onClick={saveCalorieIntake}>
          Save
        </Button>

        <div className="hrline"></div>
        <div className="items">
          {items.map((item: any, index: number) => (
            <div className="item" key={item.id || index}>
              <h3>{item.item}</h3>
              <h3>
                {item.quantity} {item.quantitytype}
              </h3>
              <button onClick={() => deleteCalorieIntake(item)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalorieIntakePopup;
