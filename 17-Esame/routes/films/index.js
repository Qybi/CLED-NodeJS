import { filmResponseSchema } from "../../schemas/schema.js";
import { request } from "undici";
import _ from "lodash";

export default async function (app) {
  app.get("/", { schema: filmResponseSchema } , async (req, res) => {
    const peopleBaseUrl = "https://swapi.dev/api/people/";
    const starshipsBaseUrl = "https://swapi.dev/api/starships/";

    const films = await (
      await request("https://swapi.dev/api/films/")
    ).body.json();

    if (films.statusCode == 404) {
      return app.httpErrors.notFound();
    }

    // so che è brutto visualmente fare la prima chiamata e poi fare la seconda per la ricorsione, ma non ho trovato
    // un modo migliore per fare tutto nella funzione ricorsiva
    const firstStarshippage = await (await request(starshipsBaseUrl)).body.json();
    const starships = _.concat(firstStarshippage.results, await recursiveApiCall(firstStarshippage.next));

    const firstPeoplePage = await (await request(peopleBaseUrl)).body.json();
    const people = _.concat(firstPeoplePage.results,await recursiveApiCall(firstPeoplePage.next));

    return films.results.map((film) => {
      return {
        title: film.title,
        opening_crawl: film.opening_crawl,
        director: film.director,
        producer: film.producer,
        release_date: film.release_date,
        characters: people.filter((p) => film.characters.includes(p.url)),
        starships: starships.filter((s) => film.starships.includes(s.url)).map((s) => s.name),
      };
    });

  });
}

async function recursiveApiCall(nextPageUrl) {
  if (!nextPageUrl) {
    return [];
  }

  const response = await request(nextPageUrl);
  const data = await response.body.json();
  const next = data.next;

  return [...data.results, ...(await recursiveApiCall(next))];
}
