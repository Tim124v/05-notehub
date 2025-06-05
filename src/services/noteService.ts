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

export type CreateNoteDto = {
  title: string;
  content: string;
  tag: Note['tag'];
};

export const fetchNotes = async (search: string, page: number): Promise<FetchNotesResponse> => {
  const params: FetchNotesParams = {
    page,
    search: search || undefined
  };
  const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get('', { params });
  return response.data;
};

export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.post('', note);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.delete(`/${id}`);
  return response.data;
}; 