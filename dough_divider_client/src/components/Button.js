/*
  -Similar to project 2 code:
  https://github.com/CS-396-Full-Stack-Software-Eng/project-2-recipe-step-tracker-v2-cs2027/blob/main/recipe_tracker_client/src/components/Button.js
*/

import "../styles/Button.css";

const Button = ({
  height,
  width,
  fontSize,
  color,
  text,
  otherClasses,
  onClickHandler,
}) => {
  return (
    <button
      className={"button " + otherClasses}
      style={{
        height: height,
        width: width,
        fontSize: fontSize,
        backgroundColor: color,
      }}
      onClick={onClickHandler}
    >
      {text}
    </button>
  );
};

export default Button;
