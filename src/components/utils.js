import React from 'react'
import { Label } from 'semantic-ui-react'

export function checkDate(date) {
  const date1 = new Date(date);
  const date2 = new Date();
  return Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) ) /(1000 * 60 * 60 * 24));
}

export function checkTime(time) {
  let hour = time.match(/\d+/)
  hour = parseInt(hour[0])
  let minute = time.match(/(?<=:)\d+/)
  minute = parseInt(minute[0])
  let meridiem = time.match(/\w+$/ig)
  if(meridiem[0] === "PM"){
      hour += 12
  }
  hour = hour * 60
  let minutes = minute + hour
  return minutes
}

export function checkRecent(items) {
  let sorted = items.sort((a,b) => (((checkDate(a.date)) * 1440) - (checkTime(a.time)) - (((checkDate(b.date)) * 1440) - (checkTime(b.time))) ))
  return sorted
}

export function getTime() {
  let date = new Date()
  let minute = date.getMinutes()
  if(minute < 10){
    minute = "0" + minute
  }
  let meridiem = "AM"
  let hour = date.getHours()
  if(hour > 12){
    hour -= 12
    meridiem = "PM"
  } else if(hour === 0) {
    hour = 12
  }
  return `${hour}:${minute} ${meridiem}`
}

export function getDate() {
  let date = new Date()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let year = date.getFullYear()
  return `${month}/${day}/${year}`
}

export function tagIt(date) {
  const days = checkDate(date)
  if(days <= 1) {
    return <Label as='a' color='red' tag>Active</Label>
  } else if(days <= 2) {
    return <Label as='a' color='orange' tag>Active</Label>
  } else if(days <= 3) {
    return <Label as='a' color='blue' tag>Active</Label>
  } else {
    return null
  }
}