import { Socket, io } from "socket.io-client";
import { SOCKET_URL } from "../constant";

export const socket: Socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 5000,
  transports: ["websocket"],
});

export enum socketEvent {
  CONNECT = "connect",
  JOIN_ROOM = "joinRoom",
  LEAVE_ROOM = "leaveRoom",
  SHOW_ONLINE = "addUser",
  SHOW_OFFLINE = "logOut",
  USER_IS_TYPING = "typing",
  USER_IS_NOT_TYPING = "notTyping",
  DISCONNECT = "disconnect",
  MESSAGE_TO_ROOM = "messageToRoom",
  MESSAGE = "message",
  READ_MESSAGE = "read message",
}
