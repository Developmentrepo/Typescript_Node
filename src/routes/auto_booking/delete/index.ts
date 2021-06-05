import { IncomingMessage, ServerResponse } from 'http'
import {
  MicroController,
  Catch,
  handler_context,
  Decoder,
  DecodeAccessToken,
  Send,
  ParseBody,
  AcceptACL
} from '../../../etc/http/micro_controller'

import { verifyToken } from '../../../handlers/jwt'
import { auto_booking_domain } from '../../../domains/auto_booking/index'
import { ACCESS_ROLES } from '../../../constants'

class Controller implements MicroController {
  @Catch
  @Send(200)
  @DecodeAccessToken(verifyToken as Decoder)
  @AcceptACL([ACCESS_ROLES.clinic_admin, ACCESS_ROLES.doctor])
  @ParseBody
  async POST(req: IncomingMessage, res: ServerResponse, ctx: handler_context) {
    return auto_booking_domain.delete_auto_booking_schedules({
      ...(req.body as any)
    })
  }
}

export = new Controller()
