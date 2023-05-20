import { Recipe } from "./Recipe";
import { favoritedBy } from "./favoritedBy";

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
