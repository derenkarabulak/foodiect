const recipe_key = process.env.REACT_APP_RECIPE_KEY;
const recipe_id = process.env.REACT_APP_RECIPE_ID;

const nutr_id = process.env.REACT_APP_NUTR_ID;
const nutr_key = process.env.REACT_APP_NUTR_KEY;

const requests = {
  requestAll: `https://api.edamam.com/api/recipes/v2?type=any&beta=false&imageSize=REGULAR&app_id=${recipe_id}&app_key=${recipe_key}`,
  requestNutrition: `https://api.edamam.com/api/nutrition-data?app_id=${nutr_id}&app_key=${nutr_key}&ingr=`,
};

export default requests;
