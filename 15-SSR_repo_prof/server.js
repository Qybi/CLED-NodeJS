import fastify from "fastify";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import ejs from 'ejs';
import fastifyFormbody from "@fastify/formbody";
import { request } from 'undici'



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default async function createServer() {
    const app = fastify({
        logger: {transport: {target: 'pino-pretty'}}
    });

    await app.register(fastifyStatic, {
        root: join(__dirname, 'assets'),
        prefix: '/static'
    });

    await app.register(fastifyView, {
        engine: {
            ejs: ejs,
        },
        layout: './template.ejs'
    });

    await app.register(fastifyFormbody);


    app.get('/', async (req, res) => {
        const {statusCode, body} = await request('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');
        app.log.warn(statusCode);
        if(statusCode == 200) {
            const {drinks} = await body.json();
            return res.view('./views/index.ejs', {drinks});
        }

        if(statusCode == 404) {
            return res.view('./views/notfound.ejs');
        }

        return res.view('./views/error.ejs');
    });

    app.get('/detail', async (req, res) => {
        const id = req.query.id;
        const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
        const {statusCode, body} = await request(url);
        const data = await body.json();
        const drink = data.drinks[0];
        drink.ingredients = [];
        for(let i = 1; i <= 15; i++)
        {
            const k = 'strIngredient' + i;
            const ing = drink[k];
            if(ing !== null) {
                drink.ingredients.push(ing);
            }
        }
        return res.view('./views/detail.ejs', {drink});

    });


    return app;
}