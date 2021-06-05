import { db } from '../../db'
import { base_api_image, method_payload } from '../base_api_image'
import {
  filters_struct,
  delete_record_payload,
  insert_record_payload,
  upsert_record_payload,
  get_records_payload,
  delete_record_type,
  list_record_payload,
  check_available_schedule,
  upsert_new_record_payload,
  selected_ids_object,
  schedule_object,
  current_auto_booking_status_payload,
  get_date_by_week_no_payload
} from './types'

class Api extends base_api_image {
  private handle_filters({ waiting_room_id }: filters_struct) {
    const filter_literals = []
    if (waiting_room_id)
      filter_literals.push(
        `${this.table_name}.waiting_room_id = ${waiting_room_id}`
      )
    return filter_literals.length
      ? `WHERE ${filter_literals.join(' AND ')}`
      : ''
  }

  public async schedule_already_exists({
    options: { clinic_id, start_time, end_time },
    client = db
  }: method_payload<check_available_schedule>) {
    const sql = `
      SELECT wrs.* 
       FROM 
      ${this.table_name} as wrs 
      WHERE 
      wrs."start_time" = TO_TIMESTAMP('${start_time}', 'YYYY-MM-DD HH24:MI:SS') AND
      wrs."end_time" = TO_TIMESTAMP('${end_time}', 'YYYY-MM-DD HH24:MI:SS') AND
      wrs."clinic_id" = '${clinic_id}'
      ORDER BY wrs.id LIMIT 1`
    return client.query(sql).then(({ rows }: any) => (rows.length ? rows[0] : null))
  }

  public async create_schedules({
    options: { current_object, schedule_element, clinic_id, date },
    client = db
  }: method_payload<insert_record_payload>) {
    await client.query(`SET timezone TO 'UTC';`)
    let values_fragment = `'${current_object.id}', `,
      columns_fragment =
        current_object.type === 'USER' ? 'user_id, ' : 'waiting_room_id, ',
      index = 1,
      schedule_object = {
        clinic_id: clinic_id,
        day_of_week: schedule_element.day_of_week,
        start_time: `${date} ${schedule_element.time_from}`,
        end_time: `${date} ${schedule_element.time_to}`
      } as any

    if (
      'clinic_consultation' in schedule_element &&
      Object.keys(schedule_element.clinic_consultation).length
    ) {
      schedule_object.clinic_consultation = true
      schedule_object.clinic_consultation_duration =
        schedule_element.clinic_consultation.duration
      schedule_object.clinic_consultation_price =
        schedule_element.clinic_consultation.price
      schedule_object.clinic_consultation_payment_mode =
        schedule_element.clinic_consultation.payment_mode
      schedule_object.clinic_consultation_clinic_approved =
        schedule_element.clinic_consultation.clinic_approved
    }

    if (
      'home_visit' in schedule_element &&
      Object.keys(schedule_element.home_visit).length
    ) {
      schedule_object.home_visit = true
      schedule_object.home_visit_duration = schedule_element.home_visit.duration
      schedule_object.home_visit_price = schedule_element.home_visit.price
      schedule_object.home_visit_payment_mode =
        schedule_element.home_visit.payment_mode
      schedule_object.home_visit_clinic_approved =
        schedule_element.home_visit.clinic_approved
    }

    if (
      'online_consultation' in schedule_element &&
      Object.keys(schedule_element.online_consultation).length
    ) {
      schedule_object.online_consultation = true
      schedule_object.online_consultation_duration =
        schedule_element.online_consultation.duration
      schedule_object.online_consultation_price =
        schedule_element.online_consultation.price
      schedule_object.online_consultation_payment_mode =
        schedule_element.online_consultation.payment_mode
      schedule_object.online_consultation_clinic_approved =
        schedule_element.online_consultation.clinic_approved
    }

    for (const each_key in schedule_object) {
      if (Object.keys(schedule_object).length === index) {
        columns_fragment += `${each_key}`
        if (each_key === 'start_time')
          values_fragment += `TO_TIMESTAMP('${schedule_object['start_time']}', 'YYYY-MM-DD HH24:MI:SS')`
        else if (each_key === 'end_time')
          values_fragment += `TO_TIMESTAMP('${schedule_object['end_time']}', 'YYYY-MM-DD HH24:MI:SS')`
        else values_fragment += `'${schedule_object[each_key]}'`
        // if (each_key === 'clinic_consultation_duration') {
        //   values_fragment += `INTERVAL '${schedule_object['clinic_consultation_duration']}m'`
        // } else if (each_key === 'online_consultation_duration') {
        //   values_fragment += `INTERVAL '${schedule_object['online_consultation_duration']}m'`
        // } else if (each_key === 'home_visit_duration') {
        //   values_fragment += `INTERVAL '${schedule_object['home_visit_duration']}m'`
        // }
      } else {
        columns_fragment += `${each_key}, `
        if (each_key === 'start_time')
          values_fragment += `TO_TIMESTAMP('${schedule_object['start_time']}', 'YYYY-MM-DD HH24:MI:SS'), `
        else if (each_key === 'end_time')
          values_fragment += `TO_TIMESTAMP('${schedule_object['end_time']}', 'YYYY-MM-DD HH24:MI:SS'), `
        else values_fragment += `'${schedule_object[each_key]}', `
        // if (each_key === 'clinic_consultation_duration') {
        //   values_fragment += `INTERVAL '${schedule_object['clinic_consultation_duration']}m', `
        // } else if (each_key === 'online_consultation_duration') {
        //   values_fragment += `INTERVAL '${schedule_object['online_consultation_duration']}m', `
        // } else if (each_key === 'home_visit_duration') {
        //   values_fragment += `INTERVAL '${schedule_object['home_visit_duration']}m', `
        // }
        index++
      }
    }

    let { rows } = await client.query(
      `INSERT INTO ${this.table_name} (${columns_fragment}) VALUES(${values_fragment}) RETURNING *`
    )
    return rows[0].id
  }

  public async schedules_list({
    options: { clinic_id, type },
    client = db
  }: method_payload<list_record_payload>) {
    return client
      .query(
        `SELECT 
        wrs.id, 
        wrs.waiting_room_id,
        wrs.user_id,
        wrs.day_of_week,
        (wrs."start_time"::timestamptz)::time as time_from,
        (wrs."end_time"::timestamptz)::time as time_to,
        CASE
          WHEN wrs."waiting_room_id" IS NOT null THEN
          json_build_object(
            'id', wr."id",
            'clinic_id', wr."clinic_id",
            'clinic', row_to_json(cli),
            'created_by', wr."created_by",
            'created_by_user', row_to_json(created_by_user),
            'title', wr."title",
            'avatar_id', wr."avatar_id",
            'avatar', row_to_json(attach),
            'open_from',wr."open_from",
            'open_to', wr."open_to",
            'booking_only', wr."booking_only",
            'per_invitation_only', wr."per_invitation_only",
            'medical_specializations_id', wr."medical_specializations_id",
            'medical_specializations', row_to_json(mswr),
            'telephone_id', wr."telephone_id",
            'telephone', row_to_json(wrt),
            'email', wr."email"           
          )
          ELSE null
        END as waiting_room,
        CASE
          WHEN wrs."user_id" IS NOT null THEN
          json_build_object(
            'id', u."id",
            'roleId', u."roleId",
            'countryId', u."countryId",
            'firstName', u."firstName",
            'lastName', u."lastName",
            'gender',u."gender",
            'addressId', u."addressId",
            'dob', u."dob",
            'photo', u."photo",
            'telephoneId', u."telephoneId",
            'telephone', row_to_json(ut),
            'clinic', row_to_json(cli),
            'medical_specializations_id', cps."medical_specialization_id",
            'medical_specializations', row_to_json(msuser),
            'medical_level_id', cps."medical_level_id",
            'medical_level', row_to_json(med_level)      
          )
          ELSE null
        END as user,
        CASE
            WHEN wrs."clinic_consultation" IS NOT null AND wrs."clinic_consultation" = true THEN
            json_build_object(
            'duration', wrs."clinic_consultation_duration", 
            'price', wrs."clinic_consultation_price",
            'payment_mode', wrs."clinic_consultation_payment_mode",
            'clinic_approved', wrs."clinic_consultation_clinic_approved"
            ) 
            ELSE null
        END as clinic_consultation,
        CASE
            WHEN wrs."online_consultation" IS NOT null AND wrs."online_consultation" = true THEN
            json_build_object(
            'duration', wrs."online_consultation_duration", 
            'price', wrs."online_consultation_price",
            'payment_mode', wrs."online_consultation_payment_mode",
            'clinic_approved', wrs."online_consultation_clinic_approved"
            )
            ELSE null
        END as online_consultation, 
        CASE
            WHEN wrs."home_visit" IS NOT null AND wrs."home_visit" = true THEN
            json_build_object(
            'duration', wrs."home_visit_duration", 
            'price', wrs."home_visit_price",
            'payment_mode', wrs."home_visit_payment_mode",
            'clinic_approved', wrs."home_visit_clinic_approved"
            ) 
            ELSE null
        END as home_visit
          FROM ${this.table_name} as wrs
          LEFT JOIN waiting_room as wr ON wr."id" = wrs."waiting_room_id"
          LEFT JOIN medical_specializations as mswr ON wr."medical_specializations_id" = mswr."id"
          LEFT JOIN clinics as cli ON cli."id" = wrs."clinic_id"
          LEFT JOIN users as u ON u."id" = wrs."user_id"
          LEFT JOIN clinic_positions as cps ON cps."user_id" = wrs."user_id" AND cps."clinic_id" =  wrs."clinic_id"
          LEFT JOIN medical_specializations as msuser ON cps."medical_specialization_id" = msuser."id" 
          LEFT JOIN medical_levels as med_level ON cps."medical_level_id" = med_level."id" 
          LEFT JOIN telephones as wrt ON wr."telephone_id" = wrt."id"
          LEFT JOIN telephones as ut ON u."telephoneId" = ut."id"
          LEFT JOIN attachments as attach ON wr."avatar_id" = attach."id"
          LEFT JOIN users as created_by_user ON wr."created_by" = created_by_user."id"
          WHERE wrs.${type}_id IS NOT null AND 
          wrs.clinic_id IS NOT null AND 
          wrs.clinic_id = '${clinic_id}'  
          GROUP BY wrs."id", wr."id", u."id", cli."id", wrt."id", ut."id", attach."id", created_by_user."id", cps."medical_specialization_id", mswr."id", msuser."id", med_level."id", cps."medical_level_id"
          ORDER BY wrs.id DESC`
      )
      .then(({ rows }:any) => {
        let data_array: any[] = []
        if (rows && rows.length) {
          rows.map((row: any, index: number) => {
            let type_id: string,
              indexx = 0

            if (row.waiting_room_id) type = 'waiting_room'
            type_id = 'waiting_room_id'
            if (row.user_id) type = 'user'
            type_id = 'user_id'

            if (!data_array.some((el): {} => el[type_id] === row[type_id])) {
              data_array.push({
                [type_id]: row[type_id],
                [type]: row[type],
                schedules: [
                  {
                    schedule_id: row.id,
                    time_from: row.time_from,
                    time_to: row.time_to,
                    day_of_week: row.day_of_week,
                    clinic_consultation: row.clinic_consultation,
                    online_consultation: row.online_consultation,
                    home_visit: row.home_visit
                  } as schedule_object
                ]
              })
              indexx = index
            } else {
              if (data_array[indexx][type_id] === row[type_id])
              console.log("data_array", data_array)
                data_array[indexx].schedules.push({
                  schedule_id: row.id,
                  time_from: row.time_from,
                  time_to: row.time_to,
                  day_of_week: row.day_of_week,
                  clinic_consultation: row.clinic_consultation,
                  online_consultation: row.online_consultation,
                  home_visit: row.home_visit
                } as schedule_object)
            }
          })
        }
        return {
          rows: data_array
        }
      })
  }

  public async upsert_schedules({
    options: { schedule, selected_ids, clinic_id, date },
    client = db
  }: method_payload<upsert_new_record_payload>) {
    await client.query(`SET timezone TO 'UTC';`)
    let update_fragment: string = '',
      where_fragment: string = '',
      index: number = 1,
      schedule_object = {
        clinic_id: clinic_id,
        day_of_week: schedule.day_of_week,
        start_time: `${date} ${schedule.time_from}`,
        end_time: `${date} ${schedule.time_to}`
      } as any

    if (
      'clinic_consultation' in schedule &&
      Object.keys(schedule.clinic_consultation).length
    ) {
      schedule_object.clinic_consultation = true
      schedule_object.clinic_consultation_duration =
        schedule.clinic_consultation.duration
      schedule_object.clinic_consultation_price =
        schedule.clinic_consultation.payment_mode > 0
          ? schedule.clinic_consultation.price
          : 0
      schedule_object.clinic_consultation_payment_mode =
        schedule.clinic_consultation.payment_mode
      schedule_object.clinic_consultation_clinic_approved =
        schedule.clinic_consultation.clinic_approved
    }

    if ('home_visit' in schedule && Object.keys(schedule.home_visit).length) {
      schedule_object.home_visit = true
      schedule_object.home_visit_duration = schedule.home_visit.duration
      schedule_object.home_visit_price =
        schedule.home_visit.payment_mode > 0 ? schedule.home_visit.price : 0
      schedule_object.home_visit_payment_mode = schedule.home_visit.payment_mode
      schedule_object.home_visit_clinic_approved =
        schedule.home_visit.clinic_approved
    }

    if (
      'online_consultation' in schedule &&
      Object.keys(schedule.online_consultation).length
    ) {
      schedule_object.online_consultation = true
      schedule_object.online_consultation_duration =
        schedule.online_consultation.duration
      schedule_object.online_consultation_price =
        schedule.online_consultation.payment_mode > 0
          ? schedule.online_consultation.price
          : 0
      schedule_object.online_consultation_payment_mode =
        schedule.online_consultation.payment_mode
      schedule_object.online_consultation_clinic_approved =
        schedule.online_consultation.clinic_approved
    }

    if ('schedule_id' in schedule && schedule.schedule_id) {
      update_fragment = `UPDATE ${this.table_name} SET `
      where_fragment = `WHERE id = '${schedule.schedule_id}'`
      for (const each_key in schedule_object) {
        if (Object.keys(schedule_object).length === index) {
          if (each_key === 'start_time')
            update_fragment += `${each_key} = TO_TIMESTAMP('${schedule_object['start_time']}', 'YYYY-MM-DD HH24:MI:SS')`
          else if (each_key === 'end_time')
            update_fragment += `${each_key} = TO_TIMESTAMP('${schedule_object['end_time']}', 'YYYY-MM-DD HH24:MI:SS')`
          else update_fragment += `${each_key} = '${schedule_object[each_key]}'`
          // if (each_key === 'clinic_consultation_duration') {
          //   update_fragment += `${each_key} = INTERVAL '${schedule_object['clinic_consultation_duration']}m'`
          // } else if (each_key === 'online_consultation_duration') {
          //   update_fragment += `${each_key} = INTERVAL '${schedule_object['online_consultation_duration']}m'`
          // } else if (each_key === 'home_visit_duration') {
          //   update_fragment += `${each_key} = INTERVAL '${schedule_object['home_visit_duration']}m'`
          // }
        } else {
          if (each_key === 'start_time')
            update_fragment += `${each_key} = TO_TIMESTAMP('${schedule_object['start_time']}', 'YYYY-MM-DD HH24:MI:SS'), `
          else if (each_key === 'end_time')
            update_fragment += `${each_key} = TO_TIMESTAMP('${schedule_object['end_time']}', 'YYYY-MM-DD HH24:MI:SS'), `
          else
            update_fragment += `${each_key} = '${schedule_object[each_key]}', `
          // if (each_key === 'clinic_consultation_duration') {
          //   update_fragment += `${each_key} = INTERVAL '${schedule_object['clinic_consultation_duration']}m', `
          // } else if (each_key === 'online_consultation_duration') {
          //   update_fragment += `${each_key} = INTERVAL '${schedule_object['online_consultation_duration']}m', `
          // } else if (each_key === 'home_visit_duration') {
          //   update_fragment += `${each_key} = INTERVAL '${schedule_object['home_visit_duration']}m', `
          // }
        }
        index++
      }
      return client
        .query(`${update_fragment} ${where_fragment}`)
        .then(({ rowCount }: any) => rowCount)
    } else {
      return await Promise.all(
        selected_ids.map(async (obj: selected_ids_object) => {
          return await this.create_schedules({
            options: {
              current_object: obj,
              schedule_element: schedule,
              clinic_id,
              date
            }
          })
        })
      )
    }
  }

  public async delete_schedules({
    options: { schedule_ids },
    client = db
  }: method_payload<delete_record_type>) {
    let done: number[] = []
    for await (const iterator of schedule_ids) {
      let data = await client.query(
        `DELETE FROM ${this.table_name} WHERE id = ${iterator}`
      )
      done = [...done, data.rowCount]
    }
    return done
  }

  public async current_auto_booking_status({
    options: { clinic_id },
    client = db
  }: method_payload<current_auto_booking_status_payload>) {
    const clinic_sql = `SELECT auto_booking_status FROM clinics WHERE id = '${clinic_id}'`
    let clinic_data = await client.query(clinic_sql)
    return clinic_data.rows.length ? clinic_data.rows[0] : {}
  }

  // Old api
  public delete_record({
    options: { filters },
    client = db
  }: method_payload<delete_record_payload>) {
    const sql = `DELETE FROM ${this.table_name} ${this.handle_filters(filters)}`
    return client.query(sql)
  }

  // Old api
  public async get_records({
    options: { filters },
    client = db
  }: method_payload<get_records_payload>) {
    const sql = `SELECT * FROM ${this.table_name} ${this.handle_filters(
      filters
    )}`
    return client.query(sql).then(({ rows }: any) => rows)
  }

  // Old api
  public upsert_record({
    options: { waiting_room_id, day_of_week, time_from, time_to },
    client = db
  }: method_payload<upsert_record_payload>) {
    const sql = `
            INSERT INTO ${this.table_name} (waiting_room_id, day_of_week, start_time, end_time)
            VALUES ($1,$2,$3,$4)
            RETURNING *
        `

    return client
      .query(sql, [
        waiting_room_id,
        day_of_week,
        `${new Date().toJSON().slice(0, 10)} ${time_from}`,
        `${new Date().toJSON().slice(0, 10)} ${time_to}`
      ])
      .then(({ rows }: any) => rows[0])
  }

  public async get_date_by_week_no({
    options: { made, operator },
    client = db
  }: method_payload<get_date_by_week_no_payload>) {
    let get_date_sql = `SELECT to_char(now(),'YYYY-MM-DD') as date`
    switch (operator) {
      case 'plus':
        get_date_sql = `SELECT to_char( (now() + INTERVAL '${made}d'),'YYYY-MM-DD') as date`
        break
      case 'minus':
        get_date_sql = `SELECT to_char( (now() - INTERVAL '${made}d'),'YYYY-MM-DD') as date`
        break
    }
    return client.query(get_date_sql)
  }
}

export const auto_booking_api = new Api({
  table_name: 'auto_booking_schedules'
})
