import { Notification } from "./type";
import notificationModel from "../../repositories/notification/notificationModel";
class NotificationController {
  animalGetId(id: number) {
    return notificationModel.getid(id);
  }
  animalCreate(notification: Notification): Promise<unknown> {
    return notificationModel.create(notification);
  }
}

export default new NotificationController();
