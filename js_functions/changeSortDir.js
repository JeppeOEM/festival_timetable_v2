function changeSortDir(sortDir, setSortDir) {
  if (sortDir === "1") {
    setSortDir("-1");
  } else {
    setSortDir("1");
  }
}

export default changeSortDir;
