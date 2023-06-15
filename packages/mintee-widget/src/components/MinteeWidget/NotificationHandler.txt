import { INotificationHandler } from "@minteeble/utils";
import { ToastOptions, toast } from "react-toastify";

export class NotificationHandler implements INotificationHandler {
  /**
   * Class instanceto Follow singleton design
   */
  private static _instance: NotificationHandler;

  /**
   * Get instance method or create if not exists
   */
  public static get instance(): NotificationHandler {
    if (!this._instance) {
      this._instance = new NotificationHandler();
    }

    return this._instance;
  }

  /**
   * Toastify common config
   */
  private _config: ToastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
  };

  constructor() {}

  /**
   * Success Notification
   *
   * @param text Notification Text
   */
  public success(text: string): void {
    toast.success(text, this._config);
  }

  /**
   * Error Notification
   *
   * @param text Notification Text
   */
  public error(err: any): void {
    let text;
    if (typeof err === "string") {
      text = err;
    } else if (err.message) {
      text = err.message;
    } else {
      text = "Unknown error.";
    }

    toast.error(text, this._config);
  }

  warning(message: string): void {
    toast.warning(message, this._config);
  }

  info(message: string): void {
    toast.info(message, this._config);
  }
}
