import React from "react";

interface Props {
  handleFunction: (e: any) => Promise<void>;
  children: any;
}

const Button = ({ handleFunction, children }: Props) => {
  return (
    <>
      <button className="btn btn-primary pads" onClick={handleFunction}>
        {children}
      </button>
    </>
  );
};

export default Button;
