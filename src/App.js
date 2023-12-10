import React, { useEffect, useState } from "react";
import Tmdb from "./tmdb";
import "./App.css";
import MovieRow from "./components/movieRow";
import Header from "./components/header";
import FeaturedMovie from "./components/featuredMovie";
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBalckHeader] = useState(false);
  useEffect(() => {
    const loadAll = async () => {
      //pegando a lista total dos itens da API
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // pegando o filme principal
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      setFeaturedData(chosenInfo);
    };
    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBalckHeader(true);
      } else {
        setBalckHeader(false);
      }
    };
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito com{" "}
        <span role="img" aria-label="coração">
          ❤️
        </span>
        pelo Natan Taques <br />
        Direitos de imagem para Netflix <br />
        Dados pegos do site Themoviedb.org
      </footer>
      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_1280,c_limit/Netflix_LoadTime.gif"
            alt="loading"
          ></img>
        </div>
      )}
    </div>
  );
};
