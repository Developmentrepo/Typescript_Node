export type consultation_type = {
  duration?: string
  price?: number
  payment_mode?: number
  clinic_approved?: boolean
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

export type insert_record_payload = {
  current_object: selected_ids_object
  schedule_element: any
  clinic_id: string
  date: string
}

export type upsert_record_payload = {
  waiting_room_id: number
  day_of_week: number
  time_from: string
  time_to: string
}

export type upsert_new_record_payload = {
  schedule: any
  selected_ids: selected_ids_object[]
  clinic_id: string
  date: string
}

export type list_record_payload = {
  clinic_id: string
  type: string
}

export type change_status_payload = {
  clinic_id: any
  toggle: any
}

export type update_gs_record_payload = {
  clinic_id: any
  body: any
}

export type check_admin = {
  user_id: string
  clinic_id: string
}

export type slots_for_day = {
  schedule_id: number
  waiting_room_id: any
  user_id: any
  clinic_id: string
  consultation_type: string
  date: string
}

export type check_available_schedule = {
  clinic_id: string
  start_time: string
  end_time: string
}

export type check_available_slot = {
  user_id: any
  waiting_room_id: any
  clinic_id: string
  slot_started: string
  slot_finished: string
  date: string
  event_type: string
}

export type filters_struct = {
  waiting_room_id?: number
}

export type delete_record_type = {
  schedule_ids: number[]
}

export type delete_record_payload = {
  filters: filters_struct
}

export type get_records_payload = {
  filters: filters_struct
}

export type current_auto_booking_status_payload = {
  clinic_id: string
}

export type get_date_by_week_no_payload = {
  made: number, 
  operator: string
}
