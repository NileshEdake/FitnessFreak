"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import "./HomeBanner2.css";

interface Workout {
  type: string;
  imageUrl: string;
  durationInMin: number;
}

const HomeBanner2: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [data, setData] = React.useState<any[] | null>(null);

  const getWorkouts = () => {
    const data: Workout[] = [
      {
        type: "Chest",
        imageUrl:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
        durationInMin: 30,
      },
      {
        type: "Abs",
        imageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        durationInMin: 90,
      },
      {
        type: "Shoulder",
        imageUrl:
          "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
        durationInMin: 40,
      },
      {
        type: "Back",
        imageUrl:
          "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        durationInMin: 70,
      },
      {
        type: "Biceps",
        imageUrl:
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
        durationInMin: 50,
      },
      {
        type: "Triceps",
        imageUrl:
          "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        durationInMin: 60,
      },
    ];
    setWorkouts(data);
  };

 

  const getData = async () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + "/workoutplans/workouts", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          setData(data.data);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setData([]);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {data && (
        <div>
          <h1 className="mainhead1">Workouts</h1>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {data &&
              data.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="swiper-slide"
                    style={{
                      backgroundImage: `url(${item.imageURL})`,
                    }}
                    onClick={() => {
                      window.location.href = `/workout?id=${item._id}`;
                    }}
                  >
                    <div className="swiper-slide-content">
                      <h2>{item.name}</h2>
                      <p>{item.durationInMinutes} min</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default HomeBanner2;
