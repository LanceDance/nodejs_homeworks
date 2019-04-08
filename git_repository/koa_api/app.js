'use strict'
const Koa = require('koa');
const logger = require('koa-pino-logger')
const Router = require('koa-router');
const app = new Koa();
const koaBody = require('koa-body');
const router = new Router({
    prefix: '/movies'
});


const movies = [
    {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
    {id: 102, name: "Inception", year: 2010, rating: 8.7},
    {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
    {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
 ];

 let iterator = movies.map(a => a.id);
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
  
function addMovie(body) {
  let newId = movies[movies.length - 1].id;
  newId ++;
  movies.push({'id': newId, 'name': body.name, 'year': body.year, 'rating': body.rating});

}

router.post('/', koaBody(), async (ctx) => {
  try {
    // console.log(dataForMovie);
    let propertiesOfMovie = ctx.request.body;
    let lenghtOfNewMovie = Object.keys(propertiesOfMovie).length;
    if (lenghtOfNewMovie == 3) {
    await addMovie(propertiesOfMovie);
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: movies
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Sorry, but new object has to have name, year, rating.'
      };
    }
  } catch (err) {
    console.log(err)
  }
})

function deleteMovie(id) {
  let index = movies.findIndex(x => x.id ==id)
  if (index != -1)
  {
    movies.splice(index,1);
    return movies;
  }
  else 
  {
    return 0;
  }
}

router.delete('/:id', async (ctx) =>{
  try {
    const movie = await deleteMovie(ctx.params.id);
    if (movie != 0) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: movie
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That movie does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
});

function updateMovie(id, body)
{
  let index = movies.findIndex(x => x.id ==id)
  if (index != -1)
  {
    if (Object.keys(body)[0] in movies[index]) {
      Object.assign(movies[index],body)
    }
  }
  else 
  {
    return 0;
  }
}
router.patch('/:id', koaBody(), async (ctx) => {
  try {
    let changeAtributes = ctx.request.body;
    let keysAtributes = Object.keys(changeAtributes);
    if (iterator.includes(parseInt(ctx.params.id))) {
      if (keysAtributes.includes('name') || keysAtributes.includes('year') || keysAtributes.includes('rating')) {
        const movie = await updateMovie(ctx.params.id, changeAtributes);
        ctx.status = 200;
        ctx.body = {
          status: 'success',
          data: movies
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That parameter doesnt exist. Choose between year, name, rating.'
        };
      }}
    else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'The id of the film is not in db'
    }
  };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);

