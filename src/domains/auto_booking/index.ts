import {
  create_auto_booking_schedule,
  schedule_object,
  delete_auto_booking_schedule,
  list_auto_booking_schedules,
  status_auto_booking_clinic,
  update_auto_booking_schedule
} from './types'
import { auto_booking_api } from '../../features/auto_booking/index'
import { EXCEPTION_MESSAGES } from '../../constants'
import { Validate } from '../../etc/helpers'
const { ON_NOT_ADMIN_OF_THE_CLINIC_EX } = EXCEPTION_MESSAGES

export class auto_booking_domain {
  @Validate((args) => args[0], {
    clinic_id: 'uuid',
    selected_ids: {
      type: 'array',
      empty: false,
      items: {
        type: 'object',
        props: {
          type: {
            type: 'string',
            enum: ['USER', 'WAITING_ROOM']
          },
          id: ['uuid', 'number']
        }
      }
    },
    schedules: {
      type: 'array',
      empty: false,
      items: {
        type: 'object',
        props: {
          time_from: 'string',
          time_to: 'string',
          clinic_consultation: {
            type: 'object',
            optional: true,
            props: {
              duration: {
                // type: 'number',
                // integer: true,
                // positive: true,
                type: 'string',
                optional: true
              },
              price: {
                type: 'number',
                optional: true
              },
              payment_mode: {
                type: 'number',
                optional: true
              },
              clinic_approved: {
                type: 'boolean',
                optional: true,
                convert: true
              }
            }
          },
          online_consultation: {
            type: 'object',
            optional: true,
            props: {
              duration: {
                // type: 'number',
                // integer: true,
                // positive: true,
                type: 'string',
                optional: true
              },
              price: {
                type: 'number',
                optional: true
              },
              payment_mode: {
                type: 'number',
                optional: true
              },
              clinic_approved: {
                type: 'boolean',
                optional: true,
                convert: true
              }
            }
          },
          home_visit: {
            type: 'object',
            optional: true,
            props: {
              duration: {
                // type: 'number',
                // integer: true,
                // positive: true,
                type: 'string',
                optional: true
              },
              price: {
                type: 'number',
                optional: true
              },
              payment_mode: {
                type: 'number',
                optional: true
              },
              clinic_approved: {
                type: 'boolean',
                optional: true,
                convert: true
              }
            }
          }
        }
      }
    }
  })
  static async create_auto_booking_schedules({
    clinic_id,
    selected_ids,
    schedules
  }: create_auto_booking_schedule) {
    let final: any[] = []
    if (Array.isArray(selected_ids) && selected_ids.length)
      for await (const current_object of selected_ids) {
        let schedules_promises = schedules.map(
          async (schedule_element: schedule_object) => {
            const date = await this.get_date_by_day({
              day_of_week: schedule_element.day_of_week as number
            })

            if (
              !(await auto_booking_api.schedule_already_exists({
                options: {
                  clinic_id: clinic_id as string,
                  start_time: `${date} ${schedule_element.time_from}` as string,
                  end_time: `${date} ${schedule_element.time_to}` as string
                }
              }))
            )
              return auto_booking_api.create_schedules({
                options: {
                  current_object,
                  schedule_element,
                  clinic_id,
                  date
                }
              })
            else return EXCEPTION_MESSAGES.ON_SCHEDULE_ALREADY_EXISTS
          }
        )
        final = [...final, ...schedules_promises]
      }
    return await Promise.all(final)
  }

  @Validate((args) => args[0], {
    clinic_id: 'uuid',
    type: {
      type: 'string',
      enum: ['waiting_room', 'user']
    }
  })
  static async auto_booking_schedules_list({
    clinic_id,
    type
  }: list_auto_booking_schedules) {
    return auto_booking_api.schedules_list({
      options: { clinic_id, type }
    })
  }

  @Validate((args) => args[0], {
    clinic_id: 'uuid',
    selected_ids: {
      type: 'array',
      empty: true,
      items: {
        type: 'object',
        props: {
          type: {
            type: 'string',
            enum: ['USER', 'WAITING_ROOM']
          },
          id: ['uuid', 'number']
        }
      }
    },
    schedules: {
      type: 'array',
      empty: false,
      items: {
        type: 'object',
        props: {
          schedule_id: {
            type: 'number',
            optional: true,
            integer: true,
            positive: true
          },
          day_of_week: 'number',
          time_from: 'string',
          time_to: 'string',
          clinic_consultation: {
            type: 'object',
            optional: true,
            props: {
              duration: {
                // type: 'number',
                // integer: true,
                // positive: true,
                type: 'string',
                optional: true
              },
              price: {
                type: 'number',
                optional: true
              },
              payment_mode: {
                type: 'number',
                optional: true
              },
              clinic_approved: {
                type: 'boolean',
                optional: true,
                convert: true
              }
            }
          },
          online_consultation: {
            type: 'object',
            optional: true,
            props: {
              duration: {
                // type: 'number',
                // integer: true,
                // positive: true,
                type: 'string',
                optional: true
              },
              price: {
                type: 'number',
                optional: true
              },
              payment_mode: {
                type: 'number',
                optional: true
              },
              clinic_approved: {
                type: 'boolean',
                optional: true,
                convert: true
              }
            }
          },
          home_visit: {
            type: 'object',
            optional: true,
            props: {
              duration: {
                // type: 'number',
                // integer: true,
                // positive: true,
                type: 'string',
                optional: true
              },
              price: {
                type: 'number',
                optional: true
              },
              payment_mode: {
                type: 'number',
                optional: true
              },
              clinic_approved: {
                type: 'boolean',
                optional: true,
                convert: true
              }
            }
          }
        }
      }
    }
  })
  static async upsert_auto_booking_schedules({
    schedules,
    selected_ids,
    clinic_id
  }: update_auto_booking_schedule) {
    return await Promise.all(
      schedules.map(async (schedule_element: schedule_object) => {
        const date = await this.get_date_by_day({
          day_of_week: schedule_element.day_of_week as number
        })
        return auto_booking_api.upsert_schedules({
          options: { schedule: schedule_element, selected_ids, clinic_id, date }
        })
      })
    )
  }

  @Validate((args) => args[0], {
    clinic_id: 'uuid',
    schedule_ids: {
      type: 'array',
      empty: false
    }
  })
  static async delete_auto_booking_schedules({
    schedule_ids
  }: delete_auto_booking_schedule) {
    return auto_booking_api.delete_schedules({ options: { schedule_ids } })
  }

  @Validate((args) => args[0], {
    clinic_id: 'uuid'
  })
  static async current_auto_booking_status({
    clinic_id
  }: status_auto_booking_clinic) {
    return auto_booking_api.current_auto_booking_status({
      options: { clinic_id }
    })
  }

  @Validate((args) => args[0], {
    day_of_week: 'number'
  })
  static async get_date_by_day({ day_of_week }: { day_of_week: number }) {
    let current_day_no = new Date().getDay(),
      final_days = Math.abs(day_of_week - current_day_no)

    if (day_of_week === current_day_no) return new Date().toJSON().slice(0, 10)
    else if (day_of_week < current_day_no) {
      const minus = await auto_booking_api.get_date_by_week_no({
        options: {
          made: final_days,
          operator: 'minus'
        }
      })
      return minus.rows[0].date
    } else if (day_of_week > current_day_no) {
      const plus = await auto_booking_api.get_date_by_week_no({
        options: {
          made: final_days,
          operator: 'plus'
        }
      })
      return plus.rows[0].date
    }
  }
}
