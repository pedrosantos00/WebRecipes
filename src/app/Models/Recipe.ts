import {User} from './User';
import {Ingredient} from './Ingredient';
import {Step} from './Step';
import {Tag} from './Tag';


export class Recipe {
  id!: number;
  title!: string;
  description!: string;
  img!: ArrayBuffer;
  estimatedTime!: number;
  difficulty!: string;
  mealsPerRecipe!: number;
  rate!: number;
  userId!: number;
  user!: User;
  tags!: Tag[];
  ingredients!: Ingredient[];
  steps!: Step[];
  comments!: Comment[];
  favoritedBy!: User[];
}
