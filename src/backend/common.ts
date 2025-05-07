export type Uuid = string;

export const BASE_URL = 'http://127.0.0.1:8004'
//export const BASE_URL = 'https://club-sabana-backend.fly.dev'

export enum LevelName {
  BEGINNER = "BEGGINER",
  AMATEUR = "AMATEUR",
  PROFESSIONAL = "PROFESSIONAL",
}

export const ALL_LEVELS = Object.values(LevelName) as [string, ...string[]]

export enum IdType {
  CC = "CC",
}

export enum URol {
  USER = "USER",
  ADMIN = "ADMIN",
  TRAINER = "TRAINER",
}
