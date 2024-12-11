"use client";
import React from "react";
import "./workoutPage.css";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [data, setData] = React.useState<any>(null);
  const searchParams = useSearchParams();
  const workoutid = searchParams.get("id");

  const getWorkout = async () => {
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_API +
        "/workoutplans/workouts/" +
        workoutid,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setData(data.data);
        } else {
          setData(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    getWorkout();
  }, []);

  return (
<>
  {data && (
    <div className="workout">
      <h1 className="mainhead1">{data?.name} Day</h1>

      {/* Display total exercises planned */}
      <div className="workout__exercises">
      

      {
      data?.exercises.map((item: any, index: number) => (
        <div
          key={item._id || index} // Add a unique key
          className={
            index % 2 === 0
              ? "workout__exercise"
              : "workout__exercise workout__exercise--reverse"
          }
        >
          <h3>{index + 1}</h3>
          <div className="workout__exercise__image">
            <img src={item.imageURL} alt={item.name} />
          </div>
          <div className="workout__exercise__content">
            <h2>{item.name}</h2>
            <span>
              {item.sets} sets X {item.reps} reps
            </span>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  )}
</>

  );
};

export default Page;
