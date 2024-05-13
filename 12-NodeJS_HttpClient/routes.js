import { fetch, request } from "undici";

let cocktails = [];

export default async function routes(app) {
  app.get("/", async (req, res) => {
    const response = await request("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail");
    if (response.statusCode == 404) {
      return res.send("./views/404.ejs");
    }   

    cocktails = (await response.body.json()).drinks;
    return res.view("./views/index.ejs", {
      cocktails: cocktails
    });
  });

  app.get("/detail", async (req, res) => {
    const id = req.query.id;
    const response = await request(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (response.statusCode == 404) {
      return res.send("./views/404.ejs");
    }

    const cocktail = (await response.body.json()).drinks[0];
    let ingredients = [];
    for (let i = 1; i <= 15; i++) {
      if (cocktail[`strIngredient${i}`]) {
        ingredients.push({
          ingredient: cocktail[`strIngredient${i}`],
          measure: cocktail[`strMeasure${i}`]
        });
      }
    }

    return res.view("./views/cocktail.ejs", {
      cocktail: cocktail,
      ingredients: ingredients
    });
  });
}
