import axios, { AxiosResponse } from 'axios';
import { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api/notes';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  
}

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const cleanParams = { ...params };
  if (!cleanParams.search) delete cleanParams.search;
  const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get('', { params: cleanParams });
  return response.data;
};

export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.post('', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.delete(`/${id}`);
  return response.data;
}; 