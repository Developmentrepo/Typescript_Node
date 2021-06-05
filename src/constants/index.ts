export const EXCEPTION_MESSAGES = {
  ON_ROUTE_NOT_FOUND_EXCEPTION: 'Not found', // 404
  ON_WRONG_INPUT_EXCEPTION: 'Please check input params', // 400
  ON_AUTH_FAILED_EXCEPTION: 'Authorization error', // 403
  ON_UNHANDLED_ERROR_EXCEPTION: 'Internal server error', // 500
  EVENT_DOES_NOT_EXIST_EXCEPTION: 'Event does not exist',
  INVALID_EVENT: 'Event not found or Event is not associated with this clinic',
  ON_LOCATION_NOT_FOUND: 'failed to geocode provided location',
  ON_BAD_START_EXCEPTION:
    'Configuration failed! Please check docs and provide all necessary env variables',
  ON_ACCESS_DENIED_EXCEPTION: 'Access denied',
  ACTION_NOT_PERMITTED: 'Not allowed to perform this action',
  ON_COUNTRY_WITH_PROVIDED_CODE_DOES_NOT_EXIST_EX:
    'country with provided country code does not exist',
  ON_NUMBER_IS_NOT_VALID_EX: 'Provided number is not valid',
  ON_FAILED_PROCEED_MOBILE_NUMBER_EX: 'failed to proceed mobile number',
  ON_NOT_ADMIN_OF_THE_CLINIC_EX:
    'you must be clinic administrator to perform this action',
  ON_NOT_CLINIC_STUFF_EX:
    'you have to be a member of the clinic to perform this action',
  ON_NOT_CLINIC_MEMBER_EX:
    'user must be a member of the clinic to be upgraded to clinic administrator',
  ON_CANT_LEAVE_ACTIVE_CLINIC_EX: 'you can not leave active clinic',
  ON_COUNTRY_NOT_FOUND_EX: 'Country not found',
  ON_USER_TOKEN_OBTAIN_TIMEOUT: 'Timeouted to receive user token',
  ON_WSS_NOT_REGISTERED:
    'WSS not registered...Message would be cached until registration...',
  ON_CLINIC_DEPARTMENT_DOES_NOT_BELONG_TO_CHOSEN_CLINIC:
    'Chosen clinic department does not exist in this clinic',
  ON_CLINIC_DEPARTMENT_REQUIRED:
    'Clinic department pick is required to check into this clinic',
  ON_WAITING_ROOM_ROOM_PRIVATE_EX: 'This waiting room is for booking only',
  ON_WAITING_ROOM_INVITES_ONLY_EX: 'This waiting room is by invites only',
  CANT_BE_MOVED_HAS_PICKED_PATIENTS_EX:
    'This doctor can not be moved until he release patients',
  ALREADY_MEMBER_OF_WAITING_ROOM_EX:
    'You are already in the queue of this waiting room',
  ON_CLINIC_SAVING_EX: 'Error while saving clinic',
  ON_ADDRESS_SAVING_EX: 'Error while saving address',
  ON_CLINIC_NOT_FOUND_EX: 'Clinic not found',
  ON_UPDATE_SUBSCRIPTION_EX: 'Please, update your subscription',
  ON_MONITORING_PATIENTS_LIMIT_REACHED_EX:
    'You have exceeded the maximum monitoring patients count',
  ON_DOMAIN_NAME_TAKEN_EX: 'This domain name is already taken',
  ON_INVALID_DOMAIN_EX: 'Invalid domain name',
  ON_DELETE_APPROVED_DOC_EX: 'Cannot delete the approved document',
  ON_ONLINE_CONSULTATION_BLOCKED:
    'Online consultations are blocked. Contact your clinic administrator.',
  ON_FAILED_PROCEED_TEL_NUMBER_EX: 'failed to proceed telephone number',
  ON_FAILED_LOGIN_PASS_FHIR:
    'Username and password can be changed only together',
  ON_FAILED_NOTHING_TO_UPDATE: 'Nothing to update',
  ON_INVALID_STATUS_APPROVED:
    "Invalid status provided. Only 'approved' is allowed",
  ON_INVALID_STATUS_REJECTED:
    "Invalid status provided. Only 'rejected' is allowed",
  ON_SLOT_APPROVED: 'Slot is alredy approved',
  ON_SLOT_REJECTED: 'Slot is alredy rejected',
  ON_SCHEDULE_ALREADY_EXISTS:
    'Schedule with provided time_from and time_to already exists. Please try with another',
  ON_DATA_NOT_FOUND_DATE: 'No data found for provided date',
  ON_NO_SCHEDULE_DATA_FOUND: 'No schedule found for provided waiting room or user'
}

export const REGULAR_EXPRESSIONS = {
  UUID: /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  TIME: new RegExp('^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$'),
  TELEPHONE: /^(\+\d{1,3}[- ]?)?\d{10}$/,
  DOMAIN: /^[a-zA-Z0-9][\-a-zA-Z0-9]{1,63}$/
}

export enum ACCESS_ROLES {
  patient = 'patient',
  doctor = 'doctor',
  system_admin = 'system administrator',
  clinic_admin = 'clinic administrator'
}

export default {
  EXCEPTION_MESSAGES,
  REGULAR_EXPRESSIONS,
  ACCESS_ROLES
}

export enum WS_EVENT_TYPES {
  participant_joined = 'participant_joined',
  participant_left = 'participant_left'
}

export enum WSS_BROADCAST_MESSAGE_TYPE {
  broadcast_response = 'broadcast_response'
}

export const USER_TOKEN_OBTAIN_TIMEOUT_MS = 30000

export enum SUBSCRIPTIONS_TYPES {
  ON_PARTICIPANT_JOINED = 'participant_joined',
  ON_PARTICIPANT_LEFT = 'participant_left',
  ON_PARTICIPANT_REFERRED = 'participant_referred',
  ON_PARTICIPANT_PICKED = 'participant_picked',
  ON_PATIENT_RELEASED = 'patient_released',
  ON_NEW_CLINIC_ATTACHMENT = 'new_clinic_attachment',
  ON_CLINIC_ATTACHMENT_DECIDE = 'clinic_attachment_decide',
  ON_CLINIC_DECIDE = 'clinic_decide'
}

export enum QUEUES_LITERALS {
  PUSH = 'push_notification',
  SMS = 'send_sms'
}

export enum NOTIFICATION_EVENT_TYPES {
  on_waiting_room_idle = 'ON_WAITING_ROOM_IDLE',
  ON_WAITING_ROOM_QUEUE_ALERT = 'ON_WAITING_ROOM_QUEUE_ALERT',
  ON_NEW_CLINIC_ATTACHMENT = 'ON_NEW_CLINIC_ATTACHMENT',
  ON_CLINIC_ATTACHMENT_DECIDE = 'ON_CLINIC_ATTACHMENT_DECIDE',
  ON_CLINIC_DECIDE = 'ON_CLINIC_DECIDE',
  ON_CLINIC_BOOK_SLOT = 'ON_CLINIC_BOOK_SLOT',
  ON_CLINIC_SLOT_CANCELLED_BY_PATIENT = 'ON_CLINIC_SLOT_CANCELLED_BY_PATIENT',
  ON_CLINIC_SLOT_CANCELLED_BY_ADMIN = 'ON_CLINIC_SLOT_CANCELLED_BY_ADMIN',
  ON_CLINIC_SLOT_APPROVED_BY_ADMIN = 'ON_CLINIC_SLOT_APPROVED_BY_ADMIN',
  ON_CLINIC_BOOK_SLOT_FOR_PATIENT = 'ON_CLINIC_BOOK_SLOT_FOR_PATIENT'
}

export const CLINIC_SUBDOMAIN_PROPERTY = 'siteSubDomain'
