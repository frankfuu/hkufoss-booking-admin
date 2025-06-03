import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, Typography, CircularProgress, Container, IconButton, Button, Box } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, BorderColor } from "@mui/icons-material";
import { useCustom, useGetIdentity } from "@refinedev/core";
import { addDays, subDays, format } from "date-fns";
import moment from "moment";
import "moment-timezone";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAutocomplete } from "@refinedev/mui";
import "./custom-calendar.css";
import { k } from "../../common/constants";

const localizer = momentLocalizer(moment);
const allViews = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA];

const getFirstSundayOfWeek = () => {
  const d = new Date();
  const currentDay = d.getDay();
  const diffToSunday = -currentDay;
  d.setDate(d.getDate() + diffToSunday);
  return d;
};

function getFirstSundayOfCurrentMonth2() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const firstSunday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  return new Date(today.getFullYear(), today.getMonth(), firstSunday);
}

const CustomEvent2 = ({ event }: any) => {
  return (
    <Typography variant="h6" style={{ textAlign: "center" }}>
      {event.title}
    </Typography>
  );
};

export const AvailableDaysList = ({ onSlotSelect, resourceId, calendarHeight }: any) => {
  const { data: user } = useGetIdentity<IUser>();
  const [weekStartDate, setWeekStartDate] = useState(getFirstSundayOfWeek());
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]); // State for RBC events
  const [from, setFrom] = useState(format(getFirstSundayOfWeek(), "yyyy-MM-dd"));
  const [to, setTo] = useState(format(addDays(weekStartDate, 7), "yyyy-MM-dd"));

  const { data, isLoading, error } = useCustom({
    url: `resources/available-days?from=${from}&to=${to}&resourceId=${resourceId}`,
    method: "get",
    queryOptions: {
      // enabled: !!selectedService?.id,
    },
  });

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  interface TimeSlot {
    from: string;
    to: string;
    resourceId: number;
    resourceName: string;
    hasBookingConflict: boolean;
    hasException: boolean;
    bookingId?: number;
    bookingStatus?: string;
    exceptionId?: string;
    inPast: boolean;
    subResourcesMeta: SubResourcesMeta;
  }

  interface SubResourcesMeta {
    resourcesCount: number;
    resourcesAvailableCount: number;
  }

  const getSlotText = (slot: TimeSlot): string => {
    const parts: string[] = [];

    if (slot.hasException) {
      parts.push(`Closed`);
      // parts.push(`Closed (ID: ${slot.exceptionId || ""})`);
    }

    if (slot.hasBookingConflict) {
      parts.push(`${capitalizeFirstLetter(slot.bookingStatus || "")}`);
      // parts.push(`${capitalizeFirstLetter(slot.bookingStatus || "")} (${slot.bookingId || ""})`);
    }

    if (!slot.hasBookingConflict && !slot.hasException && !slot.inPast) {
      parts.push("Select");

      if (slot.subResourcesMeta && slot.subResourcesMeta.resourcesCount > 0) {
        parts.push(` (${slot.subResourcesMeta.resourcesAvailableCount}/${slot.subResourcesMeta.resourcesCount})`);
      }
    }

    return parts.join(" ");
  };

  // Transform API data into RBC event structure
  useEffect(() => {
    if (data?.data) {
      const events = data.data.flatMap((day: { date: string; timeSlots: any[]; resourceId: number }) =>
        day.timeSlots.map(
          (slot: {
            from: string;
            to: string;
            resourceId: number;
            resourceName: string;
            hasBookingConflict: boolean;
            hasException: boolean;
            bookingId: number;
            bookingStatus: string;
            exceptionId: string;
            inPast: boolean;
            subResourcesMeta?: SubResourcesMeta;
          }) => {
            // Ensure subResourcesMeta is present, provide default if missing
            const slotWithMeta = {
              ...slot,
              subResourcesMeta: slot.subResourcesMeta ?? { resourcesCount: 0, resourcesAvailableCount: 0 },
            };
            return {
              title: (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Typography variant="body2" textAlign="center" sx={{ fontSize: "0.9rem", lineHeight: 1.2 }}>
                    {getSlotText(slotWithMeta)}
                  </Typography>
                </Box>
              ),
              start: new Date(`${day.date}T${slot.from}`), // Combine date and time for start
              end: new Date(`${day.date}T${slot.to}`), // Combine date and time for end
              meta: {
                slot: slotWithMeta,
                date: day.date,
              },
            };
          }
        )
      );
      setCalendarEvents(events); // Update calendar events
    }
  }, [data]);

  // Custom Event Style
  const eventPropGetter = (event: any) => {
    // const defaultColor = " #689F38";
    const defaultColor = k.COLORS.HKU_GREEN;
    const exceptionColor = " black";
    // const bookingConflictColor = " lightcoral";
    const bookingConflictColor = k.COLORS.HKU_WARM_RED_U_2X;
    // const partiallyBookedColor = " LightSeaGreen";
    const partiallyBookedColor = k.COLORS.HKU_PANTONE_346U_SEAGREEN;

    const hasB = event.meta.slot.hasBookingConflict;
    const hasE = event.meta.slot.hasException;
    const partiallyBooked =
      event.meta.slot.subResourcesMeta &&
      event.meta.slot.subResourcesMeta.resourcesCount != event.meta.slot.subResourcesMeta.resourcesAvailableCount;
    let bgColor = hasB ? bookingConflictColor : defaultColor;
    const parentOnlyResource = event.meta.slot.subResourcesMeta.resourcesCount == 0;

    bgColor = hasE ? exceptionColor : bgColor;
    bgColor = partiallyBooked ? partiallyBookedColor : bgColor;
    return {
      style: {
        backgroundColor: bgColor,
        borderColor: bgColor,
        borderRadius: "0px", // Optional: Add rounded corners
        padding: "2px", // Optional: Add padding
        opacity: event.meta.slot.inPast || (parentOnlyResource && user?.roleId == k.ROLES.STUDENT) ? 0.3 : 1,
      },
    };
  };

  if (isLoading) return <CircularProgress style={{ display: "block", margin: "auto" }} />;
  if (error) return <div>Error loading data</div>;

  const handleRangeChange = (range: any) => {
    const start = range.start || range[0];
    const end = range.end || range[range.length - 1];

    const f = format(start, "yyyy-MM-dd");
    const t = format(end, "yyyy-MM-dd");

    setFrom(f);
    setTo(t);
  };

  const handleEventClick = (event: any) => {
    onSlotSelect(event?.meta);
  };

  return (
    <Grid justifyContent="center" sx={{ flex: 1 }}>
      <Calendar
        events={calendarEvents} // Use the transformed events here
        localizer={localizer}
        allDayAccessor={(event) => false} // Disable all-day behavior entirely
        startAccessor="start"
        endAccessor="end"
        min={new Date(0, 0, 0, 7, 0, 0)}
        max={new Date(0, 0, 0, 19, 0, 0)}
        step={60} // 1 slot per hour
        timeslots={1} // No subdivisions, 1 row per hour
        style={{ width: "80%", height: calendarHeight || 430 }}
        views={allViews}
        defaultView={Views.WEEK}
        formats={{
          eventTimeRangeFormat: () => "", // Hide time range in Week/Day views
          eventTimeRangeStartFormat: () => "",
          eventTimeRangeEndFormat: () => "",
        }}
        components={{
          // event: CustomEvent2,
          week: {
            // event: CustomEvent2,
          },
        }}
        eventPropGetter={eventPropGetter}
        onRangeChange={handleRangeChange}
        onSelectEvent={handleEventClick}
      />
    </Grid>
  );
};

export default AvailableDaysList;
