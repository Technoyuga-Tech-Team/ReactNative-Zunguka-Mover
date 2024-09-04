import { UserData } from "./user.types";

export interface AllChatDataProps {
  status: number;
  data: ChatDataProps;
  message: string;
}

export interface ChatDataProps {
  list: ChatDataList[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export interface ChatDataList {
  user_id: number;
  created_at: string;
  first_name: string;
  username: string;
  id: number;
  is_read: number;
  is_image: number;
  item_id: string;
  last_name: string;
  message: string;
  phone_number: null;
  profile_image: null;
  receiver_id: number;
  sender_id: number;
  totalUnreadMessages: number;
  updated_at: string;
}

export interface ChatRoomMessageProps {
  status: number;
  data: ChatMessageProps;
  message: string;
}

export interface ChatMessageProps {
  receiverDetail: receiverDetailsProps;
  list: MessageList[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

interface image {
  image: string;
}

export interface MessageList {
  id?: number;
  receiver_id: string;
  sender_id: number;
  item_id?: number;
  message: {
    id: number;
    user_id: number;
    chat_id: number;
    image: string;
    created_at: string;
    updated_at: string;
  };
  images?: image[];
  is_read?: number;
  user_type?: string;
  messageTime: string;
  created_at?: string;
}

export interface receiverDetailsProps {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_image: null;
  new_message: number;
  online: number;
}
