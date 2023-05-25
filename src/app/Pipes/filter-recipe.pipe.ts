import { Pipe, PipeTransform } from '@angular/core';
import { Tag } from '../Models/Tag';

@Pipe({
  name: 'filterRecipe'
})
export class FilterRecipePipe implements PipeTransform {

  transform(values: any[], search: any) {
    // FILTER PIPE FOR RECIPES
    if (search === '' || search === undefined || search === null) {
      return values;
    } else {
      let recipes = [];
      for (let recipe of values) {
        if (
          (recipe.title && recipe.title.toLowerCase().includes(search.toLowerCase())) ||
          (recipe.description && recipe.description.toLowerCase().includes(search.toLowerCase())) ||
          (recipe.difficulty && recipe.difficulty.toLowerCase().includes(search.toLowerCase())) ||
          (recipe.tags &&
            recipe.tags.some((tag: Tag) =>
              tag.tagName.toLowerCase().includes(search.toLowerCase())
            ))
        ) {
          recipes.push(recipe);
        }
      }
      return recipes;
    }
  }
}
