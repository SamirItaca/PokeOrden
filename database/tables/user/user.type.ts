export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  teams: Object[];
  battlesP1: Object[];
  battlesP2: Object[];
  pokedex: Object[];
  createdAt: Date
}

export interface LoginUserDTO {
  username: string;
  password: string;
}

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface EditUserDTO {
  id: number,
  newUsername: string,
  newEmail: string
}

export interface ChangePasswordDTO {
  id: number,
  password: string,
  newPassword: string
}