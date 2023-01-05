import index from "../../styles/components/line-up/index.module.sass";

function DropdownDay(props) {
  const optionChangeHandler = (event) => {
    props.setFilter(event.target.value);
  };

  return (
    <>
      <select onChange={optionChangeHandler}>
        {props.whatDay.map((option, index) => {
          return (
            <optgroup className={index.option} key={index}>
              <option key={index}>{option}</option>
            </optgroup>
          );
        })}
      </select>
    </>
  );
}

export default DropdownDay;
