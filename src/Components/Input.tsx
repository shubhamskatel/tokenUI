import React from "react";

interface Props {
  handleChange: any;
}

const Input = ({ handleChange }: Props) => {
  return (
    <>
      <input
        type="text"
        className="form-control pads"
        id="formGroupExampleInput"
        placeholder="Enter Address"
        onChange={(e: any) => {
          handleChange(e.target.value);
        }}
      />
    </>
  );
};

export default Input;
