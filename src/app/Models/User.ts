import { Recipe } from "./Recipe";

export class User {

  id!: number;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  email!: string;
  password!: string;
  isBlocked!: boolean;

  recipes!: Recipe[];
  favoriteRecipes!: Recipe[];


  profilePicture!: ArrayBuffer | null;
  role!: string;
  token!: string;
  refreshToken!: string;
  refreshTokenExpiryTime!: Date ;
}
