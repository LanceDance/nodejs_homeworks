const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const app = new Koa();
const router = new Router({
    prefix: '/movies'
});


const movies = [
    {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
    {id: 102, name: "Inception", year: 2010, rating: 8.7},
    {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
    {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
 ];

app.use(logger());
router.get('/', (ctx, next) =>
{
ctx.body = movies;
});

function getSingleMovie(id) {
    let OneMovie = movies.find(movie => movie.id == id);
    return OneMovie;
}
const charAndSpace = '/:id([0-9]{3,})';
router.get(charAndSpace, async (ctx) => {
    try {
      let movie = await getSingleMovie(ctx.params.id);
      console.log(movie);

      if (typeof(movie) != 'undefined')
      {
      ctx.body = {
        status: 'success',
        data: movie
        };
    }
      else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That movie does not exist.'
            };
        }
    } catch (err) {
    }
  })
  
function addMovie(name, year, rating) {
  newId = movies[movies.length - 1].id
  newId ++;
  movies.push({'id': newId, 'name': name, 'year': year, 'rating': rating})


}

  router.post('/', async (ctx) => {
    try {
      const movie = await addMovie(ctx.request.body);
      if (movie.length) {
        ctx.status = 201;
        ctx.body = {
          status: 'success',
          data: movie
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          status: 'error',
          message: 'Something went wrong.'
        };
      }
    } catch (err) {
      console.log(err)
    }
  })
  
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);

