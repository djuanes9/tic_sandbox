import React from "react";
const imgPru =
  "https://img.freepik.com/vector-premium/logotipo-ep_853558-5353.jpg?w=996";

function Heading() {
  return (
    <header>
      <h1 contentEditable="false" spellCheck="false">
        Subproceso 2: Molienda de Granos
      </h1>
      <img className="imgPrueba" alt="EP" src={imgPru} />
    </header>
  );
}

export default Heading;
