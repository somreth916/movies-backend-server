const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware
async function hasMovies(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

// Read & List
function read(req, res) {
    const { movie } = res.locals;
    res.json({ data: movie });
}

async function list(req, res) {
    const isShowing = req.query.is_showing;
    const moviesList = isShowing != false ? await service.listAllShowing() : await service.list();
    res.json({ data: moviesList });
}

async function getTheaters(req, res) {
    const movieId = req.params.movieId;
    res.json({ data: await service.listTheaters(movieId) });
}

async function getReviews(req, res) {
    const movieId = req.params.movieId;
    const result = await service.listReviews(movieId);
    res.json({ data: result });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(hasMovies), asyncErrorBoundary(read)],
    getTheaters: [asyncErrorBoundary(hasMovies), asyncErrorBoundary(getTheaters)],
    getReviews: [asyncErrorBoundary(hasMovies), asyncErrorBoundary(getReviews)],
}