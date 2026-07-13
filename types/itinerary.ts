import React from "react";

export interface ScheduleAlt {
  time?: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
  iconName?: string;
  mapQuery?: string;
  mapUrl?: string;
  routeUrl?: string;
  websiteUrl?: string;
  prevTravelTime?: string;
  nextTravelTime?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
  iconName?: string;
  travelTime?: string;
  mapQuery?: string;
  mapUrl?: string;
  routeUrl?: string;
  websiteUrl?: string;
  tags?: string[];
  alt?: ScheduleAlt;
}

export interface DayItinerary {
  id: string;
  title: string;
  date: string;
  schedules: ScheduleItem[];
}

export interface CostItem {
  item: string;
  price: string;
  note: string;
  isTotal?: boolean;
  isPerPerson?: boolean;
}
