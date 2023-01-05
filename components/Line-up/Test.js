import BandList from "../../components/Line-up/BandList";
import BandListGenres from "../../components/Line-up/BandListGenres";
import Dropdown from "../../components/Line-up/Dropdown";
import FilterBox from "../../components/Line-up/FilterBox";

import Test from "../../components/Line-up/Test";
import playingWhen from "../../js_functions/playingWhen";
import sortList from "../../js_functions/sortList";
import filterPerDay from "../../js_functions/filterPerDay";

import changeSortDir from "../../js_functions/changeSortDir";
import getRandomImage from "../../js_functions/getRandomImage";
import DropdownDay from "../../components/Line-up/DropdownDay";
import DaySelector from "../../components/Line-up/DaySelector.js";
import AlphabetSelector from "../../components/Line-up/AlphabetSelector.js";

import index from "../../styles/components/line-up/index.module.sass";

import { useEffect, useState } from "react";

function LineUp({ bands, genres, playingWhenData, bandsReset }) {
  const [filterGenre, setFilterGenre] = useState([]);
  const [filterDay, setFilterDay] = useState([]);
  const [filterBand, setFilterBand] = useState([]);
  const [letter, setLetter] = useState();
  const [genresDropdown, setGenresdropdown] = useState(genres);
  const [actData, setActData] = useState(playingWhenData);
  const [sortDir, setSortDir] = useState("1");
  const [filterSettings, setFilterSettings] = useState("alphabet");
  const [resetData, setResetData] = useState(bandsReset);
  const [shownDays, setShownDays] = useState([]);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const whatDay = ["all", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  function daysShowed(result) {
    const getDays = result.map((band) => {
      return band.day;
    });
    const getDaysList = [...new Set(getDays)]; //removes duplicates

    setShownDays(getDaysList);
    return getDaysList;
  }

  function filterAllGenres(bands, filterGenre) {
    const result = bands.filter((band) => {
      if (filterGenre.length !== 0) {
        return filterGenre.some((filt) => {
          return band.genre.includes(filt);
        });
      } else {
        return band;
      }
    });

    return result;
  }

  useEffect(() => {
    setFilterBand(bands);

    let filterResult = filterPerDay(bands, actData, filterDay, "band");
    setFilterBand(filterResult);
    filterResult = filterAllGenres(bands, filterGenre);

    //loads all bands on a new screen
    if (filterBand.length == 0 && filterDay.length == 0 && filterGenre == 0) {
      setFilterBand(bands);
    } else {
      setFilterBand(filterResult);
      daysShowed(filterResult);
    }
  }, [filterSettings, filterGenre, filterDay, sortDir]);

  function changeView(setFilterSettings, setFilterBand, bands, bool) {
    setFilterSettings("alphabet");

    setFilterBand(bands);
  }

  function changeView2(setFilterSettings, setFilterBand, bands, bool) {
    setFilterSettings("days");

    setFilterDay("all");
  }

  function changeView3(setFilterSettings, setFilterBand, bands, bool) {
    setFilterSettings("genres");

    setFilterDay("all");
  }

  return (
    <>
      <section className={index.entirePage}>
        <h1 className={index.big}>Line-up</h1>

        {/*       <p>filter: {filterGenre}</p>
      <p>filter: {filterDay}</p> */}
        {/*       <button onClick={() => changeSortDir(sortDir, setSortDir)}>Change Direction</button> */}
        <div className={index.selection}>
          <span
            className={`${index.selectorBtn} ${filterSettings == "alphabet" && index.active}`} //if filterSettings is true, add the active class
            onClick={() => changeView(setFilterSettings, setFilterBand, bands)}>
            A-Z
          </span>

          <span
            className={`${index.selectorBtn} ${!filterSettings == "days" && index.active}`}
            onClick={() => changeView2(setFilterSettings, setFilterBand, bands)}>
            DAYS |
          </span>
          <span
            className={`${index.selectorBtn} ${!filterSettings == "genres" && index.active}`}
            onClick={() => changeView3(setFilterSettings, setFilterBand, bands)}>
            GENRES |
          </span>
        </div>
        <hr className={index.hr}></hr>
        {filterSettings === "alphabet" && <AlphabetSelector></AlphabetSelector>}
        {filterSettings === "days" && <DaySelector></DaySelector>}

        {filterSettings === "genres" && (
          <>
            <span className={index.filterText}>Genre:&nbsp; </span>
            <Dropdown filterThis={genresDropdown} setFilter={setFilterGenre} filterList={filterGenre} type='Genres' />
            <span className={index.filterText}>&nbsp; Day:&nbsp; </span>
            <DropdownDay setFilter={setFilterDay} filterList={filterDay} whatDay={whatDay} type='Days' />
          </>
        )}
        <hr className={index.hr}></hr>
        <FilterBox setFilter={setFilterGenre} filterList={filterGenre} />
        {filterSettings === "alphabet" && (
          <BandList bands={filterBand} filterResult={filterBand} actData={actData} filterGenre={filterGenre} />
        )}

        {filterSettings === "days" && (
          <BandListGenres
            shownDays={filterDay}
            allBands={bands}
            bands={filterBand}
            filterResult={filterBand}
            filterDay={filterDay}
          />
        )}
      </section>
    </>
  );
}

export async function getStaticProps() {
  const response = await fetch("http://localhost:8080/bands");
  const responseSchedule = await fetch("http://localhost:8080/schedule");
  const data = await response.json();
  const dataSchedule = await responseSchedule.json();
  const genreData = await data.map((genre) => {
    return genre.genre;
  });

  const genres = [...new Set(genreData)]; // remove duplicates from the array

  const playingWhenData = playingWhen(dataSchedule); // extracting information from the diffrent acts
  const combined = combineData(data, playingWhenData); // act data is added to the band data

  function combineData(data, playingWhenData) {
    let combinedList = data.map((band) => {
      for (let i = 0; i < playingWhenData.length; i++) {
        if (band.name == playingWhenData[i].id) {
          band.day = playingWhenData[i].day;
          band.scene = playingWhenData[i].scene;
          band.start = playingWhenData[i].start;
          band.end = playingWhenData[i].end;
        }
      }

      return band;
    });
    return combinedList;
  }

  return {
    props: {
      bands: combined,
      genres,
      playingWhenData,
    },
  };
}

export default LineUp;
