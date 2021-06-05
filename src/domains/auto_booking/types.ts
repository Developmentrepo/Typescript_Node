export type consultation_type = {
  duration: string
  price: number
  payment_mode: number
  clinic_approved: boolean
}

export type selected_ids_object = {
  type: string
  id: any
}

export type schedule_object = {
  schedule_id?: number
  day_of_week: number
  time_from: string
  time_to: string
  clinic_consultation?: consultation_type
  home_visit?: consultation_type
  online_consultation?: consultation_type
}

export type create_auto_booking_schedule = {
  clinic_id: string
  selected_ids: selected_ids_object[]
  schedules: schedule_object[]
}

export type list_auto_booking_schedules = {
  clinic_id: string
  type: string
}

export type update_auto_booking_schedule = {
  clinic_id: string
  selected_ids: selected_ids_object[]
  schedules: schedule_object[]
}

export type delete_auto_booking_schedule = {
  schedule_ids: number[]
}

export type status_auto_booking_clinic = {
  clinic_id: string
}
