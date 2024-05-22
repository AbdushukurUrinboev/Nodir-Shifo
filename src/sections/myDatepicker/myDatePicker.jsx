import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "./styleDatePicker.css"



const MyDatePicker = ({startDate, setStartDate, endDate, setEndDate}) => {

    return (
        <>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                wrapperClassName="customStyleDatePicker"

            />
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                wrapperClassName="customStyleDatePicker"
            />
        </>
    );
};

export default MyDatePicker;
