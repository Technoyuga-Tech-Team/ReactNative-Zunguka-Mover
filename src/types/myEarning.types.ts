import { LoadingState } from "./global.types";

export interface MyEarningState {
  loading: LoadingState;
}

export interface PayoutHistoryState {
  status: number;
  message: string;
  data: PayoutHistoryData;
}

export interface PayoutHistoryData {
  data: PayoutHistoryItem[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export interface PayoutHistoryItem {
  id: number;
  mover_id: number;
  status: string;
  amount: number;
  withdraw_date: string;
  created_at: string;
  updated_at: string;
}
